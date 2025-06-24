import { computed, onMounted, readonly, ref } from 'vue'
import { appStore } from '@/stores/appStorage'
import type { IApiService } from '@/services/IApiService'
import type { ShoppingCart } from '@/modules/shop/models/ShoppingCart'
import { ApiError } from '@/services/ApiService'

const shoppingCart = ref<ShoppingCart | null>(null)
const isUpdating = ref<boolean>(false)
const error = ref<Error | null>(null)

const totalItemsInCart = computed(() => {
  return shoppingCart.value?.items.reduce((total, item) => total + item.quantity, 0) || 0
})

export const useShoppingCart = (apiService: IApiService) => {
  const hasError = ref<boolean>(false)
  const isLoading = ref<boolean>(false)

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
   * Adds an item to the shopping cart and updates the local state.
   * Manages loading and error states for the operation.
   * @param sellableProductId The ID of the product to add.
   */
  const addToCart = async (sellableProductId: string) => {
    // 1. Set loading state to true and clear previous errors
    //    This provides immediate feedback to the UI.
    isUpdating.value = true
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
      isUpdating.value = false
    }
  }

  const removeFromCart = async (shoppingCartItemId: string) => {
    hasError.value = false
    isLoading.value = true

    try {
      const result = await apiService.removeItemFromShoppingCart(
        appStore().site,
        shoppingCartItemId
      )

      if (result.success && result.shoppingCart) {
        //shoppingCart.value = result.shoppingCart
      } else {
        // Handle error case
        console.error('Failed to remove item from cart:', result.message)
      }
    } catch (error) {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  const updateItemInShoppingCart = async (sellableProductId: string, quantity: number) => {
    hasError.value = false
    isLoading.value = true

    try {
      const result = await apiService.updateItemInShoppingCart(
        appStore().site,
        sellableProductId,
        quantity
      )

      if (result.success && result.shoppingCart) {
        // shoppingCart.value = result.shoppingCart
      } else {
      }
    } catch (error) {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  const productIdsInCart = computed(() => {
    return shoppingCart.value?.items.map((item) => item.product.id) || []
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

  return {
    // Properties
    isLoading: readonly(isLoading),
    hasError: hasError,
    shoppingCart: shoppingCart,
    productIdsInCart: readonly(productIdsInCart),
    calculatedSubtotal: readonly(calculatedSubtotal),
    totalItemsInCart: readonly(totalItemsInCart),

    // Methods
    addToCart,
    removeFromCart,
    updateItemInShoppingCart
  }
}
