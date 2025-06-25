<script setup lang="ts">
import ProductNumberInput from './ProductNumberInput.vue'
import type { ShoppingCartItem } from '@/modules/shop/models/ShoppingCart'

const props = defineProps<{
  shoppingCartItem: ShoppingCartItem
}>()

const emits = defineEmits<{
  (e: 'updateItem', sellableProductId: string, quantity: number): void
  (e: 'removeItem', shoppingCartItemId: string): void
}>()

const updateQuantity = (newQuantity: number) => {
  if (newQuantity !== props.shoppingCartItem.quantity) {
    emits('updateItem', props.shoppingCartItem.product.id, newQuantity)
  }
}

const removeItem = () => {
  emits('removeItem', props.shoppingCartItem.id)
}
</script>

<template>
  <div>
    <div class="row">
      <div class="col-6">
        <p class="fw-bold mb-1">{{ shoppingCartItem.product.title }}</p>
        <p class="text-muted mb-2">{{ shoppingCartItem.product.getFormattedPrice() }}</p>
        <ProductNumberInput
          :model-value="shoppingCartItem.quantity"
          @update-item="updateQuantity"
          :min="1"
          :max="1000"
          :step="1"
        >
        </ProductNumberInput>
        <button type="button" class="btn btn-link avenir-font" @click="removeItem">Remove</button>
      </div>
      <div class="col-md-6 text-end">
        <p class="fw-bold">{{ shoppingCartItem.getFormattedLineItemTotal() }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
<style scoped>
.avenir-font {
  font-family: 'Avenir', sans-serif;
}

.btn-link.text-danger {
  font-family: 'Avenir', sans-serif;
  text-decoration: none;
}

.fw-bold {
  font-weight: bold;
}

.text-muted {
  color: #6c757d;
}
</style>
