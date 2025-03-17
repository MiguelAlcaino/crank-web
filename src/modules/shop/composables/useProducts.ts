import type { ApiService } from '@/services/apiService'
import { onMounted, readonly, ref } from 'vue'
import type { ShoppingCart, SellableProduct, ShoppingCartItem } from '../interfaces'
import { appStore } from '@/stores/appStorage'
import { ProductType } from '@/gql/graphql'

export const useProducts = (apiService: ApiService) => {
  const hasError = ref<boolean>(false)
  const isLoading = ref<boolean>(false)
  const products = ref<SellableProduct[]>([])
  const shoppingCart = ref<ShoppingCart>({items: [], currency: 'USD', total: 0, discountCode: '',  giftCardCode: '', quantity: 0, id: '', subTotal: 0})

  onMounted(() => {
    fetchProducts()
  })

  async function fetchProducts() {
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

  const addToCart = (product: SellableProduct) => {
    console.log('Adding to cart', product)
    const item = shoppingCart.value?.items.find((item) => item.product.id === product.id)
    if (item) {
      item.quantity++
    } else {
      const shoppingCartItem = {product: product,quantity: 1, subtotal: 10  } as ShoppingCartItem
      shoppingCart.value?.items.push({ ...shoppingCartItem, quantity: 1 });
    }

    console.log('Cart', shoppingCart.value)
  }

  const removeFromCart = (product: SellableProduct) => {
    const item = shoppingCart.value?.items.find((item) => item.id === product.id)
    if (item) {
      item.quantity--
      if (item.quantity === 0) {
        // cart.value?.items = cart.value?.items.filter((item) => item.id !== product.id);
      }
    }
  }

  const removeAllFromCart = (product: SellableProduct) => {
    // cart.value = cart.value.filter((item) => item.id !== product.id);
  }

  return {
    // Properties
    isLoading: readonly(isLoading),
    hasError: hasError,
    products: readonly(products),
    cart: shoppingCart,

    // Methods
    addToCart,
    removeFromCart,
    removeAllFromCart
  }
}
