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
import VariantSelectorModal from './VariantSelectorModal.vue'

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
const isVariantModalVisible = ref(false)

// This ref will store which action ('add' or 'buy') should be executed after the user confirms the alert.
const pendingActionContext = ref<{
  action: 'add' | 'buy'
  variantId: string
} | null>(null)

//
// -----------------
// COMPUTED PROPERTIES
// -----------------
//

/**
 * @description A reactive flag that is true if THIS specific product is being added to the cart.
 */
const isAdding = computed(
  () => isItemUpdating(pendingActionContext.value?.variantId ?? props.product.variants[0]?.id).value
)

/**
 * @description A single computed property to determine if the ADD button should be disabled.
 * This encapsulates all disabling logic in one place for clarity and type safety.
 */
const isAddButtonDisabled = computed(
  () =>
    props.isInCart ||
    isProcessingBuyNow.value ||
    (isAdding.value && pendingActionContext.value?.action === 'add')
)

/**
 * @description A computed property to determine if the "BUY" button should be disabled.
 * It's disabled if any cart operation ("add" or "buy now") is in progress.
 */
const isBuyButtonDisabled = computed(
  () => isProcessingBuyNow.value || (isAdding.value && pendingActionContext.value?.action === 'add')
)

//
// -----------------
// PRIVATE METHODS
// -----------------
//

/**
 * Starts the process for a specific action ('add' or 'buy').
 * It orchestrates the sequence of modals (variant -> alert) before execution.
 * @param {'add' | 'buy'} action - The intended action.
 */
const startActionFlow = (action: 'add' | 'buy') => {
  if (props.product.variants.length === 0) return

  if (props.product.variants.length > 1) {
    // If multiple variants, first open the variant selector.
    // Store the intended action so we know what to do next.
    pendingActionContext.value = { action, variantId: '' } // variantId is empty for now
    isVariantModalVisible.value = true
  } else {
    // If only one variant, we already know the variantId.
    // Proceed directly to checking for alerts.
    const variantId = props.product.variants[0].id
    pendingActionContext.value = { action, variantId }

    if (props.product.alert) {
      isAlertModalVisible.value = true
    } else {
      // No modals needed, execute immediately.
      executePendingAction()
    }
  }
}

/**
 * Executes the stored pending action based on the context.
 * This is the final step in the confirmation flow.
 */
const executePendingAction = () => {
  if (!pendingActionContext.value) return

  const { action, variantId } = pendingActionContext.value

  if (action === 'add') {
    addToCart(variantId)
  } else if (action === 'buy') {
    // You can expand this part for the 'Buy Now' flow
    buyNow(variantId).then((success) => {
      if (success) {
        router.push('/shop/checkout')
      }
    })
  }

  // Clean up after execution
  pendingActionContext.value = null
}

/**
 * @description The actual logic for adding to cart.
 */
const executeAddToCart = (variantId: string) => {
  addToCart(variantId)
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

// --- EVENT HANDLERS ---

/**
 * Triggered by the "ADD" button.
 */
const handleAddClick = () => {
  if (isAddButtonDisabled.value) return
  startActionFlow('add')
}

/**
 * Triggered by the "BUY" button.
 */
const handleBuyNowClick = () => {
  if (isBuyButtonDisabled.value) return
  // You would also call startActionFlow('buy') here
  // For now, let's focus on the 'add' flow
  startActionFlow('buy')
}

/**
 * Triggered when a variant is selected and confirmed in the VariantSelectorModal.
 * @param {string} selectedVariantId - The ID of the chosen variant.
 */
const handleVariantSelected = (selectedVariantId: string) => {
  if (!pendingActionContext.value) return

  // 1. Update the context with the selected variant ID.
  pendingActionContext.value.variantId = selectedVariantId
  isVariantModalVisible.value = false // Close the variant modal.

  // 2. Check if the next step is the alert modal.
  if (props.product.alert) {
    isAlertModalVisible.value = true
  } else {
    // 3. If no alert, we're done with confirmations, so execute the action.
    executePendingAction()
  }
}

/**
 * THIS IS THE CORRECTED METHOD.
 * Triggered when the user confirms the TermsModal (the alert).
 * It now correctly uses the context that was saved.
 */
const handleAlertConfirm = () => {
  isAlertModalVisible.value = false // Close the alert modal.
  // The context has all the info we need (action and variantId), so we can just execute.
  executePendingAction()
}

/**

 * Cleans up the context if the user cancels any modal.
 */
const handleModalCancel = () => {
  pendingActionContext.value = null
  isAlertModalVisible.value = false
  isVariantModalVisible.value = false
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

    <TermsModal
      v-if="product.alert"
      v-model="isAlertModalVisible"
      :main-title="product.alert.title"
      sub-title="Please read before proceeding"
      :content="product.alert.description"
      @confirm="handleAlertConfirm"
      @update:model-value="handleModalCancel"
    />

    <VariantSelectorModal
      v-model="isVariantModalVisible"
      :product="product"
      @confirm="handleVariantSelected"
      @update:model-value="handleModalCancel"
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
