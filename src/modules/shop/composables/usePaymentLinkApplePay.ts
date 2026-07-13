import { computed, ref } from 'vue'
import { useShopApiService } from '@/modules/shop/composables/useShopApiService'
import type { SiteEnum } from '@/modules/shared/interfaces/site.enum'
import type { PaymentLinkBuyer } from '@/modules/shop/composables/usePaymentLinkCheckout'

type ApplePayResult = {
  result: boolean
  merchantReference: string
}

type ApplePayConfigData = {
  currencyCode: string
  countryCode: string
  displayName: string
}

/**
 * Apple Pay for the anonymous payment-link checkout. Mirrors the shopping-cart useApplePay, but the
 * merchant reference comes from createPaymentLinkTransaction (which also persists the buyer's
 * name/email/mobile phone) instead of locking a shopping cart, and every backend call is anonymous.
 */
export const usePaymentLinkApplePay = () => {
  const shopApi = useShopApiService()
  const paymentsBaseUrl = import.meta.env.VITE_CRANK_PAYMENTS_URL as string

  const config = ref<ApplePayConfigData | null>(null)
  const isProcessing = ref(false)
  const error = ref<string | null>(null)

  const isApplePayAvailable = computed(() => {
    return !!window.ApplePaySession && window.self === window.top
  })

  async function fetchApplePayConfig(site: SiteEnum): Promise<void> {
    try {
      config.value = await shopApi.getPublicApplePayConfig(site)
    } catch (e) {
      console.error('Failed to fetch Apple Pay config:', e)
      config.value = null
    }
  }

  function startApplePayPayment(
    buyer: PaymentLinkBuyer,
    amount: number,
    itemDescription: string
  ): Promise<ApplePayResult> {
    if (!config.value) {
      throw new Error('Apple Pay configuration not loaded.')
    }

    isProcessing.value = true
    error.value = null

    const applePayConfig = config.value

    // ApplePaySession must be created synchronously from a user gesture handler.
    // Any async work (like creating the transaction) must happen inside session callbacks.
    const paymentRequest: ApplePayPaymentRequest = {
      currencyCode: applePayConfig.currencyCode,
      countryCode: applePayConfig.countryCode,
      lineItems: [{ label: itemDescription, amount }],
      total: {
        label: applePayConfig.displayName,
        amount
      },
      supportedNetworks: ['amex', 'masterCard', 'visa'],
      merchantCapabilities: ['supports3DS']
    }

    const session = new ApplePaySession(1, paymentRequest)

    let paymentProcessStarted = false
    let merchantReference = ''

    return new Promise<ApplePayResult>((resolve) => {
      session.onvalidatemerchant = async (event) => {
        try {
          // Create the payment-link transaction here (inside the async callback) to keep the user
          // gesture chain intact. This persists the buyer's name/email/mobile phone.
          const created = await shopApi.createPaymentLinkTransaction({
            paymentLinkId: buyer.paymentLinkId,
            fullName: buyer.fullName,
            email: buyer.email,
            mobilePhone: buyer.mobilePhone
          })
          merchantReference = created.merchantReference

          const response = await fetch(
            `${paymentsBaseUrl}/apple-pay/verify-merchant/payment-link/${encodeURIComponent(
              buyer.paymentLinkId
            )}?u=${encodeURIComponent(event.validationURL)}`
          )
          const merchantSession = await response.json()
          session.completeMerchantValidation(merchantSession)
        } catch (e) {
          console.error('Merchant validation failed:', e)
          error.value = e instanceof Error ? e.message : 'Merchant validation failed.'
          session.abort()
          isProcessing.value = false
          resolve({ result: false, merchantReference })
        }
      }

      session.onpaymentauthorized = async (event) => {
        paymentProcessStarted = true
        try {
          const response = await fetch(`${paymentsBaseUrl}/payfort/apple-pay-process-purchase`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              applePayment: event.payment.token,
              merchantReference
            })
          })

          const data = await response.json()

          if (response.ok) {
            session.completePayment(ApplePaySession.STATUS_SUCCESS)
            isProcessing.value = false
            resolve({ result: true, merchantReference })
          } else {
            console.error('Payment processing failed:', data)
            session.completePayment(ApplePaySession.STATUS_FAILURE)
            error.value = 'Payment processing failed.'
            isProcessing.value = false
            resolve({ result: false, merchantReference })
          }
        } catch (e) {
          console.error('Error sending payment token:', e)
          session.completePayment(ApplePaySession.STATUS_FAILURE)
          error.value = 'An error occurred while processing the payment.'
          isProcessing.value = false
          resolve({ result: false, merchantReference })
        }
      }

      session.oncancel = () => {
        if (!paymentProcessStarted) {
          isProcessing.value = false
          resolve({ result: false, merchantReference })
        }
      }

      session.begin()
    })
  }

  return {
    isApplePayAvailable,
    fetchApplePayConfig,
    startApplePayPayment,
    isProcessing,
    error
  }
}
