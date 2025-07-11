<script setup lang="ts">
import type { ShoppingCartItem } from '@/modules/shop/models/ShoppingCartItem'
import { defineEmits, defineProps } from 'vue'
import QuantityStepper from '@/modules/shop/components/QuantityStepper.vue'

const props = defineProps<{
  item: ShoppingCartItem
  iconComponent: any
  isUpdating: boolean
}>()

const emit = defineEmits<{
  (e: 'removeItem', itemId: string): void
  (e: 'updateQuantity', payload: { itemId: string; newQuantity: number }): void
}>()

const onRemove = () => {
  emit('removeItem', props.item.id)
}

const handleQuantityUpdate = (newQuantity: number) => {
  if (newQuantity <= 0) {
    emit('removeItem', props.item.id)
  } else {
    emit('updateQuantity', { itemId: props.item.id, newQuantity })
  }
}
</script>

<template>
  <div class="cart-item d-flex align-items-stretch" :class="{ 'is-updating': isUpdating }">
    <!-- Icon on the left -->
    <div class="cart-item-icon d-flex justify-content-center align-items-center">
      <component :is="iconComponent" class="cart-icon-svg" />
    </div>

    <!-- Info and Actions -->
    <div class="cart-item-details flex-grow-1 d-flex">
      <!-- Product info -->
      <div class="product-info p-3 flex-grow-1">
        <div class="font-weight-bold">{{ item.variant.product.title }}</div>
        <div class="font-weight-bold">{{ item.variant.getFormattedPrice() }}</div>
        <div class="item-subtitle small mt-2">{{ item.variant.product.subtitle }}</div>
      </div>

      <!-- Controls -->
      <div class="item-controls d-flex flex-column justify-content-between text-center">
        <div class="quantity-stepper-container">
          <QuantityStepper
            :model-value="item.quantity"
            :min="0"
            :disabled="isUpdating"
            @update-item="handleQuantityUpdate"
          />
        </div>

        <button class="btn btn-remove" @click="onRemove" :disabled="isUpdating">REMOVE</button>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
<style scoped>
.cart-item {
  background-color: #fdfdfd;
  border-bottom: 1px solid #e0e0e0;
}

.cart-item-icon {
  background-color: black;
  color: white;
  min-width: 90px;
  width: 90px;
}

.item-subtitle {
  color: #ff8c69;
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.5px;
}

.item-controls {
  min-width: 100px;
  background-color: #f7f7f7;
}

.quantity-stepper-container {
  width: 100%;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0;
}

.btn-remove {
  background-color: #ff8c69;
  color: white;
  border: none;
  border-radius: 0;
  font-weight: bold;
  font-size: 0.8rem;
  letter-spacing: 1px;
  padding: 0.75rem 0;
  transition: background-color 0.2s;
}

.cart-icon-svg {
  width: 40px;
  height: 40px;
  color: white;
}

.font-weight-bold {
  font-family: 'BigJohn', 'Arial Black', sans-serif;
}

.cart-item.is-updating {
  opacity: 0.6;
  pointer-events: none; /* Previene cualquier clic en el item */
  transition: opacity 0.2s ease-in-out;
}
</style>
