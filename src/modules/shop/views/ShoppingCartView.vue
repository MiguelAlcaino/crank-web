<script setup lang="ts">
import { ApiService } from '@/services/apiService'
import ShoppingCartItem from '../components/ShoppingCartItem.vue'
import { inject, ref } from 'vue'
import { useShoppingCart } from '../composables/userShoppingCart'

const { isLoading, hasError, shoppingCart, removeFromCart, updateItemInShoppingCart } =
  useShoppingCart(inject<ApiService>('gqlApiService')!)

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

const handleUpdateItem = (sellableProductId: string, quantity: number) => {
  console.log(sellableProductId, quantity)
  const item = shoppingCart.value?.items.find((item) => item.product.id === sellableProductId)
  if (item) {
    updateItemInShoppingCart(sellableProductId, quantity)
  }
}

const checkout = () => {
  //TODO: Implement checkout
  //  emit('checkout');
  closeDrawer()
}
</script>

<template>
  <div>
    <div class="row">
      <div class="col-12 col-sm-12 col-md-6 col-lg-7 col-xl-7">
        <div v-for="(shoppingCartItem, index) in shoppingCart?.items" :key="index">
          <ShoppingCartItem
            :shopping-cart-item="shoppingCartItem"
            @remove-item="handleRemoveItem"
            @update-item="handleUpdateItem"
          >
          </ShoppingCartItem>
          <hr />
        </div>
      </div>
      <div class="col-12 col-sm-12 col-md-6 col-lg-5 col-xl-4">
        {{ shoppingCart?.subTotal }}
        {{ shoppingCart?.total }}
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
