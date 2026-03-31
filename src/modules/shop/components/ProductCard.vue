<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { debounce } from 'lodash'

// Local Components
import TermsModal from './TermsModal.vue'
import QuantityStepper from './QuantityStepper.vue'
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
const {
  buyNow,
  isProcessingBuyNow,
  addToCartLight,
  cartItems,
  isCartMutating,
  isItemUpdating,
  updateItemQuantity,
  removeFromCart,
  activeDraftVariantId,
  setActiveDraftVariant,
  clearActiveDraftVariant
} = useShoppingCart()

const DRAFT_SYNC_DELAY_MS = 800

//
// -----------------
// LOCAL STATE
// -----------------
//

const isLocalAdding = ref(false)
const isLocalBuying = ref(false)
const localDraftQuantity = ref<number | null>(null)
const isLocalDraftSyncing = ref(false)

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
const primaryVariantId = computed(() => primaryVariant.value?.id ?? null)
const cardPrice = computed(() => primaryVariant.value?.formattedPrice ?? '')
const usesInlineDraftStepper = computed(() => props.product.variants.length === 1)
const cartEntry = computed(() => {
  if (!primaryVariantId.value) return null
  return cartItems.value.find((item) => item.variant.id === primaryVariantId.value) ?? null
})
const selectedQuantity = computed(() => cartEntry.value?.quantity ?? 0)
const displayedQuantity = computed(() => localDraftQuantity.value ?? selectedQuantity.value)
const isQuantityUpdating = computed(() => {
  if (isLocalDraftSyncing.value) return true
  if (!cartEntry.value) return false
  return isItemUpdating(cartEntry.value.id).value
})
const isCurrentDraftCard = computed(() => {
  return primaryVariantId.value !== null && activeDraftVariantId.value === primaryVariantId.value
})
const isAnotherDraftActive = computed(() => {
  return activeDraftVariantId.value !== null && !isCurrentDraftCard.value
})
const showQuantityStepper = computed(() => {
  return (
    usesInlineDraftStepper.value &&
    (displayedQuantity.value > 0 ||
      localDraftQuantity.value !== null ||
      isLocalDraftSyncing.value ||
      isQuantityUpdating.value)
  )
})

const isAddButtonDisabled = computed(() => {
  return (
    showQuantityStepper.value ||
    activeDraftVariantId.value !== null ||
    isCartMutating.value ||
    isLocalAdding.value ||
    isLocalBuying.value ||
    isProcessingBuyNow.value
  )
})
const isBuyButtonDisabled = computed(() => {
  return (
    activeDraftVariantId.value !== null ||
    isCartMutating.value ||
    isLocalAdding.value ||
    isLocalBuying.value ||
    isProcessingBuyNow.value
  )
})

const syncDraftQuantityWithServer = async (newQuantity: number) => {
  if (!usesInlineDraftStepper.value || !primaryVariantId.value) return

  const serverQuantity = selectedQuantity.value
  if (newQuantity === serverQuantity) return

  isLocalDraftSyncing.value = true

  try {
    if (newQuantity <= 0) {
      if (cartEntry.value) {
        await removeFromCart(cartEntry.value.id)
      }
      return
    }

    if (cartEntry.value) {
      await updateItemQuantity({ itemId: cartEntry.value.id, newQuantity })
    } else {
      await addToCartLight(primaryVariantId.value, newQuantity)
    }
  } finally {
    isLocalDraftSyncing.value = false
  }
}

const debouncedSyncDraftQuantity = debounce((newQuantity: number) => {
  void syncDraftQuantityWithServer(newQuantity)
}, DRAFT_SYNC_DELAY_MS)

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
    if (usesInlineDraftStepper.value) {
      queueDraftQuantityChange(Math.max(displayedQuantity.value, 0) + 1)
      return
    }

    isLocalAdding.value = true
    try {
      await addToCartLight(variantId)
    } finally {
      isLocalAdding.value = false
    }
  } else if (action === 'buy') {
    isLocalBuying.value = true
    try {
      debouncedSyncDraftQuantity.cancel()

      const buyQuantity =
        usesInlineDraftStepper.value && primaryVariantId.value === variantId
          ? Math.max(displayedQuantity.value, 1)
          : 1

      const success = await buyNow(variantId, buyQuantity)
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

const queueDraftQuantityChange = (newQuantity: number) => {
  if (primaryVariantId.value) {
    setActiveDraftVariant(primaryVariantId.value)
  }
  localDraftQuantity.value = newQuantity
  debouncedSyncDraftQuantity(newQuantity)
}

const handleQuantityChange = (newQuantity: number) => {
  queueDraftQuantityChange(newQuantity)
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

watch([selectedQuantity, isLocalDraftSyncing], ([newQuantity, syncing]) => {
  if (localDraftQuantity.value === null || syncing) return

  if (newQuantity === localDraftQuantity.value) {
    localDraftQuantity.value = null
    clearActiveDraftVariant(primaryVariantId.value)
  }
})

onBeforeUnmount(() => {
  debouncedSyncDraftQuantity.cancel()
  clearActiveDraftVariant(primaryVariantId.value)
})
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
        <div
          v-if="showQuantityStepper"
          class="product-card__quantity-panel"
          :class="{ 'product-card__quantity-panel--loading': isQuantityUpdating }"
        >
          <QuantityStepper
            :model-value="displayedQuantity"
            :min="0"
            :loading="isQuantityUpdating"
            :disabled="
              isAnotherDraftActive || isCartMutating || isLocalBuying || isProcessingBuyNow
            "
            @change="handleQuantityChange"
          />
        </div>
        <button
          v-else
          class="product-card__button product-card__button--add"
          @click="handleAddClick"
          :disabled="isAddButtonDisabled"
        >
          <div v-if="showAddSpinner" class="spinner-border spinner-border-sm" role="status">
            <span class="sr-only">Adding...</span>
          </div>
          <span v-else class="button-text">ADD</span>
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
  opacity: 0.65;
  cursor: not-allowed;
}

.product-card__button--add {
  background: #111111;
}

.product-card__button--buy {
  background: #ff8a73;
}

.product-card__button--add:disabled {
  background: #111111;
}

.product-card__button--buy:disabled {
  background: #ff8a73;
}

.product-card__quantity-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 50%;
  padding: 0 8px;
  background: #f8f4ef;
  border-bottom: 1px solid #ece8e3;
}

.product-card__quantity-panel--loading {
  opacity: 0.72;
}

.product-card__quantity-panel :deep(.quantity-stepper) {
  height: 100%;
  gap: 4px;
}

.product-card__quantity-panel :deep(.btn-stepper) {
  min-width: 24px;
  padding: 0.35rem 0.2rem;
  color: #111111;
  font-family: 'BigJohn', sans-serif;
  font-size: 1.05rem;
}

.product-card__quantity-panel :deep(.quantity-display) {
  min-width: 18px;
  color: #111111;
  font-family: 'BigJohn', sans-serif;
  font-size: 0.9rem;
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

  .product-card__quantity-panel {
    padding-inline: 4px;
  }

  .product-card__quantity-panel :deep(.btn-stepper) {
    min-width: 20px;
    font-size: 0.95rem;
  }

  .product-card__quantity-panel :deep(.quantity-display) {
    font-size: 0.82rem;
  }
}
</style>
