<script setup lang="ts">
//
// -----------------
// IMPORTS
// -----------------
//

// Libs & Frameworks
import { computed, inject } from 'vue'
import { useRouter } from 'vue-router'

// Models, Composables & Services
import { GiftCardProduct, Product } from '../models/Product'
import { useShoppingCart } from '../composables/useShoppingCart'
import type { IApiService } from '@/services/IApiService'

//
// -----------------
// PROPS
// -----------------
//
const props = defineProps<{
  /**
   * @description The product object to display.
   */
  product: Product
  /**
   * @description A boolean indicating if the product is already in the cart.
   * Passed from the parent for initial state display.
   */
  isInCart: boolean
}>()

//
// -----------------
// DEPENDENCIES & COMPOSABLES
// -----------------
//
const router = useRouter()
const apiService = inject<IApiService>('gqlApiService')!

const { addToCart, isItemUpdating, buyNow, isProcessingBuyNow } = useShoppingCart(apiService)

//
// -----------------
// COMPUTED PROPERTIES
// -----------------
//

/**
 * @description A reactive flag that is true if THIS specific product is being added to the cart.
 */
const isAdding = computed(() => {
  if (props.product.variants.length === 0) return false
  // We check against the first variant's ID, as that's what `addToCart` uses for the loading state.
  return isItemUpdating(props.product.variants[0].id).value
})

/**
 * @description A single computed property to determine if the ADD button should be disabled.
 * This encapsulates all disabling logic in one place for clarity and type safety.
 */
const isAddButtonDisabled = computed(() => {
  return (
    props.product.variants.length === 0 ||
    props.isInCart ||
    isAdding.value ||
    isProcessingBuyNow.value
  )
})

/**
 * @description A computed property to determine if the "BUY" button should be disabled.
 * It's disabled if any cart operation ("add" or "buy now") is in progress.
 */
const isBuyButtonDisabled = computed(() => {
  return isAdding.value || isProcessingBuyNow.value
})

//
// -----------------
// METHODS
// -----------------
//
/**
 * Handles the click on the "ADD" button.
 * It adds the product's first variant to the cart.
 */
const handleAddClick = () => {
  // Guard clause to prevent double clicks or adding a product with no variants.
  if (isAdding.value || props.product.variants.length === 0) {
    return
  }

  if (props.product.variants.length === 1) {
    // Call the composable's action directly.
    addToCart(props.product.variants[0].id)
  } else {
    // TODO: Show a modal or selector for multiple variants.
    console.log('Multiple variants detected. Modal/selector needed.')
  }
}

/**
 * @description Handles the click on the "BUY" button.
 * It initiates the buyNow flow from the composable and navigates on success.
 */
const handleBuyNow = async () => {
  if (isBuyButtonDisabled.value) return

  // Handle special case for Gift Cards that navigate to an external URL.
  if (props.product instanceof GiftCardProduct) {
    window.open(props.product.purchaseUrl, '_blank')
    return
  }

  // Proceed with the standard "Buy Now" flow for other products.
  if (props.product.variants.length > 0) {
    // Call the orchestrated logic in the composable.
    const success = await buyNow(props.product.variants[0].id)

    // Only navigate to the checkout page if the entire process was successful.
    if (success) {
      router.push('/shop/checkout')
    }
    // If it fails (e.g., user cancels the modal), the user stays on the products page.
  }
}
</script>

<template>
  <div class="card border-0 rounded-0 mb-2" style="background-color: #f4f4f4; height: 130px">
    <div class="d-flex h-100">
      <div class="p-2 flex-grow-1 text-center d-flex flex-column justify-content-center">
        <h6 class="font-weight-bold mb-2">{{ product.title }}</h6>
        <p v-if="product.variants.length === 1" class="font-weight-bold mb-2">
          {{ product.variants[0].formattedPrice }}
        </p>
        <p class="mb-1 small">{{ product.subtitle }}</p>
        <p class="text-muted small mb-0">
          {{ product.alert?.title.toUpperCase() }}
        </p>
      </div>
      <div class="d-flex flex-column" style="width: 90px; height: 100%">
        <button
          class="btn btn-dark btn-sm font-weight-bold flex-fill rounded-0"
          @click="handleAddClick"
          :disabled="isAddButtonDisabled"
        >
          <div v-if="isAdding" class="spinner-border spinner-border-sm" role="status">
            <span class="sr-only">Adding...</span>
          </div>

          <span v-else-if="isInCart">ADDED</span>

          <span v-else>{{ product.buttonText || 'ADD' }}</span>
        </button>
        <button
          class="btn btn-sm font-weight-bold flex-fill rounded-0"
          style="background-color: #ff8a73; color: white"
          @click="handleBuyNow"
          :disabled="isBuyButtonDisabled"
        >
          <span
            v-if="isProcessingBuyNow || isAdding"
            class="spinner-border spinner-border-sm"
          ></span>
          <span v-else>BUY</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
<style scoped>
.btn:disabled {
  background-color: #6c757d;
  opacity: 0.65;
  cursor: not-allowed;
}
</style>
