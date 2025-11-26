import { PaymentTransactionStatusEnum } from '@/gql/graphql'
import { ApiError } from '@/services/ApiService'
import type { IApiService } from '@/services/IApiService'
import { onMounted, onUnmounted, readonly, ref } from 'vue'
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

  // --- RETRY LOGIC FOR WAITING CONFIRMATION ---
  const retryInterval = ref<ReturnType<typeof setTimeout> | null>(null)
  const retryCount = ref<number>(0)
  const isRetrying = ref<boolean>(false)
  const maxRetries = 12 // Maximum number of retries (12 * 2 seconds = 24 seconds)
  const retryDelayMs = 2000 // 2 seconds between retries

  /**
   * Clears the retry interval if it exists
   */
  const clearRetryInterval = () => {
    if (retryInterval.value) {
      clearTimeout(retryInterval.value)
      retryInterval.value = null
      isRetrying.value = false
    }
  }

  /**
   * Starts the retry mechanism for WaitingConfirmation status
   */
  const startRetryMechanism = () => {
    // Clear any existing interval
    clearRetryInterval()

    isRetrying.value = true
    retryInterval.value = setTimeout(async () => {
      if (retryCount.value < maxRetries) {
        retryCount.value++
        console.log(`Retry attempt ${retryCount.value}/${maxRetries} for transaction verification`)
        await verifyTransactionStatus()
      } else {
        console.log('Maximum retries reached for transaction verification')
        clearRetryInterval()
      }
    }, retryDelayMs)
  }

  /**
   * Verifies the transaction status without resetting the loading state
   */
  const verifyTransactionStatus = async () => {
    if (!merchantReference.value) return

    try {
      console.log(`Verifying status for reference: ${merchantReference.value}`)
      const status = await apiService.checkTransactionStatus(merchantReference.value)

      // Update the purchase status
      purchaseStatus.value = status

      // If still waiting confirmation and haven't reached max retries, schedule another retry
      if (
        status === PaymentTransactionStatusEnum.WaitingConfirmation &&
        retryCount.value < maxRetries
      ) {
        startRetryMechanism()
      } else {
        // Transaction completed or max retries reached, stop retrying
        clearRetryInterval()
      }
    } catch (e: any) {
      console.error('Error during retry verification:', e)
      // Don't set error state during retries, just log and continue
      if (retryCount.value < maxRetries) {
        startRetryMechanism()
      } else {
        clearRetryInterval()
      }
    }
  }

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

      // If status is WaitingConfirmation, start the retry mechanism
      if (status === PaymentTransactionStatusEnum.WaitingConfirmation) {
        retryCount.value = 0 // Reset retry count for new verification
        startRetryMechanism()
      }
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

  // Cleanup when component is unmounted
  onUnmounted(() => {
    clearRetryInterval()
  })

  return {
    // State
    isLoading: readonly(isLoading),
    hasError: readonly(hasError),
    errorMessage: readonly(errorMessage),
    purchaseStatus: readonly(purchaseStatus),
    merchantReference: readonly(merchantReference),
    // Retry state
    retryCount: readonly(retryCount),
    maxRetries,
    isRetrying: readonly(isRetrying)
  }
}
