import type { ApiService } from '@/services/apiService'
import { onMounted, readonly, ref } from 'vue'
import type { ShoppingCart, SellableProduct } from '../interfaces'
import { appStore } from '@/stores/appStorage'
import { ProductType } from '@/gql/graphql'

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

  const addToCart = async (product: SellableProduct) => {
    console.log('Add to cart', product)
    try {
      const result = await apiService.addItemToShoppingCart(appStore().site, product.id, 1)
      console.log('Cart', result)
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

  const removeAllFromCart = (product: SellableProduct) => {
    // cart.value = cart.value.filter((item) => item.id !== product.id);
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

  return {
    // Properties
    isLoading: readonly(isLoading),
    hasError: hasError,
    shoppingCart: shoppingCart,

    // Methods
    addToCart,
    removeFromCart,
    removeAllFromCart,
    updateItemInShoppingCart
  }
}
