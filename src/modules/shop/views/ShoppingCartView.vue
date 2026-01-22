<script setup lang="ts">
//
// -----------------
// IMPORTS
// -----------------
//

// Libs & Frameworks
import type { Component } from 'vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Local Components
import ShoppingCartItem from '@/modules/shop/components/ShoppingCartItem.vue'
import CrankCircularProgressIndicator from '@/components/CrankCircularProgressIndicator.vue'
import IconBag from '@/modules/shop/components/icons/IconBag.vue'
import IconGift from '@/modules/shop/components/icons/IconGift.vue'
import IconMerch from '@/modules/shop/components/icons/IconMerch.vue'
import IconSmoothie from '@/modules/shop/components/icons/IconSmoothie.vue'
import DiscountCodeForm from '@/modules/shop/components/DiscountCodeForm.vue'

// Composables, Services & Utilities
import { useShoppingCart } from '../composables/useShoppingCart'
import type { IconName } from '@/modules/shop/models/types'

//
// -----------------
// DEPENDENCIES & COMPOSABLES
// -----------------
//
const router = useRouter()

const { detailedCart, totalItemsInCart, isLoading, isItemUpdating, fetchCartDetails } =
  useShoppingCart()

//
// -----------------
// CONSTANTS
// -----------------
//
const iconComponents: Record<IconName | 'default', Component> = {
  bag: IconBag,
  gift: IconGift,
  merch: IconMerch,
  smoothie: IconSmoothie,
  default: IconBag,
  unknown: IconBag
}

//
// -----------------
// LIFECYCLE HOOKS
// -----------------
//
/**
 * When the cart page is mounted, it fetches the full, detailed cart data
 * to ensure all totals and item details are accurate.
 */
onMounted(() => {
  fetchCartDetails()
})

//
// -----------------
// METHODS
// -----------------
//
/**
 * Navigates the user to the final checkout page.
 */
const handleCheckout = () => {
  if (detailedCart.value?.isEmpty) {
    //TODO: show a user-friendly message or modal
    alert('Your cart is empty.')
    return
  }
  router.push('/shop/checkout')
}
</script>

<template>
  <div class="cart-screen d-flex flex-column">
    <!-- Header -->
    <div class="cart-header text-center p-4">
      <h1 class="font-weight-bold">MY WORKOUT WISHLIST</h1>
      <p class="text-muted text-uppercase">{{ totalItemsInCart }} ITEMS IN YOUR BASKET</p>
    </div>

    <!-- List of Items (with scroll) -->
    <div class="cart-items-list flex-grow-1 overflow-auto px-2">
      <div v-if="isLoading" class="loading-overlay">
        <CrankCircularProgressIndicator text="Loading your basket..." />
      </div>
      <div v-if="detailedCart?.isEmpty" class="text-center p-5">
        <p>Your basket is empty.</p>
      </div>
      <div v-else>
        <ShoppingCartItem
          v-for="item in detailedCart?.items"
          :key="item.id"
          :item="item"
          :icon-component="iconComponents[item.variant.product.iconName] || iconComponents.default"
          :is-updating="isItemUpdating(item.id).value"
        />
      </div>
    </div>

    <!-- Fixed Footer -->
    <div class="cart-footer">
      <div class="discount-wrapper p-3">
        <DiscountCodeForm />
      </div>
      <div
        class="total-bar d-flex justify-content-between align-items-center text-white font-weight-bold p-3"
      >
        <span>TOTAL AMOUNT</span>
        <span>{{ detailedCart?.formattedTotal }}</span>
      </div>
      <div class="checkout-area p-4">
        <button
          class="btn btn-checkout btn-block"
          @click="handleCheckout"
          :disabled="(detailedCart?.isEmpty ?? true) || isLoading"
        >
          LET'S DO THAT!
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
<style scoped>
h1,
.font-weight-bold {
  font-family: 'BigJohn', 'Arial Black', sans-serif;
}

.cart-screen {
  background-color: #f0f2f5;
  height: 100vh;
  font-family: 'Avenir', sans-serif;
}

.cart-header h1 {
  font-size: 2.5rem;
  letter-spacing: 1px;
}

.cart-header p {
  letter-spacing: 2px;
}

.cart-footer {
  background-color: white;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.08);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.total-bar {
  background-color: black;
  letter-spacing: 1.5px;
}

.checkout-area {
  background-color: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.btn-checkout {
  background-color: #ff8c69;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  letter-spacing: 1.5px;
  padding: 15px;
  border-radius: 10px;
  border: none;
  box-shadow: 0 4px 10px rgba(255, 140, 105, 0.5);
  transition: all 0.2s ease-in-out;
}

.btn-checkout:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(255, 140, 105, 0.6);
}

.loading-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
