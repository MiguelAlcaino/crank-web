<script setup lang="ts">
import type { ShoppingCartModel } from '../models/ShoppingCartModel'

import IconBag from '@/modules/shop/components/icons/IconBag.vue'
import IconGift from '@/modules/shop/components/icons/IconGift.vue'
import IconMerch from '@/modules/shop/components/icons/IconMerch.vue'
import IconSmoothie from '@/modules/shop/components/icons/IconSmoothie.vue'

defineProps<{
  cart: ShoppingCartModel | null
  isLoading: boolean
}>()

defineEmits(['confirm', 'back'])

const iconComponents: Record<string, any> = {
  bag: IconBag,
  gift: IconGift,
  merch: IconMerch,
  smoothie: IconSmoothie,
  default: IconBag
}

const getIcon = (iconName: string) => {
  return iconComponents[iconName] || iconComponents.default
}
</script>

<template>
  <div class="confirmation-container">
    <!-- Header -->
    <div class="header text-center p-4">
      <h2 class="header-title">SHOPPING CART</h2>
      <p class="text-muted text-uppercase" v-if="cart">{{ cart.itemCount }} ITEMS IN YOUR BASKET</p>
    </div>

    <!-- Scrollable List -->
    <div class="items-list p-3">
      <div v-for="item in cart?.items" :key="item.id" class="confirm-item d-flex">
        <!-- Icon (Left Black Box) -->
        <div class="item-icon d-flex justify-content-center align-items-center">
          <component :is="getIcon(item.variant.product.iconName)" class="icon-svg" />
        </div>

        <!-- Details (Center) -->
        <div
          class="item-details flex-grow-1 d-flex flex-column justify-content-center text-center p-2"
        >
          <span class="item-title font-weight-bold text-uppercase">
            {{ item.variant.product.title }}
          </span>
          <span class="item-price font-weight-bold">
            {{ item.variant.getFormattedPrice() }}
          </span>
          <span class="item-subtitle small text-muted text-uppercase mt-1">
            {{ item.variant.product.subtitle || 'INSTRUCTIONS HERE' }}
          </span>
        </div>

        <!-- Quantity (Right Grey Box) -->
        <div class="item-qty d-flex justify-content-center align-items-center">
          <span class="font-weight-bold">{{ item.quantity }}</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer-area">
      <!-- Total Bar -->
      <div class="total-bar p-3 d-flex justify-content-between">
        <span class="text-orange">TOTAL AMOUNT</span>
        <span class="text-orange"> {{ cart?.formattedTotal || '$0.00' }} </span>
      </div>

      <!-- Action Button -->
      <div class="p-4 text-center">
        <button class="btn-confirm" @click="$emit('confirm')" :disabled="isLoading">
          <span v-if="isLoading" class="spinner-border spinner-border-sm mr-2"></span>
          <span v-else>CONFIRM</span>
        </button>

        <button class="btn-back d-block w-100" @click="$emit('back')" :disabled="isLoading">
          Modify Payment Details
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped>
.confirmation-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f4f5f7;
}

.items-list {
  flex-grow: 1;
  overflow-y: auto;
  padding: 0;
  background-color: white;
}

.footer-area {
  margin-top: auto;
  background-color: white;
  width: 100%;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.05);
}

.header h1 {
  font-family: 'BigJohn', sans-serif;
  font-size: 2rem;
  margin-top: 1rem;
}

.confirm-item {
  background-color: #f4f4f4;
  border-bottom: 2px solid #fff;
  height: 100px;
}

.item-icon {
  background-color: black;
  width: 80px;
  min-width: 80px;
  color: white;
}

.icon-svg {
  width: 30px;
  height: 30px;
}

.item-details {
  background-color: #f4f4f4;
}

.item-title {
  font-family: 'BigJohn', sans-serif !important;
  font-size: 0.9rem;
  line-height: 1.2;
}

.item-qty {
  background-color: #e0e0e0;
  width: 60px;
  min-width: 60px;
  font-family: 'BigJohn', sans-serif !important;
  font-size: 1.1rem;
}

.total-bar {
  background-color: black;
  color: white;
  font-family: 'BigJohn', sans-serif !important;
  letter-spacing: 1px;
}

.total-bar span {
  font-family: 'BigJohn', sans-serif !important;
  font-size: 1.1rem;
}

.text-orange {
  color: #ff8c69;
}

.btn-confirm {
  background-color: #ff8c69;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-family: 'BigJohn', sans-serif !important;
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(255, 140, 105, 0.4);
  width: 100%;
  margin-bottom: 1rem;
  transition: transform 0.1s;
}

.btn-confirm span {
  font-family: 'BigJohn', sans-serif !important;
}

.btn-confirm:active {
  transform: scale(0.98);
}

.btn-back {
  background: none;
  border: none;
  text-decoration: underline;
  color: #666;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  font-family: 'BigJohn', sans-serif !important;
}

.header-title {
  font-weight: 400;
  color: #000;
  font-size: 2.5rem;
  text-align: center;
  margin-top: 2rem;
}
</style>
