import type { ApiService } from '@/services/apiService'
import { computed, onMounted, readonly, ref } from 'vue'
import { ClassPackageTypeEnum } from '../interfaces'
import { appStore } from '@/stores/appStorage'
import { ClassPackage, GiftCardProduct, Product } from '../models/product'
import type { SessionsProductGroup } from '../interfaces/sessions-product-group'
import type { IApiService } from '@/services/api-service.interface'

export const useProducts = (apiService: IApiService) => {
  const isLoading = ref<boolean>(true)
  const hasError = ref<boolean>(false)

  const allProducts = ref<Product[]>([])

  const activeTab = ref<'SESSIONS' | 'GIFT_CARDS' | 'FB'>('SESSIONS')
  const classPackageSelectType = ref<ClassPackageTypeEnum | null>(null)

  // --- LIFECYCLE ---
  onMounted(fetchAllProducts)

  const classPackages = computed((): ClassPackage[] =>
    allProducts.value.filter((p): p is ClassPackage => p instanceof ClassPackage)
  )

  const giftCards = computed((): GiftCardProduct[] =>
    allProducts.value.filter((p): p is GiftCardProduct => p instanceof GiftCardProduct)
  )

  const sessionsProductGroups = computed((): SessionsProductGroup[] => {
    const groups: SessionsProductGroup[] = []
    const packages = classPackages.value

    const groupDefinitions = new Map<ClassPackageTypeEnum, string>([
      [ClassPackageTypeEnum.Trial, 'Trial Packages*'],
      [ClassPackageTypeEnum.Vod, 'Video-on-Demand Packages*'],
      [ClassPackageTypeEnum.Regular, 'Regular Packages*'],
      [ClassPackageTypeEnum.Membership, 'Memberships*'],
      [ClassPackageTypeEnum.Special, 'Special*']
    ])

    groupDefinitions.forEach((title, type) => {
      const filteredProducts = packages.filter((p) => p.classPackageType === type)

      if (filteredProducts.length > 0) {
        groups.push({
          type,
          title,
          products: filteredProducts
        })
      }
    })

    return groups
  })

  const filteredSessionsProductGroups = computed(() => {
    if (!classPackageSelectType.value) {
      return sessionsProductGroups.value
    }
    return sessionsProductGroups.value.filter(
      (group) => group.type === classPackageSelectType.value
    )
  })

  async function fetchAllProducts(): Promise<void> {
    isLoading.value = true
    hasError.value = false

    try {
      allProducts.value = await apiService.getProducts(appStore().site)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      hasError.value = true
      allProducts.value = []
    } finally {
      isLoading.value = false
    }
  }

  const setActiveTab = (tab: 'SESSIONS' | 'GIFT_CARDS' | 'FB') => {
    activeTab.value = tab
  }

  const setClassPackageSelectType = (type: ClassPackageTypeEnum | string | null) => {
    classPackageSelectType.value = type === 'All' ? null : (type as ClassPackageTypeEnum | null)
  }

  return {
    // Properties
    isLoading: readonly(isLoading),
    hasError: hasError,

    activeTab: readonly(activeTab),
    classPackageSelectType,

    sessionsProductGroups: readonly(sessionsProductGroups),
    filteredSessionsProductGroups: readonly(filteredSessionsProductGroups),
    giftCards: readonly(giftCards),

    // Methods
    setActiveTab,
    setClassPackageSelectType,
    fetchAllProducts
  }
}
