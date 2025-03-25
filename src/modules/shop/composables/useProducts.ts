import type { ApiService } from '@/services/apiService'
import { computed, onMounted, readonly, ref } from 'vue'
import { ClassPackageTypeEnum, type SellableProduct } from '../interfaces'
import { appStore } from '@/stores/appStorage'
import { ProductType } from '@/gql/graphql'

export const useProducts = (apiService: ApiService) => {
  const hasError = ref<boolean>(false)
  const isLoading = ref<boolean>(false)
  const products = ref<SellableProduct[]>([])

  onMounted(() => {
    fetchProducts()
  })

  const trialPackages = computed(() => {
    return products.value?.filter((item) => item.type === ClassPackageTypeEnum.Trial) || []
  })

  const vodPackages = computed(() => {
    return products.value?.filter((item) => item.type === ClassPackageTypeEnum.Vod) || []
  })

  const regularPackages = computed(() => {
    return products.value?.filter((item) => item.type === ClassPackageTypeEnum.Regular) || []
  })

  const memberships = computed(() => {
    return products.value?.filter((item) => item.type === ClassPackageTypeEnum.Membership) || []
  })

  const specialPackages = computed(() => {
    return products.value?.filter((item) => item.type === ClassPackageTypeEnum.Special) || []
  })

  async function fetchProducts(): Promise<void> {
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

    trialPackages: readonly(trialPackages),
    vodPackages: readonly(vodPackages),
    regularPackages: readonly(regularPackages),
    memberships: readonly(memberships),
    specialPackages: readonly(specialPackages)

    // Methods
  }
}
