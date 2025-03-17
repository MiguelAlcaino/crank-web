<script setup lang="ts">
import { ApiService } from '@/services/apiService'
import { useProducts } from '../composables/useProducts'
import { inject } from 'vue'
import ShoppingCart from '../components/ShoppingCartDrawer.vue'

const { isLoading, hasError, products, addToCart, removeFromCart, removeAllFromCart } =
  useProducts(inject<ApiService>('gqlApiService')!)
</script>

<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-if="hasError">Error loading products.</div>
    <div v-if="!isLoading && !hasError">
      <div v-for="product in products" :key="product.id" class="product">
        <h3>{{ product.title }}</h3>
        <p>{{ product.price }} {{ product.currency }}</p>
        <button @click="addToCart(product)">Add to Cart</button>
        <button @click="removeFromCart(product)">Remove from Cart</button>
        <button @click="removeAllFromCart(product)">Remove All</button>
      </div>
    </div>
    <ShoppingCart></ShoppingCart>
  </div>

</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
<style scoped></style>
