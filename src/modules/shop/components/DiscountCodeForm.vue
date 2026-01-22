<script setup lang="ts">
//
// -----------------
// IMPORTS
// -----------------
//

// Libs & Frameworks
import { ref } from 'vue'

// Composables, Services & Utilities
import { useShoppingCart } from '../composables/useShoppingCart'

//
// -----------------
// DEPENDENCIES & COMPOSABLES
// -----------------
//
const {
  detailedCart,
  error: discountError,
  isApplyingDiscount,
  applyDiscountCode,
  removeDiscountCode
} = useShoppingCart()

//
// -----------------
// COMPONENT STATE
// -----------------
//
/**
 * @description Local state for the discount code input field.
 */
const codeInput = ref('')

//
// -----------------
// METHODS
// -----------------
//
/**
 * @description Handles the submission of the discount code form.
 */
const handleApply = () => {
  if (!codeInput.value.trim()) return
  applyDiscountCode(codeInput.value.trim())
}

/**
 * @description Handles the removal of the discount code.
 */
const handleRemove = () => {
  removeDiscountCode()
}
</script>

<template>
  <div class="discount-section">
    <div v-if="detailedCart && detailedCart.discountCode" class="applied-discount">
      <div class="applied-info">
        <span>DISCOUNT CODE APPLIED:</span>
        <strong class="applied-code">{{ detailedCart.discountCode }}</strong>
      </div>
      <button @click="handleRemove" class="btn-remove" :disabled="isApplyingDiscount">
        <span
          v-if="isApplyingDiscount"
          class="spinner-border spinner-border-sm"
          role="status"
        ></span>
        <span v-else>REMOVE</span>
      </button>
    </div>

    <div v-else class="apply-form">
      <input
        type="text"
        v-model="codeInput"
        placeholder="DISCOUNT CODE"
        class="form-control"
        :disabled="isApplyingDiscount"
        @keyup.enter="handleApply"
      />
      <button @click="handleApply" class="btn-apply" :disabled="isApplyingDiscount">
        <span
          v-if="isApplyingDiscount"
          class="spinner-border spinner-border-sm"
          role="status"
        ></span>
        <span v-else>Apply</span>
      </button>
    </div>

    <small v-if="discountError" class="error-message mt-2">{{ discountError }}</small>
  </div>
</template>
<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped>
.discount-section {
  padding: 1rem 0;
  font-family: 'Avenir', sans-serif;
}

.apply-form {
  display: flex;
  gap: 0.5rem;
}

.apply-form .form-control {
  border: 1px solid #ccc;
  border-radius: 5px;
  text-transform: uppercase;
}

.btn-apply,
.btn-remove {
  border: none;
  background-color: #222;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: bold;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.btn-apply:hover,
.btn-remove:hover {
  background-color: #555;
}

.btn-apply:disabled,
.btn-remove:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.applied-discount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f0fff0;
  border: 1px solid #a3d9a5;
  padding: 0.5rem 1rem;
  border-radius: 5px;
}

.applied-info {
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;
}

.applied-code {
  font-weight: bold;
  font-size: 1rem;
  color: #2a7f2e;
}

.error-message {
  color: #d9534f;
  display: block;
}
</style>
