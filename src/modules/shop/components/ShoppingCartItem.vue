<script setup lang="ts">
import type { ShoppingCartItem } from '@/modules/shop/models/ShoppingCart'
import { defineEmits, defineProps } from 'vue'

const props = defineProps<{
  item: ShoppingCartItem
  iconComponent: any
}>()

const emit = defineEmits<{
  (e: 'removeItem', itemId: string): void
  (e: 'updateQuantity', newQuantity: number): void
}>()

const onRemove = () => {
  emit('removeItem', props.item.id)
}

const onUpdateQuantity = (newQuantity: number) => {
  emit('updateQuantity', newQuantity)
}
</script>

<template>
  <div class="cart-item d-flex align-items-stretch">
    <!-- Icon on the left -->
    <div class="cart-item-icon d-flex justify-content-center align-items-center">
      <component :is="iconComponent" class="cart-icon-svg" />
    </div>

    <!-- Info and Actions -->
    <div class="cart-item-details flex-grow-1 d-flex">
      <!-- Product info -->
      <div class="product-info p-3 flex-grow-1">
        <div class="font-weight-bold">{{ item.product.title }}</div>
        <div class="font-weight-bold">AED {{ item.product.price }}</div>
        <div class="item-subtitle small mt-2">{{ item.product.subtitle }}</div>
      </div>

      <!-- Controls -->
      <div class="item-controls d-flex flex-column justify-content-between text-center">
        <div class="quantity-stepper d-flex justify-content-around align-items-center p-2">
          <!-- We call our local handlers who emit the events -->
          <button class="btn-stepper" @click="onUpdateQuantity(item.quantity - 1)">-</button>
          <span class="font-weight-bold">{{ item.quantity }}</span>
          <button class="btn-stepper" @click="onUpdateQuantity(item.quantity + 1)">+</button>
        </div>
        <button class="btn btn-remove" @click="onRemove">REMOVE</button>
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

.quantity-stepper {
  border-bottom: 1px solid #e0e0e0;
}

.btn-stepper {
  background: none;
  border: none;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  color: #555;
}

.btn-remove {
  background-color: #ff8c69;
  color: white;
  border: none;
  border-radius: 0;
  font-weight: bold;
  font-size: 0.8rem;
  letter-spacing: 1px;
  flex-grow: 1;
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
</style>
