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
      <button
        type="button"
        @click="handleRemove"
        class="btn-remove-custom"
        :disabled="isApplyingDiscount"
      >
        <span v-if="isApplyingDiscount" class="spinner-border spinner-border-sm"></span>
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
  padding: 10px 0;
  font-family: 'Avenir', sans-serif;
}

.applied-discount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 140, 105, 0.4);
  padding: 12px 15px;
  border-radius: 8px;
  margin-top: 5px;
}

.applied-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.applied-info .label {
  font-size: 0.65rem;
  letter-spacing: 1px;
  color: #adb5bd;
  font-weight: bold;
}

.applied-code {
  font-family: 'BigJohn', sans-serif;
  font-size: 1.1rem;
  color: #ff8c69;
  letter-spacing: 1px;
}

.btn-remove-link {
  background: none;
  border: 1px solid #ff8c69;
  color: #ff8c69;
  padding: 5px 12px;
  border-radius: 5px;
  font-size: 0.75rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-remove-link:hover {
  background-color: #ff8c69;
  color: white;
}

.apply-form {
  display: flex;
  gap: 10px;
}

.apply-form .form-control {
  background-color: #fff;
  border: none;
  border-radius: 5px;
  text-transform: uppercase;
  font-weight: bold;
}

.btn-apply {
  background-color: #ff8c69;
  color: white;
  border: none;
  padding: 0 20px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

.error-message {
  color: #ff8c69;
  font-size: 0.8rem;
  margin-top: 8px;
  display: block;
}

.applied-discount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 140, 105, 0.3);
  padding: 15px 20px;
  border-radius: 8px;
  margin-top: 10px;
}

.applied-info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.label {
  font-size: 0.7rem;
  color: #adb5bd;
  font-weight: bold;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.applied-code {
  font-family: 'BigJohn', sans-serif;
  font-size: 1.1rem;
  color: #ff8c69;
  letter-spacing: 1.5px;
}

.btn-remove-custom {
  appearance: none;
  -webkit-appearance: none;
  background: transparent !important;
  box-shadow: none !important;
  outline: none !important;

  border: 1.5px solid #ff8c69 !important;
  color: #ff8c69 !important;
  padding: 6px 15px !important;
  border-radius: 6px;
  font-family: 'Avenir', sans-serif;
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.btn-remove-custom:hover:not(:disabled) {
  background-color: #ff8c69 !important;
  color: white !important;
  transform: translateY(-1px);
}

.btn-remove-custom:disabled {
  border-color: #6c757d !important;
  color: #6c757d !important;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
