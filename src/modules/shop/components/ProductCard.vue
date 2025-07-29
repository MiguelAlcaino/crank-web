<script setup lang="ts">
//
// -----------------
// IMPORTS
// -----------------
//

// Libs & Frameworks
import { computed, inject, ref } from 'vue'
import { useRouter } from 'vue-router'

// Local Components
import TermsModal from './TermsModal.vue'

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
// LOCAL STATE FOR ALERT MODAL
// -----------------
//
const isAlertModalVisible = ref(false)
// This ref will store which action ('add' or 'buy') should be executed after the user confirms the alert.
const pendingAction = ref<'add' | 'buy' | null>(null)

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
// PRIVATE METHODS (to be called after confirmation)
// -----------------
//
/**
 * @description The actual logic for adding to cart.
 */
const executeAddToCart = () => {
  if (props.product.variants.length === 1) {
    addToCart(props.product.variants[0].id)
  } else {
    // TODO: Show a modal or selector for multiple variants.
    console.log('Multiple variants detected. Modal/selector needed.')
  }
}

/**
 * @description The actual logic for the "Buy Now" flow.
 */
const executeBuyNow = async () => {
  if (props.product instanceof GiftCardProduct) {
    window.open(props.product.purchaseUrl, '_blank')
    return
  }

  if (props.product.variants.length > 0) {
    const success = await buyNow(props.product.variants[0].id)
    if (success) {
      router.push('/shop/checkout')
    }
  }
}

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
  if (isAddButtonDisabled.value) return

  if (props.product.alert) {
    // If an alert exists, set the pending action and show the modal.
    pendingAction.value = 'add'
    isAlertModalVisible.value = true
  } else {
    // If no alert, execute the action immediately.
    executeAddToCart()
  }
}

/**
 * Handles the click on the "BUY NOW" button.
 * It now checks for a product alert before executing the action.
 */
const handleBuyNowClick = () => {
  if (isBuyButtonDisabled.value) return

  if (props.product.alert) {
    // If an alert exists, set the pending action and show the modal.
    pendingAction.value = 'buy'
    isAlertModalVisible.value = true
  } else {
    // If no alert, execute the action immediately.
    executeBuyNow()
  }
}

/**
 * @description This handler is called when the user clicks "CONFIRM" on the alert modal.
 * It executes the stored pending action.
 */
const handleAlertConfirm = () => {
  if (pendingAction.value === 'add') {
    executeAddToCart()
  } else if (pendingAction.value === 'buy') {
    executeBuyNow()
  }
  // Reset the state after execution. The modal closes itself via the v-model.
  pendingAction.value = null
}

/**
 * @description Resets the pending action if the user closes the modal without confirming.
 */
const handleAlertCancel = () => {
  pendingAction.value = null
}
</script>

<template>
  <div>
    <div
      class="card border-0 rounded-0 mb-2 product-card"
      style="background-color: #f4f4f4; height: 130px"
    >
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

            <span v-else-if="isInCart" class="button-text">ADDED</span>

            <span v-else class="button-text">{{ product.buttonText || 'ADD' }}</span>
          </button>
          <button
            class="btn btn-sm font-weight-bold flex-fill rounded-0"
            style="background-color: #ff8a73; color: white"
            @click="handleBuyNowClick"
            :disabled="isBuyButtonDisabled"
          >
            <span class="button-text">BUY</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 
      This is the modal that will be shown when needed.
      It's bound to the product's alert data.
    -->
    <TermsModal
      v-if="product.alert"
      v-model="isAlertModalVisible"
      :main-title="product.alert.title"
      sub-title="Please read before proceeding"
      :content="product.alert.description"
      @confirm="handleAlertConfirm"
      @update:model-value="handleAlertCancel"
    />
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

.button-text {
  font-family: 'BigJohn', sans-serif;
  font-size: 14px;
  letter-spacing: 0.5px;
}

.product-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
