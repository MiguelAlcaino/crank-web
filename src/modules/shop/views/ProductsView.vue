<script setup lang="ts">
//
// -----------------
// IMPORTS
// -----------------
//

// Libs & Frameworks
import { inject, onMounted } from 'vue'

// Local Components
import ProductCard from '@/modules/shop/components/ProductCard.vue'
import ShoppingBagIcon from '@/modules/shop/components/ShoppingBagIcon.vue'
import CrankCircularProgressIndicator from '@/components/CrankCircularProgressIndicator.vue'

// Composables, Services & Utilities
import { useProducts } from '../composables/useProducts'
import { useShoppingCart } from '../composables/useShoppingCart'
import type { IApiService } from '@/services/IApiService'

//
// -----------------
// DEPENDENCIES & COMPOSABLES
// -----------------
//
const apiService = inject<IApiService>('gqlApiService')!

const {
  // State
  isLoading,
  hasError,
  activeTab,
  sessionsProductGroups,
  filteredSessionsProductGroups,
  giftCards,
  classPackageSelectType,
  // Methods
  setActiveTab,
  fetchAllProducts
} = useProducts(apiService)

const {
  // State
  productIdsInCart,
  // Methods
  addToCart,
  fetchCartSummary
} = useShoppingCart(apiService)

//
// -----------------
// LIFECYCLE HOOKS
// -----------------
//

/**
 * @description When the component is mounted, fetch the initial product data.
 */
onMounted(() => {
  fetchAllProducts()
  fetchCartSummary()
})
</script>

<template>
  <div class="d-flex" style="height: 100vh">
    <!-- Tab Bar -->
    <div
      class="d-flex flex-column align-items-center py-3"
      style="min-width: 70px; width: 60px; background-color: black; color: white; font-weight: bold"
    >
      <div
        class="my-3 text-vertical tab-item"
        :class="{ 'active-tab': activeTab === 'SESSIONS' }"
        @click="setActiveTab('SESSIONS')"
      >
        SESSIONS
      </div>
      <div
        class="my-3 text-vertical tab-item"
        :class="{ 'active-tab': activeTab === 'GIFT_CARDS' }"
        @click="setActiveTab('GIFT_CARDS')"
      >
        GIFT CARDS
      </div>
      <div
        class="my-3 text-vertical tab-item"
        :class="{ 'active-tab': activeTab === 'FB' }"
        @click="setActiveTab('FB')"
      >
        F&B
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-grow-1 bg-light p-2 overflow-auto">
      <div class="d-flex justify-content-end align-items-center mb-4 w-100">
        <div class="shopping-bag-icon">
          <ShoppingBagIcon></ShoppingBagIcon>
        </div>
      </div>

      <div class="text-center mb-3">
        <h4 class="font-weight-bold">THE GREAT DEALS</h4>
        <p class="text-muted">XX CREDITS LEFT</p>
      </div>
      <div v-if="activeTab === 'SESSIONS'">
        <div class="text-center mb-3">
          <select
            v-model="classPackageSelectType"
            class="custom-select text-uppercase font-weight-bold small"
            style="max-width: 300px; margin: 0 auto"
          >
            <option :value="null">All</option>
            <option v-for="group in sessionsProductGroups" :key="group.type" :value="group.type">
              {{ group.title }}
            </option>
          </select>
        </div>

        <div v-if="isLoading" class="text-center">
          <CrankCircularProgressIndicator
            text="Loading..."
            v-if="isLoading"
          ></CrankCircularProgressIndicator>
        </div>

        <div v-else-if="hasError" class="text-center">
          <p>Sorry, we couldn't load the products. Please try again later.</p>
        </div>

        <div v-else>
          <div class="row mt-3" v-for="group in filteredSessionsProductGroups" :key="group.type">
            <div class="col-12">
              <h4>{{ group.title }}</h4>
            </div>
            <div
              class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3"
              v-for="product in group.products"
              :key="product.id"
            >
              <ProductCard
                :product="product"
                :is-in-cart="productIdsInCart.has(product.id)"
                @add-to-cart="addToCart"
              >
              </ProductCard>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="activeTab === 'GIFT_CARDS'">
        <div class="row mt-3">
          <div
            class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3"
            v-for="giftCard in giftCards"
            :key="giftCard.id"
          >
            <ProductCard
              :product="giftCard"
              :is-in-cart="productIdsInCart.has(giftCard.id)"
              @add-to-cart="addToCart"
            >
            </ProductCard>
          </div>
        </div>
      </div>
      <div v-else-if="activeTab === 'FB'"></div>
    </div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
<style scoped>
.shopping-bag-icon {
  top: 20px;
  right: 20px;
  z-index: 1000;
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

.tab-item {
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 10px 0;
}

.tab-item:hover {
  color: #ccc;
}

.active-tab {
  color: #f8f9fa;
  text-decoration: underline;
  font-weight: bolder;
}
</style>
