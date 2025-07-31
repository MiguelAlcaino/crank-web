<script setup lang="ts">
//
// -----------------
// IMPORTS
// -----------------
//

import { computed, inject, ref } from 'vue'
import { useRouter } from 'vue-router'

// Local Components
import TermsModal from './TermsModal.vue'
import VariantSelectorModal from './VariantSelectorModal.vue'

// Models, Composables & Services
import { Product } from '../models/Product'
import { useShoppingCart } from '../composables/useShoppingCart'
import type { IApiService } from '@/services/IApiService'

//
// -----------------
// PROPS
// -----------------
//
const props = defineProps<{
  product: Product
  isInCart: boolean
}>()

//
// -----------------
// DEPENDENCIES & COMPOSABLES
// -----------------
//
const router = useRouter()
const apiService = inject<IApiService>('gqlApiService')!
const { addToCart, buyNow, isProcessingBuyNow } = useShoppingCart(apiService)

//
// -----------------
// LOCAL STATE
// -----------------
//

const isLocalAdding = ref(false)
const isLocalBuying = ref(false)

const isAlertModalVisible = ref(false)
const isVariantModalVisible = ref(false)
const pendingActionContext = ref<{
  action: 'add' | 'buy'
  variantId: string
} | null>(null)

//
// -----------------
// COMPUTED PROPERTIES
// -----------------
//

const showAddSpinner = computed(() => isLocalAdding.value)
const showBuySpinner = computed(() => isLocalBuying.value)

const isAddButtonDisabled = computed(() => {
  return props.isInCart || isLocalAdding.value || isLocalBuying.value || isProcessingBuyNow.value
})
const isBuyButtonDisabled = computed(() => {
  return isLocalAdding.value || isLocalBuying.value || isProcessingBuyNow.value
})

//
// -----------------
// METHODS
// -----------------
//

const startActionFlow = (action: 'add' | 'buy') => {
  if (props.product.variants.length === 0) return

  if (props.product.variants.length > 1) {
    pendingActionContext.value = { action, variantId: '' }
    isVariantModalVisible.value = true
  } else {
    const variantId = props.product.variants[0].id
    pendingActionContext.value = { action, variantId }
    if (props.product.alert) {
      isAlertModalVisible.value = true
    } else {
      executePendingAction()
    }
  }
}

const executePendingAction = async () => {
  if (!pendingActionContext.value) return

  const { action, variantId } = pendingActionContext.value  
  pendingActionContext.value = null

  if (action === 'add') {
    isLocalAdding.value = true
    try {
      await addToCart(variantId)
    } finally {
      isLocalAdding.value = false
    }
  } else if (action === 'buy') {
    isLocalBuying.value = true
    try {
      const success = await buyNow(variantId)
      if (success) {
        await router.push('/shop/checkout')
      }
    } finally {
      isLocalBuying.value = false
    }
  }
}

const handleAddClick = () => {
  if (isAddButtonDisabled.value) return
  startActionFlow('add')
}

const handleBuyNowClick = () => {
  if (isBuyButtonDisabled.value) return
  startActionFlow('buy')
}

const handleVariantSelected = (selectedVariantId: string) => {
  if (!pendingActionContext.value) return
  pendingActionContext.value.variantId = selectedVariantId
  isVariantModalVisible.value = false

  if (props.product.alert) {
    isAlertModalVisible.value = true
  } else {
    executePendingAction()
  }
}

const handleAlertConfirm = () => {
  isAlertModalVisible.value = false
  executePendingAction()
}

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
            <div v-if="showAddSpinner" class="spinner-border spinner-border-sm" role="status">
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
            <div v-if="showBuySpinner" class="spinner-border spinner-border-sm" role="status">
              <span class="sr-only">Processing...</span>
            </div>
            <span v-else class="button-text">BUY</span>
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
