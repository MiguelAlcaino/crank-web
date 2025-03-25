<script setup lang="ts">
import type { ApiService } from '@/services/apiService'
import { useProducts } from '../composables/useProducts'
import { inject } from 'vue'
import { useShoppingCart } from '../composables/userShoppingCart'

import ProductCard from '../components/ProductCard.vue'
import CrankCircularProgressIndicator from '@/components/CrankCircularProgressIndicator.vue'

const apiService = inject<ApiService>('gqlApiService')!

const {
  isLoading,
  hasError,
  memberships,
  regularPackages,
  specialPackages,
  trialPackages,
  vodPackages
} = useProducts(apiService)
const { productIdsInCart, addToCart } = useShoppingCart(apiService)
</script>

<template>
  <div class="mt-3">
    <h1>Buy Sessions</h1>
    <div class="row">
      <div class="col-12" style="text-align: center">
        <CrankCircularProgressIndicator
          text="Loading..."
          v-if="isLoading"
        ></CrankCircularProgressIndicator>
      </div>
    </div>
    <div v-if="hasError">Error loading products.</div>
    <div v-if="!isLoading && !hasError">
      <div class="row mt-3">
        <div class="col-12">
          <h2>Trial Packages*</h2>
        </div>
        <div
          class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3"
          v-for="product in trialPackages"
          :key="product.id"
        >
          <ProductCard
            :product="product"
            :is-in-cart="productIdsInCart.includes(product.id)"
            @add-to-cart="addToCart"
          >
          </ProductCard>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-12">
          <h2>Video-on-Demand Packages*</h2>
        </div>
        <div
          class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3"
          v-for="product in vodPackages"
          :key="product.id"
        >
          <ProductCard
            :product="product"
            :is-in-cart="productIdsInCart.includes(product.id)"
            @add-to-cart="addToCart"
          >
          </ProductCard>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-12">
          <h2>Regular Packages*</h2>
        </div>
        <div
          class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3"
          v-for="product in regularPackages"
          :key="product.id"
        >
          <ProductCard
            :product="product"
            :is-in-cart="productIdsInCart.includes(product.id)"
            @add-to-cart="addToCart"
          >
          </ProductCard>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-12">
          <h2>Memberships*</h2>
        </div>
        <div
          class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3"
          v-for="product in memberships"
          :key="product.id"
        >
          <ProductCard
            :product="product"
            :is-in-cart="productIdsInCart.includes(product.id)"
            @add-to-cart="addToCart"
          >
          </ProductCard>
        </div>
      </div>
    </div>

    <div class="mt-2">
      <p>* Prices are inclusive of VAT</p>
      <p>* Packages are non-transferable between members</p>
      <p>* Packages purchased are non-refundable, and may not be suspended, extended or frozen</p>
      <p>* Validity of Packages is from date of purchase</p>
      <p><br /></p>
      <div class="text-center">
        <small>We accept payments online using Visa and MasterCard credit/debit card in AED</small>
        <br />
        <img style="max-height: 50px" src="../../../assets/images/cards_accepted_white2.png" />
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
<style scoped>
p {
  font-family: 'Avenir', sans-serif;
}
</style>
