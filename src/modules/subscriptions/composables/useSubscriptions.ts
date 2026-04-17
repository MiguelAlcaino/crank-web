import type { CustomerSubscription } from '@/gql/graphql'
import { readonly, ref } from 'vue'
import { CANCEL_SUBSCRIPTION_ERROR_MESSAGES } from '../interfaces/subscription-errors'
import { useSubscriptionsApiService } from './useSubscriptionsApiService'

export function useSubscriptions() {
  const api = useSubscriptionsApiService()

  const subscriptions = ref<CustomerSubscription[]>([])
  const isLoading = ref(false)
  const hasError = ref(false)
  const isCancelling = ref(false)
  const cancelErrorMessage = ref<string | null>(null)

  async function fetchSubscriptions(): Promise<void> {
    isLoading.value = true
    hasError.value = false
    try {
      subscriptions.value = await api.getCurrentUserSubscriptions()
    } catch {
      hasError.value = true
      subscriptions.value = []
    } finally {
      isLoading.value = false
    }
  }

  async function cancelSubscription(subscriptionId: string): Promise<boolean> {
    isCancelling.value = true
    cancelErrorMessage.value = null
    try {
      const result = await api.cancelSubscription(subscriptionId)
      if (result.ok) {
        await fetchSubscriptions()
        return true
      }
      cancelErrorMessage.value = CANCEL_SUBSCRIPTION_ERROR_MESSAGES[result.error]
      await fetchSubscriptions()
      return false
    } finally {
      isCancelling.value = false
    }
  }

  return {
    subscriptions: readonly(subscriptions),
    isLoading: readonly(isLoading),
    hasError: readonly(hasError),
    isCancelling: readonly(isCancelling),
    cancelErrorMessage: readonly(cancelErrorMessage),
    fetchSubscriptions,
    cancelSubscription
  }
}
