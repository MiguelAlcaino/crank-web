<script setup lang="ts">
import type { SellableProduct } from '../interfaces'
import { useRouter } from 'vue-router'

const router = useRouter()

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
  <div class="card border-0 rounded-0 mb-2" style="background-color: #f4f4f4; height: 130px">
    <div class="d-flex h-100">
      <div class="p-2 flex-grow-1 text-center d-flex flex-column justify-content-center">
        <h6 class="font-weight-bold mb-2">{{ product.title }}</h6>
        <p class="mb-1 small">{{ product.subtitle }}</p>
        <p class="text-muted small mb-0">
          {{ product.alertBeforePurchasing?.title.toUpperCase() }}
        </p>
      </div>
      <div class="d-flex flex-column" style="width: 90px; height: 100%">
        <button
          class="btn btn-dark btn-sm font-weight-bold flex-fill rounded-0"
          @click="addToCart(product.id)"
        >
          ADD
        </button>
        <button
          class="btn btn-sm font-weight-bold flex-fill rounded-0"
          style="background-color: #ff8a73; color: white"
        >
          BUY
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
<style scoped></style>
