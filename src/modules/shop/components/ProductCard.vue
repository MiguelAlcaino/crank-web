<script setup lang="ts">
import { SellableProduct } from '../interfaces'
import router from '@/router'

const props = defineProps<{
  product: SellableProduct
  isInCart: boolean
}>()

const emits = defineEmits<{
  (e: 'updateItem', sellableProductId: string, quantity: number): void
  (e: 'removeItem', shoppingCartItemId: string): void
  (e: 'addToCart', shoppingCartItemId: string): void
}>()

const updateItem = (quantity: number) => {
  emits('updateItem', props.product.id, quantity)
}

// const removeItem = () => {
//   emits('removeItem', props.shoppingCartItem.id)
// }

const showShoppingCart = () => {
  router.push('/shop/cart')
}

const addToCart = (sellableProductId: string) => {
  emits('addToCart', sellableProductId)
}
</script>

<template>
  <div class="card p-2 m-2">
    <div class="card-body d-flex flex-column justify-content-center align-items-center">
      <h5 class="card-title">{{ product.title }}</h5>
      <p class="card-text">{{ product.subtitle }}</p>
      <button v-if="!isInCart" @click="addToCart(product.id)" class="btn btn-primary">
        Add to Cart
      </button>
      <button v-else @click="showShoppingCart" class="btn btn-primary">Show Shopping Cart</button>
    </div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
<style scoped>
.avenir-font {
  font-family: 'Avenir', sans-serif;
}
</style>
