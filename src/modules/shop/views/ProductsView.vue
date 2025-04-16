<script setup lang="ts">
import type { ApiService } from '@/services/apiService'
import { useProducts } from '../composables/useProducts'
import { inject } from 'vue'
import { useShoppingCart } from '../composables/userShoppingCart'
import ShoppingBagIcon from '@/modules/shop/components/ShoppingBagIcon.vue'

import ProductCard from '../components/ProductCard.vue'
import CrankCircularProgressIndicator from '@/components/CrankCircularProgressIndicator.vue'

const apiService = inject<ApiService>('gqlApiService')!

const { isLoading, hasError, memberships, regularPackages, trialPackages, vodPackages } =
  useProducts(apiService)
const { productIdsInCart, addToCart } = useShoppingCart(apiService)
</script>

<template>
  <div class="d-flex" style="height: 100vh">
    <div
      class="d-flex flex-column align-items-center py-3"
      style="min-width: 70px; width: 60px; background-color: black; color: white; font-weight: bold"
    >
      <div class="my-3 text-vertical">SESSIONS</div>
      <div class="my-3 text-vertical">GIFT CARDS</div>
      <div class="my-3 text-vertical">F&B</div>
    </div>

    <div class="flex-grow-1 bg-light p-2 overflow-auto">
      <div class="shopping-bag-icon">
        <ShoppingBagIcon></ShoppingBagIcon>
      </div>

      <div class="text-center mb-3">
        <h4 class="font-weight-bold">THE GREAT DEALS</h4>
        <p class="text-muted">XX CREDITS LEFT</p>
        <p class="text-uppercase font-weight-bold small">Regular Packages ▼</p>
      </div>

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
            <h4>Trial Packages*</h4>
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
            <h4>Video-on-Demand Packages*</h4>
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
            <h4>Regular Packages*</h4>
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
          <div class="col-11">
            <h4>Memberships*</h4>
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
    </div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
<style scoped>
.shopping-bag-icon {
  position: fixed;
  top: 20px; /* Ajusta según lo necesites */
  right: 20px; /* Ajusta según lo necesites */
  z-index: 1000; /* Asegúrate de que esté por encima de otros elementos */
}

p {
  font-family: 'Avenir', sans-serif;
}

.text-vertical {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  letter-spacing: 2px;
  font-family: 'BigJohn', sans-serif;
}
</style>
