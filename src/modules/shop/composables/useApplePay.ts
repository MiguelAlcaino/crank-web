import { computed, ref } from 'vue'
import { useShopApiService } from '@/modules/shop/composables/useShopApiService'
import { appStore } from '@/stores/appStorage'
import { useAuthenticationStore } from '@/stores/authToken'

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

  async function startApplePayPayment(
    merchantReference: string,
    amount: number,
    itemDescription: string
  ): Promise<boolean> {
    if (!config.value) {
      throw new Error('Apple Pay configuration not loaded.')
    }

    isProcessing.value = true
    error.value = null

    const applePayConfig = config.value
    const authStore = useAuthenticationStore()

    return new Promise<boolean>((resolve) => {
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

      session.onvalidatemerchant = async (event) => {
        try {
          const response = await fetch(
            `${paymentsBaseUrl}/apple-pay/verify-merchant?u=${encodeURIComponent(event.validationURL)}`,
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
          error.value = 'Merchant validation failed.'
          session.completePayment(ApplePaySession.STATUS_FAILURE)
          isProcessing.value = false
          resolve(false)
        }
      }

      session.onshippingcontactselected = () => {
        const newTotal: ApplePayLineItem = {
          type: 'final',
          label: applePayConfig.displayName,
          amount
        }
        const newLineItems: ApplePayLineItem[] = [
          { type: 'final', label: itemDescription, amount }
        ]
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
        const newLineItems: ApplePayLineItem[] = [
          { type: 'final', label: itemDescription, amount }
        ]
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
        const newLineItems: ApplePayLineItem[] = [
          { type: 'final', label: itemDescription, amount }
        ]
        session.completePaymentMethodSelection(newTotal, newLineItems)
      }

      session.onpaymentauthorized = async (event) => {
        paymentProcessStarted = true
        try {
          const response = await fetch(
            `${paymentsBaseUrl}/payfort/apple-pay-process-purchase`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authStore.token}`
              },
              body: JSON.stringify({
                applePayment: event.payment.token,
                merchantReference
              })
            }
          )

          const data = await response.json()

          if (response.ok) {
            session.completePayment(ApplePaySession.STATUS_SUCCESS)
            isProcessing.value = false
            resolve(true)
          } else {
            console.error('Payment processing failed:', data)
            session.completePayment(ApplePaySession.STATUS_FAILURE)
            error.value = 'Payment processing failed.'
            isProcessing.value = false
            resolve(false)
          }
        } catch (e) {
          console.error('Error sending payment token:', e)
          session.completePayment(ApplePaySession.STATUS_FAILURE)
          error.value = 'An error occurred while processing the payment.'
          isProcessing.value = false
          resolve(false)
        }
      }

      session.oncancel = () => {
        if (!paymentProcessStarted) {
          isProcessing.value = false
          resolve(false)
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
