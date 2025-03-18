<script setup lang="ts">
import router from '@/router'
import { computed, inject, ref, watch } from 'vue'
import { useShoppingCart } from '../composables/userShoppingCart'
import { ApiService } from '@/services/apiService'
import ShoppingCartIcon from './ShoppingCartIcon.vue'

const modelValue = ref(false)
const title = ref('Your Cart')
const position = ref('right')
const width = ref('400px')

const apiService = inject<ApiService>('gqlApiService')!
const { shoppingCart, removeFromCart } = useShoppingCart(apiService)

watch(
  () => modelValue.value,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)

const viewCart = () => {
  router.push('/shop/cart')
  close()
}

const close = () => {
  modelValue.value = false
}

const open = () => {
  modelValue.value = true
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED'
  }).format(price)
}

const checkout = () => {
  //TODO: Implement checkout
  close()
}

const removeItem = (itemId: string) => {
  removeFromCart(itemId)
}

const totalItems = computed(() => {
  return shoppingCart.value?.items.reduce((total, item) => total + item.quantity, 0) || 0
})

const subtotal = computed(() => {
  return (
    shoppingCart.value?.items.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    ) || 0
  )
})
</script>

<template>
  <div>
    <ShoppingCartIcon :total-items="totalItems" @open="open"></ShoppingCartIcon>
    <Teleport to="body">
      <!-- Overlay -->
      <div
        v-if="modelValue"
        class="drawer-overlay"
        @click="close"
        :class="{ 'fade-in': modelValue }"
      ></div>

      <!-- Drawer -->
      <div
        class="drawer"
        :class="[
          position === 'left' ? 'drawer-left' : 'drawer-right',
          { 'drawer-open': modelValue }
        ]"
      >
        <div class="drawer-header">
          <h5 class="drawer-title">{{ title }}</h5>
          <button type="button" class="drawer-close" @click="close">
            <span>&times;</span>
          </button>
        </div>

        <div class="drawer-body">
          <!-- <slot></slot> -->
          <div v-for="item in shoppingCart?.items" :key="item.id" class="cart-item">    
            <div class="cart-item-header">
              <button class="btn btn-link p-0" @click="removeItem(item.id)">
                <i class="bi bi-trash"></i>
              </button>
              <p>{{ item.product.title }}</p>
            </div>
            <p>{{ item.quantity }} x {{ formatPrice(item.product.price) }}</p>
          </div>

          <div v-if="shoppingCart?.items.length === 0">Your cart is empty.</div>
        </div>

        <div class="drawer-cart-footer">
          <hr />
          <div class="drawer-subtotal">
            <span>Subtotal: </span>
            <span class="drawer-price">{{ formatPrice(subtotal) }}</span>
          </div>

          <button class="btn btn-secondary btn-block" @click="viewCart">View Cart</button>
          <button class="btn btn-primary btn-block" @click="checkout">
            <i class="bi bi-cart-check"></i> Checkout
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
<style scoped>
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.fade-in {
  opacity: 1;
}

.drawer {
  position: fixed;
  top: 0;
  height: 100%;
  background-color: #fff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  z-index: 1050;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  width: v-bind(width);
}

.drawer-right {
  right: 0;
  transform: translateX(100%);
}

.drawer-open {
  transform: translateX(0);
}

.drawer-header {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawer-title {
  margin: 0;
  font-size: 1.25rem;
}

.drawer-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  margin: -0.5rem -0.5rem -0.5rem auto;
}

.drawer-body {
  padding: 1rem;
  flex: 1 1 auto;
  overflow-y: auto;
}

.drawer-footer {
  padding: 1rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
}

.cart-item {
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}

.cart-item-header {
  display: flex;
  align-items: center;
}

.cart-item-header p {
  margin-left: 10px;
  flex-grow: 1;
}
</style>
