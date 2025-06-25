import type { ApiService } from '@/services/ApiService'
import { onMounted, readonly, ref } from 'vue'
import { appStore } from '@/stores/appStorage'
import type { PayfortFormInput } from '@/gql/graphql'

export const useCheckout = (apiService: ApiService) => {
  const hasError = ref<boolean>(false)
  const isLoading = ref<boolean>(false)

  const hiddenPayForm = ref<string>('')

  onMounted(() => {})

  async function payNow(deviceFingerprint: string): Promise<void> {
    try {
      const merchantRef = await apiService.generateMerchantReference(appStore().site)

      const formInput: PayfortFormInput = {
        merchantReference: merchantRef,
        deviceFingerprint,
        savePaymentCard: false // Or get this from a user checkbox
      }

      hiddenPayForm.value = await apiService.generatePayfortForm(appStore().site, formInput)

      console.log(hiddenPayForm.value)
    } catch (e) {
    } finally {
    }
  }

  async function getPayfortForm(deviceFingerprint: string): Promise<string> {
    try {
      const merchantRef = await apiService.generateMerchantReference(appStore().site)

      const formInput: PayfortFormInput = {
        merchantReference: merchantRef,
        deviceFingerprint,
        savePaymentCard: false // Or get this from a user checkbox
      }

      return await apiService.generatePayfortForm(appStore().site, formInput)
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
