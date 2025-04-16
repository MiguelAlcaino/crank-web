import type { ApiService } from '@/services/apiService'
import { computed, onMounted, readonly, ref } from 'vue'
import { ClassPackageTypeEnum, type SellableProduct } from '../interfaces'
import { appStore } from '@/stores/appStorage'
import { ProductType } from '@/gql/graphql'
import type { SessionsProduct } from '@/modules/shop/interfaces/sessions-product'

export const useProducts = (apiService: ApiService) => {
  const hasError = ref<boolean>(false)
  const isLoading = ref<boolean>(false)
  let classPackages: SellableProduct[] = []

  const activeTab = ref<'SESSIONS' | 'GIFT CARDS' | 'F&B'>('SESSIONS')

  const sessionsProducts = ref<SessionsProduct[]>([])
  const classPackageSelectType = ref<ClassPackageTypeEnum | null>(null)

  onMounted(() => {
    fetchClassPackages()
  })

  const filteredSessionsProducts = computed(() => {
    if (!classPackageSelectType.value) {
      return sessionsProducts.value
    }
    return sessionsProducts.value.filter((product) => product.type === classPackageSelectType.value)
  })

  async function fetchClassPackages(): Promise<void> {
    hasError.value = false
    isLoading.value = true

    classPackages = []
    sessionsProducts.value = []
    classPackageSelectType.value = null

    try {
      classPackages = (await apiService.getProducts(appStore().site, {
        type: ProductType.ClassPackage
      })) as SellableProduct[]

      // Trial Packages*
      const trialPackages = classPackages.filter(
        (classPackage) => classPackage.type === ClassPackageTypeEnum.Trial
      )

      if (trialPackages.length > 0) {
        sessionsProducts.value.push({
          type: ClassPackageTypeEnum.Trial,
          title: 'Trial Packages*',
          products: trialPackages
        })
      }

      // Video-on-Demand Packages*
      const voidPackages = classPackages.filter(
        (classPackage) => classPackage.type === ClassPackageTypeEnum.Vod
      )

      if (voidPackages.length > 0) {
        sessionsProducts.value.push({
          type: ClassPackageTypeEnum.Vod,
          title: 'Video-on-Demand Packages*',
          products: voidPackages
        })
      }

      // Regular Packages*
      const regularPackages = classPackages.filter(
        (classPackage) => classPackage.type === ClassPackageTypeEnum.Regular
      )

      if (regularPackages.length > 0) {
        sessionsProducts.value.push({
          type: ClassPackageTypeEnum.Regular,
          title: 'Regular Packages*',
          products: regularPackages
        })
      }

      // Memberships*
      const membershipsPackages = classPackages.filter(
        (classPackage) => classPackage.type === ClassPackageTypeEnum.Membership
      )

      if (membershipsPackages.length > 0) {
        sessionsProducts.value.push({
          type: ClassPackageTypeEnum.Membership,
          title: 'Memberships*',
          products: membershipsPackages
        })
      }

      // Special*
      const specialPackages = classPackages.filter(
        (classPackage) => classPackage.type === ClassPackageTypeEnum.Special
      )

      if (specialPackages.length > 0) {
        sessionsProducts.value.push({
          type: ClassPackageTypeEnum.Special,
          title: 'Special*',
          products: specialPackages
        })
      }
    } catch (error) {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  const setActiveTab = (tab: 'SESSIONS' | 'GIFT CARDS' | 'F&B') => {
    activeTab.value = tab
  }

  const setClassPackageSelectType = (type: ClassPackageTypeEnum | string | null) => {
    classPackageSelectType.value = type === 'all' ? null : (type as ClassPackageTypeEnum | null)
  }

  return {
    // Properties
    isLoading: readonly(isLoading),
    hasError: hasError,

    activeTab: readonly(activeTab),
    sessionsProducts: readonly(sessionsProducts),
    filteredSessionsProducts: readonly(filteredSessionsProducts),

    // Methods
    setActiveTab,
    setClassPackageSelectType
  }
}
