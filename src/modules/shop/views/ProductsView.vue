<script setup lang="ts">
import { ApiService } from '@/services/apiService'
import { useProducts } from '../composables/useProducts'
import { inject } from 'vue'
import { useShoppingCart } from '../composables/userShoppingCart'
import router from '@/router'

const apiService = inject<ApiService>('gqlApiService')!

const { isLoading, hasError, products } = useProducts(apiService)
const { productIdsInCart, addToCart } = useShoppingCart(apiService)

const showShoppingCart = () => {
  router.push('/shop/cart')
}
</script>

<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-if="hasError">Error loading products.</div>
    <div v-if="!isLoading && !hasError">
      <div v-for="product in products" :key="product.id" class="product">
        <h3>{{ product.title }}</h3>
        <p>{{ product.price }} {{ product.currency }}</p>
        <button v-if="!productIdsInCart.includes(product.id)" @click="addToCart(product.id)">
          Add to Cart
        </button>
        <button v-else @click="showShoppingCart">Show Shopping Cart</button>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
<style scoped></style>
