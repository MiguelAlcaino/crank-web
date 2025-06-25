import type { ApiService } from '@/services/ApiService'
import { onMounted, readonly, ref } from 'vue'

export const useAfterCheckout = (apiService: ApiService) => {
  const hasError = ref<boolean>(false)
  const isLoading = ref<boolean>(false)
  const purchaseStatus = ref<string>('')

  onMounted(() => {})

  return {
    // Properties
    isLoading: readonly(isLoading),
    hasError,
    purchaseStatus

    // Methods
  }
}
