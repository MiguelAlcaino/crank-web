<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

// Local Components
import TermsModal from './TermsModal.vue'
import VariantSelectorModal from './VariantSelectorModal.vue'
// Models, Composables & Services
import type { ProductModel } from '../models/ProductModel'
import { useShoppingCart } from '../composables/useShoppingCart'

//
// -----------------
// PROPS
// -----------------
//
const props = defineProps<{
  product: ProductModel
  isInCart: boolean
}>()

//
// -----------------
// DEPENDENCIES & COMPOSABLES
// -----------------
//
const router = useRouter()
const { buyNow, isProcessingBuyNow, addToCartLight } = useShoppingCart()

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
const primaryVariant = computed(() => props.product.variants[0] ?? null)
const cardPrice = computed(() => primaryVariant.value?.formattedPrice ?? '')

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
      await addToCartLight(variantId)
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
  <div class="product-card-shell">
    <div class="product-card">
      <div class="product-card__main">
        <div class="product-card__copy">
          <h3 class="product-card__title">{{ product.title }}</h3>
          <p v-if="cardPrice" class="product-card__price">{{ cardPrice }}</p>
          <p v-if="product.subtitle" class="product-card__meta">{{ product.subtitle }}</p>
          <p v-if="product.alert?.title" class="product-card__notice">
            {{ product.alert.title.toUpperCase() }}
          </p>
        </div>
      </div>

      <div class="product-card__actions">
        <button
          class="product-card__button product-card__button--add"
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
          class="product-card__button product-card__button--buy"
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
.button-text {
  font-family: 'BigJohn', sans-serif;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
}

.product-card-shell {
  margin-bottom: 18px;
}

.product-card {
  display: flex;
  min-height: 132px;
  background: #ffffff;
  border: 1px solid #ece8e3;
  box-shadow: 0 6px 18px rgba(17, 17, 17, 0.08);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(17, 17, 17, 0.12);
}

.product-card__main {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  padding: 20px 18px;
  min-width: 0;
  text-align: center;
}

.product-card__copy {
  min-width: 0;
}

.product-card__title {
  margin: 0 0 8px;
  color: #111111;
  font-family: 'BigJohn', sans-serif;
  font-size: 1rem;
  line-height: 1.22;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  overflow-wrap: anywhere;
}

.product-card__price {
  margin: 0 0 6px;
  color: #111111;
  font-family: 'BigJohn', sans-serif;
  font-size: 0.96rem;
  line-height: 1.15;
  text-transform: uppercase;
}

.product-card__meta {
  margin: 0;
  color: #595959;
  font-size: 0.82rem;
  line-height: 1.35;
}

.product-card__notice {
  margin: 8px 0 0;
  color: #a4a4a4;
  font-size: 0.66rem;
  line-height: 1.2;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.product-card__actions {
  display: flex;
  flex-direction: column;
  width: 96px;
  flex: 0 0 96px;
}

.product-card__button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex: 1 1 50%;
  padding: 0 10px;
  border: 0;
  color: #ffffff;
  transition: opacity 0.2s ease, filter 0.2s ease;
}

.product-card__button:hover:not(:disabled) {
  filter: brightness(0.96);
}

.product-card__button:disabled {
  background-color: #6c757d;
  opacity: 0.65;
  cursor: not-allowed;
}

.product-card__button--add {
  background: #111111;
}

.product-card__button--buy {
  background: #ff8a73;
}

@media (max-width: 767.98px) {
  .product-card__main {
    padding: 18px 14px;
  }

  .product-card__title {
    font-size: 0.92rem;
  }

  .product-card__meta {
    font-size: 0.8rem;
  }

  .button-text {
    font-size: 0.76rem;
  }

  .product-card__actions {
    width: 88px;
    flex-basis: 88px;
  }
}
</style>
