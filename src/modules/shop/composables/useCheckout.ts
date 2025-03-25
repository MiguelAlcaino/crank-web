import type { ApiService } from '@/services/apiService'
import { onMounted, readonly, ref } from 'vue'
import { appStore } from '@/stores/appStorage'
import type { CardData } from '@/modules/shop/interfaces/card-data'

export const useCheckout = (apiService: ApiService) => {
  const hasError = ref<boolean>(false)
  const isLoading = ref<boolean>(false)

  const hiddenPayForm = ref<string>('')

  onMounted(() => {})

  async function payNow(deviceFingerprint: string): Promise<void> {
    try {
      const merchantReference = await apiService.generateMerchantReference(appStore().site)

      hiddenPayForm.value = await apiService.getPayfortForm(
        appStore().site,
        false,
        deviceFingerprint,
        merchantReference
      )

      console.log(hiddenPayForm.value)
    } catch (e) {
    } finally {
    }
  }

  async function getPayfortForm(deviceFingerprint: string): Promise<string> {
    try {
      const merchantReference = await apiService.generateMerchantReference(appStore().site)

      return await apiService.getPayfortForm(
        appStore().site,
        false,
        deviceFingerprint,
        merchantReference
      )
    } catch (e) {
      return ''
    } finally {
    }
  }

  // Luhn algorithm for card number validation
  const luhnCheck = (cardNumber: string): boolean => {
    let sum = 0
    let shouldDouble = false

    // Loop through values starting from the rightmost digit
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i))

      if (shouldDouble) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }

      sum += digit
      shouldDouble = !shouldDouble
    }

    return sum % 10 === 0
  }

  return {
    // Properties
    isLoading: readonly(isLoading),
    hasError: hasError,
    hiddenPayForm: hiddenPayForm,

    // Methods
    payNow,
    getPayfortForm,
    luhnCheck,
  }
}
