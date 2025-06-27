<script setup lang="ts">
import { inject, ref } from 'vue'

import type { ApiService } from '@/services/ApiService'
import { useShoppingCart } from '../composables/userShoppingCart'
import { useRouter } from 'vue-router'

import IconBag from '@/modules/shop/components/icons/IconBag.vue'
import IconGift from '@/modules/shop/components/icons/IconGift.vue'
import IconMerch from '@/modules/shop/components/icons/IconMerch.vue'
import IconSmoothie from '@/modules/shop/components/icons/IconSmoothie.vue'
import type { IconName } from '@/modules/shop/models/types'

const router = useRouter()
const apiService = inject<ApiService>('gqlApiService')!

const {
  shoppingCart,
  removeFromCart,
  updateItemInCart,
  calculatedSubtotal,
  totalItemsInCart,
  formattedSubtotal
} = useShoppingCart(apiService)

const emit = defineEmits(['update:modelValue', 'removeItem'])

const modelValue = ref(true)
const closeDrawer = () => {
  modelValue.value = false
  //  emit('update:modelValue', false);
}

const handleCheckout = () => {
  router.push('/shop/checkout')
  closeDrawer()
}

const iconComponents: Record<IconName | 'default', any> = {
  bag: IconBag,
  gift: IconGift,
  merch: IconMerch,
  smoothie: IconSmoothie,
  default: IconBag,
  unknown: IconBag
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
      <div v-if="shoppingCart?.items.length === 0" class="text-center p-5">
        <p>Your basket is empty.</p>
      </div>
      <div v-else>
        <div v-if="shoppingCart?.items && shoppingCart.items.length > 0">
          <div
            v-for="item in shoppingCart?.items"
            :key="item.id"
            class="cart-item d-flex align-items-stretch"
          >
            <!-- Icon on the left -->
            <div class="cart-item-icon d-flex justify-content-center align-items-center">
              <component
                :is="iconComponents[item.product.iconName] || iconComponents.default"
                class="cart-icon-svg"
              />
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
                  <button class="btn-stepper" @click="updateItemInCart(item, item.quantity - 1)">
                    -
                  </button>
                  <span class="font-weight-bold">{{ item.quantity }}</span>
                  <button class="btn-stepper" @click="updateItemInCart(item, item.quantity + 1)">
                    +
                  </button>
                </div>
                <button class="btn btn-remove" @click="removeFromCart(item.id)">REMOVE</button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center p-5">
          <p>Your basket is empty.</p>
        </div>
      </div>
    </div>

    <!-- Fixed Footer -->
    <div class="cart-footer">
      <div
        class="total-bar d-flex justify-content-between align-items-center text-white font-weight-bold p-3"
      >
        <span>TOTAL AMOUNT</span>
        <span>{{ formattedSubtotal }}</span>
      </div>
      <div class="checkout-area p-4">
        <button class="btn btn-checkout btn-block" @click="handleCheckout">LET'S DO THAT!</button>
      </div>
    </div>
  </div>

  <!--  <div>
      <div class="row mt-3">
        <div class="col-12 col-sm-12 col-md-6 col-lg-7 col-xl-7">
          <div v-for="(shoppingCartItem, index) in shoppingCart?.items" :key="index">
            <ShoppingCartItem
              :shopping-cart-item="shoppingCartItem"
              @remove-item="handleRemoveItem"
              @update-item="handleUpdateQuantity"
            >
            </ShoppingCartItem>
            <hr />
          </div>
        </div>
        <div class="col-12 col-sm-12 col-md-6 col-lg-5 col-xl-4">
          {{ calculatedSubtotal }}
          <button class="btn btn-primary btn-block" @click="checkout">
            <i class="bi bi-cart-check"></i> Checkout
          </button>
        </div>
      </div>
    </div>-->
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

.cart-item {
  background-color: #fdfdfd;
  border-bottom: 1px solid #e0e0e0;
}

.cart-item:last-child {
  border-bottom: none;
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

.btn-remove:hover {
  background-color: #e07b5a;
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

.cart-icon-svg {
  width: 40px;
  height: 40px;
  color: white;
}
</style>
