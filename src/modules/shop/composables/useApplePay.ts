import { computed, ref } from 'vue'
import { useShopApiService } from '@/modules/shop/composables/useShopApiService'
import { appStore } from '@/stores/appStorage'
import { useAuthenticationStore } from '@/stores/authToken'

type ApplePayResult = {
  result: boolean
  merchantReference: string
  errorMessage?: string
}

type ApplePayConfigData = {
  currencyCode: string
  countryCode: string
  displayName: string
}

export const useApplePay = () => {
  const shopApi = useShopApiService()
  const paymentsBaseUrl = import.meta.env.VITE_CRANK_PAYMENTS_URL as string

  const config = ref<ApplePayConfigData | null>(null)
  const isProcessing = ref(false)
  const error = ref<string | null>(null)

  const isApplePayAvailable = computed(() => {
    return !!window.ApplePaySession && window.self === window.top
  })

  async function fetchApplePayConfig(): Promise<void> {
    try {
      config.value = await shopApi.getApplePayConfig(appStore().site)
    } catch (e) {
      console.error('Failed to fetch Apple Pay config:', e)
      config.value = null
    }
  }

  function startApplePayPayment(amount: number, itemDescription: string): Promise<ApplePayResult> {
    if (!config.value) {
      throw new Error('Apple Pay configuration not loaded.')
    }

    isProcessing.value = true
    error.value = null

    const applePayConfig = config.value
    const authStore = useAuthenticationStore()

    // ApplePaySession must be created synchronously from a user gesture handler.
    // Any async work (like locking the cart) must happen inside session callbacks.
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
          // Lock the cart here (inside the async callback) to avoid breaking the user gesture chain
          const lockResult = await shopApi.lockShoppingCart(appStore().site)
          if (!lockResult.isLocked) {
            throw new Error('Could not secure the shopping cart for payment. Please try again.')
          }
          merchantReference = lockResult.merchantReference

          const response = await fetch(
            `${paymentsBaseUrl}/apple-pay/verify-merchant?u=${encodeURIComponent(
              event.validationURL
            )}`,
            {
              headers: {
                Authorization: `Bearer ${authStore.token}`
              }
            }
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

      session.onshippingcontactselected = () => {
        const newTotal: ApplePayLineItem = {
          type: 'final',
          label: applePayConfig.displayName,
          amount
        }
        const newLineItems: ApplePayLineItem[] = [{ type: 'final', label: itemDescription, amount }]
        session.completeShippingContactSelection(
          ApplePaySession.STATUS_SUCCESS,
          '',
          newTotal,
          newLineItems
        )
      }

      session.onshippingmethodselected = () => {
        const newTotal: ApplePayLineItem = {
          type: 'final',
          label: applePayConfig.displayName,
          amount
        }
        const newLineItems: ApplePayLineItem[] = [{ type: 'final', label: itemDescription, amount }]
        session.completeShippingMethodSelection(
          ApplePaySession.STATUS_SUCCESS,
          newTotal,
          newLineItems
        )
      }

      session.onpaymentmethodselected = () => {
        const newTotal: ApplePayLineItem = {
          type: 'final',
          label: applePayConfig.displayName,
          amount
        }
        const newLineItems: ApplePayLineItem[] = [{ type: 'final', label: itemDescription, amount }]
        session.completePaymentMethodSelection(newTotal, newLineItems)
      }

      session.onpaymentauthorized = async (event) => {
        paymentProcessStarted = true
        try {
          const response = await fetch(`${paymentsBaseUrl}/payfort/apple-pay-process-purchase`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authStore.token}`
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
            const errorMessage = data?.message ?? 'Payment processing failed.'
            error.value = errorMessage
            isProcessing.value = false
            resolve({ result: false, merchantReference, errorMessage })
          }
        } catch (e) {
          console.error('Error sending payment token:', e)
          session.completePayment(ApplePaySession.STATUS_FAILURE)
          const errorMessage = 'An error occurred while processing the payment.'
          error.value = errorMessage
          isProcessing.value = false
          resolve({ result: false, merchantReference, errorMessage })
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
