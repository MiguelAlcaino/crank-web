<script setup lang="ts">
import { ApiService } from '@/services/apiService'
import { useProducts } from '../composables/useProducts'
import { inject } from 'vue'

const { isLoading, hasError, products, cart, addToCart, removeFromCart, removeAllFromCart } =
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
    <div>
      <h2>Shopping Cart</h2>
      <div v-for="item in cart?.items" :key="item.id" class="cart-item">
        <h3>{{ item.product.title }}</h3>
        <p>{{ item.product.price }} {{ item.product.currency }} x {{ item.quantity }}</p>
      </div>
      <div v-if="cart?.items.length === 0">Your cart is empty.</div>
    </div>
  </div>
</template>

<style scoped></style>
