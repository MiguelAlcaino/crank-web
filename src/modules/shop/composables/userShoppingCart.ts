import { computed, onMounted, readonly, ref } from 'vue'
import { appStore } from '@/stores/appStorage'
import type { IApiService } from '@/services/IApiService'
import type { ShoppingCart } from '@/modules/shop/models/ShoppingCart'
import { ApiError } from '@/services/ApiService'

const shoppingCart = ref<ShoppingCart | null>(null)
const error = ref<Error | null>(null)

export const useShoppingCart = (apiService: IApiService) => {
  const hasError = ref<boolean>(false)
  const isLoading = ref<boolean>(false)
  const updatingItemIds = ref<Set<string>>(new Set())

  onMounted(() => {
    getShoppingCart()
  })

  async function getShoppingCart() {
    hasError.value = false
    isLoading.value = true

    try {
      shoppingCart.value = await apiService.getShoppingCart(appStore().site)
    } catch (error) {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  /**
   * A generic handler for any mutation that returns an updated shopping cart.
   * It manages the isUpdating and error states automatically.
   * @param itemId
   * @param updatePromise The promise returned from an ApiService method.
   */
  const handleCartUpdate = async (itemId: string, updatePromise: Promise<ShoppingCart>) => {
    updatingItemIds.value.add(itemId)
    error.value = null
    try {
      shoppingCart.value = await updatePromise
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
    // 1. Set loading state to true and clear previous errors
    //    This provides immediate feedback to the UI.

    error.value = null

    try {
      // 2. Call the ApiService. It will either return the updated cart or throw.
      const updatedCart: ShoppingCart = await apiService.addItemToShoppingCart(
        appStore().site,
        sellableProductId,
        1
      )

      // 3. On success, update the local reactive state with the new cart.
      //    The UI will automatically update to reflect this change.
      shoppingCart.value = updatedCart
    } catch (e) {
      // 4. If an error is thrown, capture it and store it in the state.
      //    This allows the UI to display a meaningful error message.
      const caughtError = e as ApiError | Error
      error.value = caughtError

      // Optionally, log the full error for debugging purposes
      console.error('Failed to add item to cart:', caughtError.message)

      // You could also map specific API errors to user-friendly messages here
      if (caughtError instanceof ApiError && caughtError.code === 'ProductNotFound') {
        // Here you could trigger a toast notification or a specific UI message
        console.warn('Attempted to add a product that does not exist.')
      }
    } finally {
      // 5. Always set loading state to false when the operation is complete,
      //    regardless of success or failure.
    }
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
   *
   */
  const updateItemInCart = async (payload: { itemId: string; newQuantity: number }) => {
    const newQuantity = Math.max(0, payload.newQuantity || 0)

    if (newQuantity === 0) {
      await removeFromCart(payload.itemId)
      return
    }

    const itemToUpdate = shoppingCart.value?.items.find((item) => item.id === payload.itemId)

    if (!itemToUpdate) {
      console.error(`Item with ID ${payload.itemId} not found in cart. Cannot update.`)
      return
    }

    await handleCartUpdate(
      payload.itemId,
      apiService.updateItemInShoppingCart(appStore().site, itemToUpdate.id, newQuantity)
    )
  }

  const productIdsInCart = computed(() => {
    return shoppingCart.value?.items.map((item) => item.variant.id) || []
  })

  const calculatedSubtotal = computed(() => {
    return 0
    /*  return formatPrice(
        shoppingCart.value?.items.reduce((acc, item) => {
          return acc + item.product.price * item.quantity
        }, 0) || 0
      )*/
  })

  // --- Computed Properties ---
  // These are now much cleaner by using the model's getters.
  const totalItemsInCart = computed(() => shoppingCart.value?.itemCount ?? 0)

  // const productIdsInCart = computed(() => shoppingCart.value?.productIds ?? [])

  const formattedSubtotal = computed(() => shoppingCart.value?.getFormattedSubtotal() ?? '')

  /**
   * Checks if a specific shopping cart item is currently being updated.
   * @param itemId The ID of the shopping cart item.
   * @returns True if the item is being updated, false otherwise.
   */
  const isItemUpdating = (itemId: string): boolean => {
    return updatingItemIds.value.has(itemId)
  }

  return {
    // Properties
    isLoading: readonly(isLoading),
    hasError: hasError,
    shoppingCart: shoppingCart,
    productIdsInCart: readonly(productIdsInCart),
    calculatedSubtotal: readonly(calculatedSubtotal),
    totalItemsInCart: readonly(totalItemsInCart),
    formattedSubtotal: readonly(formattedSubtotal),

    // Methods
    addToCart,
    removeFromCart,
    updateItemInCart,
    isItemUpdating
  }
}
