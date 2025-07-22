import { computed, readonly, ref } from 'vue'
import { appStore } from '@/stores/appStorage'
import type { IApiService } from '@/services/IApiService'
import { ShoppingCart } from '@/modules/shop/models/ShoppingCart'
import { ApiError } from '@/services/ApiService'
import type { CartSummary } from '@/modules/shop/interfaces/cart-summary'

//
// -----------------
// MODULE-LEVEL STATE & LOGIC (SINGLETON)
// -----------------
//
const cartState = ref<CartSummary | ShoppingCart | null>(null)
const isLoading = ref<boolean>(false)
const error = ref<Error | null>(null)
const updatingItemIds = ref<Set<string>>(new Set())

/**
 * Checks if a specific shopping cart item is currently being updated.
 * @param {string} itemId - The ID of the item to check.
 * @returns A computed ref that resolves to a boolean.
 */
function isItemUpdating(itemId: string) {
  return computed(() => updatingItemIds.value.has(itemId))
}

export const useShoppingCart = (apiService: IApiService) => {
  const hasError = ref<boolean>(false)

  //
  // -----------------
  // METHODS - FETCHING
  // -----------------
  //

  /**
   * Fetches the lightweight cart summary. Ideal for global UI elements.
   */
  async function fetchCartSummary() {
    hasError.value = false
    isLoading.value = true

    try {
      cartState.value = await apiService.getCartSummary(appStore().site)
    } catch (error) {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches the full, detailed shopping cart. Ideal for the main cart/checkout pages.
   */
  async function fetchCartDetails() {
    hasError.value = false
    isLoading.value = true

    try {
      cartState.value = await apiService.getCartDetails(appStore().site)
    } catch (error) {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  //
  // -----------------
  // METHODS - MUTATING
  // -----------------
  //

  /**
   * A generic handler for any mutation that returns an updated shopping cart.
   * It manages the isUpdating and error states automatically.
   * @param itemId
   * @param updatePromise The promise returned from an ApiService method.
   */
  const handleCartUpdate = async (itemId: string, updatePromise: Promise<ShoppingCart | null>) => {
    updatingItemIds.value.add(itemId)
    error.value = null

    try {
      cartState.value = await updatePromise
    } catch (e) {
      error.value = e as ApiError | Error
    } finally {
      updatingItemIds.value.delete(itemId)
    }
  }

  /**
   * Adds an item to the shopping cart and updates the local state.
   * Manages loading and error states for the operation.
   * @param sellableProductId The ID of the product to add.
   */
  const addToCart = async (sellableProductId: string) => {
    await handleCartUpdate(
      sellableProductId,
      apiService.addItemToShoppingCart(appStore().site, sellableProductId, 1)
    )
  }

  /**
   * Removes an item from the shopping cart and updates the local state.
   * @param shoppingCartItemId The ID of the cart item to remove.
   */
  const removeFromCart = async (shoppingCartItemId: string) => {
    await handleCartUpdate(
      shoppingCartItemId,
      apiService.removeItemFromShoppingCart(appStore().site, shoppingCartItemId)
    )
  }

  /**
   * Updates the quantity of an item in the shopping cart.
   * @param {object} payload - The item ID and its new quantity.
   */
  const updateItemQuantity = async (payload: { itemId: string; newQuantity: number }) => {
    const newQuantity = Math.max(0, payload.newQuantity || 0)

    if (newQuantity === 0) {
      await removeFromCart(payload.itemId)
      return
    }

    await handleCartUpdate(
      payload.itemId,
      apiService.updateItemInShoppingCart(appStore().site, payload.itemId, newQuantity)
    )
  }

  //
  // -----------------
  // GETTERS & COMPUTED PROPERTIES
  // -----------------
  //

  /**
   * @description A computed set of product variant IDs currently in the cart.
   * Works with both CartSummary and the full ShoppingCart.
   */
  const productIdsInCart = computed(() => {
    if (!cartState.value?.items) return new Set<string>()

    if (cartState.value instanceof ShoppingCart) {
      return new Set(cartState.value.items.map((item) => item.variant.id))
    }

    return new Set(cartState.value.items.map((item) => item.variant.id))
  })

  /**
   * @description The total number of individual units in the cart.
   * Works with both CartSummary and the full ShoppingCart.
   */
  const totalItemsInCart = computed(() => {
    if (!cartState.value) return 0

    if (cartState.value instanceof ShoppingCart) {
      return cartState.value.itemCount
    }

    return cartState.value.items.reduce((total, item) => total + item.quantity, 0)
  })

  /**
   * @description Returns the full ShoppingCart class instance if available, otherwise null.
   * This is what the main cart page should use to display totals.
   */
  const detailedCart = computed((): ShoppingCart | null => {
    if (cartState.value instanceof ShoppingCart) {
      return cartState.value
    }
    return null
  })

  return {
    // --- State & Getters ---
    isLoading: readonly(isLoading),
    error: readonly(error),
    totalItemsInCart,
    productIdsInCart,
    detailedCart,
    isItemUpdating,

    // --- Methods ---
    fetchCartSummary,
    fetchCartDetails,
    addToCart,
    removeFromCart,
    updateItemQuantity
  }
}
