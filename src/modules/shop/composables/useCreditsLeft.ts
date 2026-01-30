import { computed, readonly, ref } from 'vue'
import { useShopApiService } from '@/modules/shop/composables/useShopApiService'

export const useCreditLeft = () => {
  const shopApi = useShopApiService()

  const isLoading = ref<boolean>(false)
  const credits = ref<number>(0)
  const error = ref<string | null>(null)

  const fetchCredits = async () => {
    isLoading.value = true
    error.value = null

    try {
      credits.value = await shopApi.getRemainingCredits()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      console.error('Error obtaining credits:', err)
    } finally {
      isLoading.value = false
    }
  }

  const creditsLeftText = computed((): string => {
    return (credits.value | 0) + ' CREDITS LEFT'
  })

  return {
    creditsLeftText: readonly(creditsLeftText),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchCredits
  }
}
