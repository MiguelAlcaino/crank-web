import { computed, onMounted, readonly, ref } from 'vue'
import { appStore } from '@/stores/appStorage'
import type { ApiService } from '@/services/apiService'
import type { ShoppingCart } from '../interfaces'
import { formatPrice } from '@/utils/utility-functions'

const shoppingCart = ref<ShoppingCart | null>(null)

export const useShoppingCart = (apiService: ApiService) => {
  const hasError = ref<boolean>(false)
  const isLoading = ref<boolean>(false)

  onMounted(() => {
    getShoppingCart()
  })

  async function getShoppingCart() {
    hasError.value = false
    isLoading.value = true

    try {
      shoppingCart.value = (await apiService.fetchUserCart(appStore().site)) as ShoppingCart
    } catch (error) {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  const addToCart = async (sellableProductId: string) => {
    try {
      const result = await apiService.addItemToShoppingCart(appStore().site, sellableProductId, 1)

      if (result.success && result.shoppingCart) {
        shoppingCart.value = result.shoppingCart

        console.log('Cart', shoppingCart.value)
      } else {
      }
    } catch (error) {
      console.log('Error', error)
    } finally {
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
        shoppingCart.value = result.shoppingCart
      } else {
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
        shoppingCart.value = result.shoppingCart
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
    return formatPrice(
      shoppingCart.value?.items.reduce((acc, item) => {
        return acc + item.product.price * item.quantity
      }, 0) || 0
    )
  })

  return {
    // Properties
    isLoading: readonly(isLoading),
    hasError: hasError,
    shoppingCart: shoppingCart,
    productIdsInCart: readonly(productIdsInCart),
    calculatedSubtotal: readonly(calculatedSubtotal),

    // Methods
    addToCart,
    removeFromCart,
    updateItemInShoppingCart
  }
}
