import type { ApiService } from '@/services/apiService'
import { onMounted, readonly, ref } from 'vue'
import type { SellableProduct } from '../interfaces'
import { appStore } from '@/stores/appStorage'
import { ProductType } from '@/gql/graphql'

export const useProducts = (apiService: ApiService) => {
  const hasError = ref<boolean>(false)
  const isLoading = ref<boolean>(false)
  const products = ref<SellableProduct[]>([])

  onMounted(() => {
    fetchUserCart()
  })

  async function fetchUserCart() {
    hasError.value = false
    isLoading.value = true

    products.value = []

    try {
      products.value = (await apiService.getProducts(appStore().site, {
        type: ProductType.ClassPackage
      })) as SellableProduct[]
    } catch (error) {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  return {
    // Properties
    isLoading: readonly(isLoading),
    hasError: hasError,
    products: readonly(products)

    // Methods
  }
}
