<script setup lang="ts">
//
// -----------------
// IMPORTS
// -----------------
//

// Libs & Frameworks
import { computed, onMounted } from 'vue'

// Local Components
import ProductCard from '@/modules/shop/components/ProductCard.vue'
import ShoppingBagIcon from '@/modules/shop/components/ShoppingBagIcon.vue'
import CrankCircularProgressIndicator from '@/components/CrankCircularProgressIndicator.vue'
import SiteSelector from '@/components/SiteSelector.vue'

// Composables, Services & Utilities
import { useProducts } from '../composables/useProducts'
import { useShoppingCart } from '../composables/useShoppingCart'
import CreditLeft from '@/modules/shop/components/CreditLeft.vue'

//
// -----------------
// DEPENDENCIES & COMPOSABLES
// -----------------
//
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
} = useProducts()

const {
  // State
  productIdsInCart,
  // Methods
  fetchCartSummary
} = useShoppingCart()

const visibleTabs = computed(() => {
  return [
    {
      key: 'SESSIONS' as const,
      label: 'SESSIONS',
      isVisible: sessionsProductGroups.value.length > 0
    },
    {
      key: 'GIFT_CARDS' as const,
      label: 'GIFT CARDS',
      isVisible: giftCards.value.length > 0
    },
    {
      key: 'FB' as const,
      label: 'F&B',
      isVisible: false
    }
  ].filter((tab) => tab.isVisible)
})

//
// -----------------
// METHODS
// -----------------
//

/**
 * @description Loads all the necessary data for the products view
 */
function loadData() {
  fetchAllProducts()
  fetchCartSummary()
}

//
// -----------------
// LIFECYCLE HOOKS
// -----------------
//

/**
 * @description When the component is mounted, fetch the initial product data.
 */
onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="products-view d-flex">
    <!-- Tab Bar -->
    <aside class="shop-sidebar">
      <nav class="shop-sidebar__rail" aria-label="Shop categories">
        <button
          v-for="tab in visibleTabs"
          :key="tab.key"
          type="button"
          class="shop-sidebar__tab"
          :class="{ 'shop-sidebar__tab--active': activeTab === tab.key }"
          @click="setActiveTab(tab.key)"
        >
          <span class="shop-sidebar__tab-label">{{ tab.label }}</span>
        </button>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="products-content flex-grow-1 bg-light p-2 overflow-auto">
      <div class="d-flex justify-content-end align-items-center mb-4 w-100">
        <div class="shopping-bag-icon">
          <ShoppingBagIcon></ShoppingBagIcon>
        </div>
      </div>

      <div class="text-center">
        <div class="col-6" style="max-width: 300px; margin: 0 auto">
          <SiteSelector v-on:after-changing-site="loadData"></SiteSelector>
        </div>
      </div>
      <br />

      <div class="text-center mb-3">
        <h1 class="font-weight-bold">THE GREAT DEALS</h1>
        <CreditLeft></CreditLeft>
      </div>

      <div v-if="isLoading" class="text-center mt-5">
        <CrankCircularProgressIndicator text="Loading..."></CrankCircularProgressIndicator>
      </div>
      <div v-else-if="hasError" class="text-center mt-5">
        <p>Sorry, we couldn't load the products. Please try again later.</p>
      </div>
      <div v-else>
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
          <div class="row mt-3" v-for="group in filteredSessionsProductGroups" :key="group.type">
            <div class="col-12">
              <h4>{{ group.title }}</h4>
            </div>
            <div
              class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3"
              v-for="product in group.products"
              :key="product.id"
            >
              <ProductCard :product="product" :is-in-cart="productIdsInCart.has(product.id)">
              </ProductCard>
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
              <ProductCard :product="giftCard" :is-in-cart="productIdsInCart.has(giftCard.id)">
              </ProductCard>
            </div>
          </div>
        </div>
        <div v-else-if="activeTab === 'FB'"></div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
<style scoped>
.products-view {
  min-height: 100vh;
  background: #f5f5f5;
}

.products-content {
  min-width: 0;
}

.shopping-bag-icon {
  top: 20px;
  right: 20px;
  z-index: 1000;
}

p {
  font-family: 'Avenir', sans-serif;
}

.shop-sidebar {
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100vh;
  padding: 10px 0 10px 10px;
  background: #f5f5f5;
}

.shop-sidebar__rail {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: 82px;
  height: 100%;
  padding: 28px 12px;
  background: #050505;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.15);
}

.shop-sidebar__rail::after {
  content: '';
  position: absolute;
  top: 0;
  right: -2px;
  width: 3px;
  height: 100%;
  background: #ff8b78;
}

.shop-sidebar__tab {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 1 0;
  width: 100%;
  min-height: 128px;
  padding: 8px 0;
  color: rgba(255, 255, 255, 0.74);
  background: transparent;
  border: 0;
  border-radius: 18px 0 0 18px;
  cursor: pointer;
  transition: color 0.25s ease, transform 0.25s ease, background-color 0.25s ease;
}

.shop-sidebar__tab:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.06);
  transform: translateX(-1px);
}

.shop-sidebar__tab:focus-visible {
  outline: 2px solid #ff8b78;
  outline-offset: -2px;
}

.shop-sidebar__tab--active {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

.shop-sidebar__tab--active::after {
  content: '';
  position: absolute;
  top: 50%;
  right: -11px;
  width: 12px;
  height: 56px;
  border-radius: 0 12px 12px 0;
  background: #050505;
  transform: translateY(-50%);
}

.shop-sidebar__tab-label {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  letter-spacing: 3px;
  font-family: 'BigJohn', sans-serif;
  font-size: 1.05rem;
  line-height: 1;
}

@media (max-width: 991.98px) {
  .shop-sidebar {
    padding-left: 0;
  }

  .shop-sidebar__rail {
    width: 68px;
    gap: 12px;
    padding-block: 18px;
  }

  .shop-sidebar__tab {
    min-height: 108px;
  }

  .shop-sidebar__tab--active::after {
    right: -9px;
    width: 10px;
    height: 44px;
  }

  .shop-sidebar__tab-label {
    font-size: 0.95rem;
    letter-spacing: 2.6px;
  }
}
</style>
