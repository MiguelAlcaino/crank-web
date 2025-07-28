import { PaymentTransactionStatusEnum } from '@/gql/graphql'
import { ApiError } from '@/services/ApiService'
import type { IApiService } from '@/services/IApiService'
import { onMounted, readonly, ref } from 'vue'
import { useRoute } from 'vue-router'

/**
 * Manages the logic for the post-checkout page.
 * Its main responsibility is to verify the actual status of a transaction
 * using the merchant_reference provided in the URL by the payment gateway.
 *
 * @param apiService An instance of the API service.
 */
export const useAfterCheckout = (apiService: IApiService) => {
  const route = useRoute()

  // --- STATE ---
  const isLoading = ref<boolean>(false)
  const hasError = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const purchaseStatus = ref<PaymentTransactionStatusEnum | null>(null)
  const merchantReference = ref<string | null>(null)

  /**
   * Orchestrates the transaction verification process.
   * It runs once the component is mounted.
   */
  const verifyTransaction = async () => {
    // 1. Reset states
    isLoading.value = true
    hasError.value = false
    errorMessage.value = null
    purchaseStatus.value = null

    // 2. Get the merchant_reference from the URL query parameters
    const refFromQuery = route.query.merchantReference || route.query.merchant_reference
    if (!refFromQuery || typeof refFromQuery !== 'string') {
      console.error('Merchant reference not found in URL.')
      errorMessage.value = 'No transaction reference was found to verify.'
      hasError.value = true
      isLoading.value = false
      return
    }
    merchantReference.value = refFromQuery

    // 3. Call the backend to verify the actual transaction status
    try {
      console.log(`Verifying status for reference: ${merchantReference.value}`)
      const status = await apiService.checkTransactionStatus(merchantReference.value)
      purchaseStatus.value = status
    } catch (e: any) {
      console.error('Error verifying transaction status:', e)
      hasError.value = true
      if (e instanceof ApiError) {
        errorMessage.value = e.message
      } else {
        errorMessage.value = 'An unexpected error occurred while verifying your purchase.'
      }
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    verifyTransaction()
  })

  return {
    // State
    isLoading: readonly(isLoading),
    hasError: readonly(hasError),
    errorMessage: readonly(errorMessage),
    purchaseStatus: readonly(purchaseStatus),
    merchantReference: readonly(merchantReference)
  }
}
