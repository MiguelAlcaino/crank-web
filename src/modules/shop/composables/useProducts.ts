import { computed, readonly, ref } from 'vue'
import { appStore } from '@/stores/appStorage'
import { ClassPackageTypeEnum } from '../interfaces'
import type { SessionsProductGroup } from '../interfaces/sessions-product-group'
import { ClassPackage, GiftCardProduct, Product } from '../models/Product'
import type { IApiService } from '@/services/IApiService'

/**
 * @description Manages the state and business logic for fetching, filtering, and displaying products.
 * @param apiService An instance of the IApiService.
 */
export const useProducts = (apiService: IApiService) => {
  //
  // -----------------
  // STATE
  // -----------------
  //

  /**
   * @description The raw, unfiltered list of all products fetched from the API.
   * This is the single source of truth for all product data.
   */
  const allProducts = ref<Product[]>([])

  /**
   * @description Flag indicating if an error occurred during the product fetch.
   */
  const isLoading = ref<boolean>(true)

  /**
   * @description Flag indicating if an error occurred during the product fetch.
   */
  const hasError = ref<boolean>(false)

  /**
   * @description The currently active UI tab ('SESSIONS', 'GIFT_CARDS', 'FB').
   */
  const activeTab = ref<'SESSIONS' | 'GIFT_CARDS' | 'FB'>('SESSIONS')

  /**
   * @description The selected filter for class package types. Null means 'All'.
   * This is intended to be used with v-model in the component.
   */
  const classPackageSelectType = ref<ClassPackageTypeEnum | null>(null)

  //
  // -----------------
  // GETTERS & COMPUTED PROPERTIES
  // -----------------
  //

  /**
   * @description A computed list containing only products that are ClassPackages.
   */
  const classPackages = computed((): ClassPackage[] =>
    allProducts.value.filter((p): p is ClassPackage => p instanceof ClassPackage)
  )

  /**
   * @description A computed list containing only products that are GiftCards.
   */
  const giftCards = computed((): GiftCardProduct[] =>
    allProducts.value.filter((p): p is GiftCardProduct => p instanceof GiftCardProduct)
  )

  /**
   * @description Takes the flat list of class packages and groups them by their type
   * into a structured array, ready for display in the UI.
   */
  const sessionsProductGroups = computed((): SessionsProductGroup[] => {
    const groups: SessionsProductGroup[] = []
    const packages = classPackages.value

    // Defines the order and titles for each group.
    const groupDefinitions = new Map<ClassPackageTypeEnum, string>([
      [ClassPackageTypeEnum.Trial, 'Trial Packages*'],
      [ClassPackageTypeEnum.Vod, 'Video-on-Demand Packages*'],
      [ClassPackageTypeEnum.Regular, 'Regular Packages*'],
      [ClassPackageTypeEnum.Membership, 'Memberships*'],
      [ClassPackageTypeEnum.Special, 'Special*']
    ])

    groupDefinitions.forEach((title, type) => {
      const filteredProducts = packages.filter((p) => p.classPackageType === type)
      // Only add the group to the final array if it contains products.
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

  /**
   * @description Further filters the session product groups based on the
   * `classPackageSelectType` state. Returns all groups if the filter is null.
   */
  const filteredSessionsProductGroups = computed(() => {
    if (!classPackageSelectType.value) {
      return sessionsProductGroups.value
    }
    return sessionsProductGroups.value.filter(
      (group) => group.type === classPackageSelectType.value
    )
  })

  //
  // -----------------
  // METHODS
  // -----------------
  //

  /**
   * @description Fetches all products from the API and populates the `allProducts` state.
   * This is the main action to be called by the component.
   */
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

  /**
   * @description Sets the active UI tab.
   * @param tab The tab to activate.
   */
  const setActiveTab = (tab: 'SESSIONS' | 'GIFT_CARDS' | 'FB') => {
    activeTab.value = tab
  }

  return {
    // --- State & Getters ---
    isLoading: readonly(isLoading),
    hasError: readonly(hasError),
    activeTab: readonly(activeTab),

    // This is mutable because it's bound with v-model in the component.
    classPackageSelectType,

    // These are derived and should not be changed from the outside.
    sessionsProductGroups: readonly(sessionsProductGroups),
    filteredSessionsProductGroups: readonly(filteredSessionsProductGroups),
    giftCards: readonly(giftCards),

    // --- Methods ---
    setActiveTab,
    fetchAllProducts
  }
}
