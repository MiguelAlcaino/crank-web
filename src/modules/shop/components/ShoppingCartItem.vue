<script setup lang="ts">
import { computed } from 'vue'
import type { ShoppingCartItem } from '../interfaces'
import ProductNumberInput from './ProductNumberInput.vue'
import { formatPrice } from '../utils/shop-utils'

const props = defineProps<{
  shoppingCartItem: ShoppingCartItem
}>()

const emits = defineEmits<{
  (e: 'updateItem', sellableProductId: string, quantity: number): void
  (e: 'removeItem', shoppingCartItemId: string): void
}>()

const updateItem = (quantity: number) => {
  emits('updateItem', props.shoppingCartItem.product.id, quantity)
}

const removeItem = () => {
  emits('removeItem', props.shoppingCartItem.id)
}

const subtotal = computed(() => {
  return props.shoppingCartItem.product.price * props.shoppingCartItem.quantity
})
</script>

<template>
  <div>
    <div class="row">
      <div class="col-6">
        <p>{{ shoppingCartItem.product.title }}</p>
        <p>{{ formatPrice(shoppingCartItem.product.price) }}</p>
        <ProductNumberInput
          :model-value="shoppingCartItem.quantity"
          @update-item="updateItem"
          :min="1"
          :max="1000"
          :step="1"
        >
        </ProductNumberInput>
        <button type="button" class="btn btn-link avenir-font" @click="removeItem">
          remove item
        </button>
      </div>
      <div class="col-6">{{ formatPrice(subtotal) }}</div>
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
