import type { ApiService } from '@/services/apiService'
import { onMounted, readonly, ref } from 'vue'
import { appStore } from '@/stores/appStorage'

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

  return {
    // Properties
    isLoading: readonly(isLoading),
    hasError: hasError,
    hiddenPayForm: hiddenPayForm,

    // Methods
    payNow,
    getPayfortForm
  }
}
