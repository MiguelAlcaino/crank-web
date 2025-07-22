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

const { addToCart, isItemUpdating } = useShoppingCart(apiService)

//
// -----------------
// COMPUTED PROPERTIES
// -----------------
//
/**
 * A reactive flag that is true if THIS specific product is being added to the cart.
 * Note: We check against the first variant's ID, as that's what we add.
 */
const isAdding = computed(() => {
  if (props.product.variants.length === 0) return false
  return isItemUpdating(props.product.variants[0].id).value
})

/**
 * @description A single computed property to determine if the ADD button should be disabled.
 * This encapsulates all disabling logic in one place for clarity and type safety.
 */
const isAddButtonDisabled = computed(() => {
  // Combina todas las condiciones en una sola variable reactiva.
  // Aquí sí podemos mezclar booleanos y refs sin problemas.
  return props.product.variants.length === 0 || props.isInCart || isAdding.value
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
  if (isAdding.value || props.product.variants.length === 0) {
    return
  }

  if (props.product.variants.length === 1) {
    addToCart(props.product.variants[0].id)
  } else {
    console.log('Multiple variants detected. Modal/selector needed.')
  }
}

/**
 * Handles the click on the "BUY" button.
 * Redirects to an external URL for Gift Cards or adds to cart and navigates for other products.
 */
const handleBuyNow = () => {
  if (props.product instanceof GiftCardProduct) {
    // Abre la URL de compra en una nueva pestaña
    window.open(props.product.purchaseUrl, '_blank')
  } else {
    // Para otros productos, añade al carrito (si no está ya) y navega.
    if (!props.isInCart) {
      handleAddClick()
    }
    router.push('/shop/cart')
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
        >
          BUY
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
