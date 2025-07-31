import { computed, readonly, ref } from 'vue'
import { appStore } from '@/stores/appStorage'
import type { IApiService } from '@/services/IApiService'
import { ShoppingCart } from '@/modules/shop/models/ShoppingCart'
import { ApiError } from '@/services/ApiService'
import type { CartSummary } from '@/modules/shop/interfaces/cart-summary'
import { useModal } from '@/modules/shared/composables/useModal'

//
// -----------------
// MODULE-LEVEL STATE & LOGIC (SINGLETON)
// -----------------
//
const cartState = ref<CartSummary | ShoppingCart | null>(null)
const isSummaryLoading = ref<boolean>(false)
const isDetailsLoading = ref<boolean>(false)
const error = ref<string | null>(null)
const updatingItemIds = ref<Set<string>>(new Set())
const isApplyingDiscount = ref<boolean>(false)
const isProcessingBuyNow = ref(false)

/**
 * Checks if a specific shopping cart item is currently being updated.
 * @param {string} itemId - The ID of the item to check.
 * @returns A computed ref that resolves to a boolean.
 */
function isItemUpdating(itemId: string) {
  return computed(() => updatingItemIds.value.has(itemId))
}

export const useShoppingCart = (apiService: IApiService) => {
  const { showConfirmation } = useModal()
  //
  // -----------------
  // METHODS - FETCHING
  // -----------------
  //

  /**
   * Fetches the lightweight cart summary. Ideal for global UI elements.
   */
  async function fetchCartSummary() {
    if (isSummaryLoading.value) return
    isSummaryLoading.value = true
    error.value = null

    try {
      cartState.value = await apiService.getCartSummary(appStore().site)
    } catch (e: any) {
      console.error('Failed to fetch cart summary:', e)
      error.value = e.message || 'Could not load cart information.'
    } finally {
      isSummaryLoading.value = false
    }
  }

  /**
   * Fetches the full, detailed shopping cart. Ideal for the main cart/checkout pages.
   */
  async function fetchCartDetails() {
    if (isDetailsLoading.value) return
    isDetailsLoading.value = true
    error.value = null

    try {
      cartState.value = await apiService.getCartDetails(appStore().site)
    } catch (e: any) {
      console.error('Failed to fetch cart details:', e)
      error.value = e.message || 'Could not load detailed cart information.'
    } finally {
      isDetailsLoading.value = false
    }
  }

  //
  // -----------------
  // METHODS - MUTATING
  // -----------------
  //

  /**
   * A generic handler for any mutation that modifies the cart.
   * It manages the global error state and updates the cartState upon success.
   * It also tracks loading states for individual items if an itemId is provided.
   * @param {string | null} itemId - The ID of the item being modified. Can be null for cart-wide operations like 'clear'.
   * @param {Promise<ShoppingCart | null>} updatePromise - The promise from the ApiService that resolves with the updated cart.
   */
  const handleCartUpdate = async (
    itemId: string | null,
    updatePromise: Promise<ShoppingCart | null>
  ) => {
    if (itemId) updatingItemIds.value.add(itemId)
    error.value = null

    try {
      const updatedCart = await updatePromise

      cartState.value = updatedCart
    } catch (e: any) {
      console.error('Cart update failed:', e)
      error.value =
        e instanceof ApiError ? e.message : 'An error occurred while updating your cart.'
    } finally {
      if (itemId) updatingItemIds.value.delete(itemId)
    }
  }

  /**
   * Adds an item to the shopping cart and updates the local state.
   * Manages loading and error states for the operation.
   * @param variantId The ID of the product to add.
   */
  const addToCart = async (variantId: string) => {
    await handleCartUpdate(
      variantId,
      apiService.addItemToShoppingCart(appStore().site, variantId, 1)
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

  async function applyDiscountCode(code: string) {
    isApplyingDiscount.value = true
    error.value = null
    try {
      cartState.value = await apiService.addDiscountCodeToShoppingCart(appStore().site, code)
    } catch (e: any) {
      error.value = e.message || 'An error occurred.'
    } finally {
      isApplyingDiscount.value = false
    }
  }

  async function removeDiscountCode() {
    isApplyingDiscount.value = true
    error.value = null
    try {
      cartState.value = await apiService.removeDiscountCode(appStore().site)
    } catch (e: any) {
      error.value = e.message || 'An error occurred.'
    } finally {
      isApplyingDiscount.value = false
    }
  }

  async function clearCart() {
    await handleCartUpdate(null, apiService.clearShoppingCart(appStore().site))
  }

  /**
   * Orchestrates the "Buy Now" flow, which clears the existing cart
   * to add a single new item, as per backend requirements.
   *
   * 1. Checks if the action is necessary (e.g., cart is already correct).
   * 2. Prompts the user for confirmation using a promise-based modal if the cart is not empty.
   * 3. If confirmed, clears the cart, then adds the new single item.
   * 4. Returns a success flag for the calling component to act upon (e.g., navigate).
   *
   * @param {string} variantId - The ID of the product to buy now.
   * @returns {Promise<boolean>} - True if the process completed successfully, false if the user cancelled or an error occurred.
   */
  async function buyNow(variantId: string): Promise<boolean> {
    // Edge Case: Check if the product is already the only item in the cart.
    const isAlreadyTheOnlyItem =
      cartState.value?.items.length === 1 &&
      cartState.value.items[0].variant.id === variantId

    // If the cart is already in the desired state, we can consider it a success and allow navigation.
    if (isAlreadyTheOnlyItem) {
      return true
    }

    const isCartEmpty = !cartState.value || cartState.value.items.length === 0

    // Step 1: Get user confirmation if the cart is not empty.
    if (!isCartEmpty) {
      try {
        // `await` will pause execution here until the user interacts with the modal.
        await showConfirmation(
          'Confirm Purchase', // Title
          'To "Buy Now", your existing cart will be cleared. Are you sure you want to remove all other items and proceed with this one?' // Message
        )
        // If the code reaches here, it means the promise resolved (user clicked "OK").
      } catch (e) {
        // If the promise is rejected (user clicked "Cancel"), the await throws an error.
        // We catch it, log it for clarity, and stop the entire process.
        console.log('"Buy Now" process was cancelled by the user.')
        return false
      }
    }

    // Step 2: Perform the cart operations.
    isProcessingBuyNow.value = true
    error.value = null

    try {
      // Action 1: Clear the cart if it wasn't empty.
      if (!isCartEmpty) {
        await clearCart()
      }

      // Action 2: Add the new item to the now-empty cart.
      await addToCart(variantId)

      // After the operations, check if any of them set an error in our state.
      if (error.value) {
        // If so, throw an error to be caught by our own catch block.
        throw new Error(error.value)
      }

      return true // Success!
    } catch (e: any) {
      // The `error` ref should already be set by the failing internal method.
      console.error('The "Buy Now" process failed during API calls:', e)
      return false // Failure.
    } finally {
      // Always reset the processing state, regardless of outcome.
      isProcessingBuyNow.value = false
    }
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

    const items = cartState.value.items as Array<{ quantity: number }>

    if (items && Array.isArray(items)) {
      return items.reduce((total: number, item) => total + item.quantity, 0)
    }

    return 0
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

  /**
   * @description A computed property that combines all primary loading states of the cart.
   * Simplifies logic for components that need a general loading indicator.
   */
  const isLoading = computed(() => isSummaryLoading.value || isDetailsLoading.value)

  return {
    // --- State & Getters ---
    isLoading: readonly(isLoading),
    error: readonly(error),
    isApplyingDiscount: readonly(isApplyingDiscount),
    isProcessingBuyNow: readonly(isProcessingBuyNow),
    totalItemsInCart,
    productIdsInCart,
    detailedCart,
    isItemUpdating,

    // --- Methods ---
    fetchCartSummary,
    fetchCartDetails,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    applyDiscountCode,
    removeDiscountCode,
    buyNow,
    clearCart
  }
}
