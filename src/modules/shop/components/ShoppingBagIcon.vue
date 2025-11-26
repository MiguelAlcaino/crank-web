<script setup lang="ts">
//
// -----------------
// IMPORTS
// -----------------
//

// Libs & Framework
import { inject } from 'vue'
import { useRouter } from 'vue-router'

// Composables, Services & Utilities
import { useShoppingCart } from '../composables/useShoppingCart'
import type { IApiService } from '@/services/IApiService'

//
// -----------------
// PROPS & EMITS
// -----------------
//

const props = withDefaults(
  defineProps<{
    /**
     * @description The scaling factor to adjust the size of the SVG icon.
     */
    scale?: number
  }>(),
  {
    scale: 0.4
  }
)

//
// -----------------
// DEPENDENCIES & COMPOSABLES
// -----------------
//

const router = useRouter()
const apiService = inject<IApiService>('gqlApiService')!
const { totalItemsInCart, isLoading } = useShoppingCart(apiService)

//
// -----------------
// METHODS
// -----------------
//

/**
 * @description Navigates the user to the shopping cart page when the icon is clicked.
 */
const goToCart = () => {
  router.push('/shop/cart')
}
</script>

<template>
  <div
    class="icon-wrapper d-flex justify-content-center align-items-center"
    @click="goToCart"
    role="button"
    aria-label="Open shopping cart"
    tabindex="0"
  >
    <div
      :style="{
        width: `${64 * props.scale}px`,
        height: `${80 * props.scale}px`
      }"
    >
      <svg
        class="w-100 h-100"
        viewBox="0 0 16 19"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.1516 4.68901C14.1177 4.30339 13.7851 4.00773 13.3868 4.00912H11.2722C11.1801 2.06587 9.48425 0.562799 7.48427 0.65223C5.61294 0.735734 4.11533 2.19086 4.02939 4.00912H1.91476C1.51645 4.00773 1.18381 4.30357 1.1499 4.68901L0.00269819 17.6935C-0.0152437 17.9004 0.0568826 18.1053 0.201494 18.2583C0.346823 18.4126 0.552257 18.5003 0.76738 18.4998H14.534C14.7479 18.4992 14.9517 18.4116 15.0961 18.2583C15.2422 18.106 15.3155 17.9011 15.2988 17.6935L14.1516 4.68901ZM7.6436 2.15129C8.72998 2.15269 9.63658 2.95792 9.73526 4.00912H5.55176C5.65044 2.95792 6.55722 2.15269 7.6436 2.15129Z"
          fill="currentColor"
        />
      </svg>
    </div>

    <span class="number">
      <template v-if="isLoading">
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      </template>
      <template v-else>
        {{ totalItemsInCart }}
      </template>
    </span>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
<style scoped>
.icon-wrapper {
  cursor: pointer;
  position: relative;
  width: 50px;
  height: 50px;
  background-color: transparent;
  border-radius: 50%;
  transition: background-color 0.2s ease-in-out;
}

.icon-wrapper .number {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-60%, -20%);
  color: #fb7185;
  font-size: 12px;
  font-weight: bold;
  pointer-events: none;
}

.icon-wrapper:hover {
  background-color: #f0f0f0;
}

.icon-wrapper:focus {
  outline: 2px solid #fb7185;
  outline-offset: 2px;
}
</style>
