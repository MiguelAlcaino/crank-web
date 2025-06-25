<script setup lang="ts">
import { inject, ref } from 'vue'

import type { ApiService } from '@/services/ApiService'
import ShoppingCartItem from '../components/ShoppingCartItem.vue'
import { useShoppingCart } from '../composables/userShoppingCart'
import { useRouter } from 'vue-router'

const router = useRouter()
const apiService = inject<ApiService>('gqlApiService')!

const { shoppingCart, removeFromCart, updateItemInCart, calculatedSubtotal } =
  useShoppingCart(apiService)

const emit = defineEmits(['update:modelValue', 'removeItem'])

const modelValue = ref(true)
const closeDrawer = () => {
  modelValue.value = false
  //  emit('update:modelValue', false);
}

const handleRemoveItem = (shoppingCartItemId: string) => {
  const item = shoppingCart.value?.items.find((item) => item.id === shoppingCartItemId)
  if (item) {
    removeFromCart(item.id)
  }
}

const handleUpdateQuantity = (payload: { productId: string; quantity: number }) => {
  const item = shoppingCart.value?.items.find((item) => item.product.id === payload.productId)
  if (item) {
    updateItemInCart(payload)
  }
}

const checkout = () => {
  router.push('/shop/checkout')
  closeDrawer()
}
</script>

<template>
  <div>
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
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
<style scoped></style>
