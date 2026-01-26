<script setup lang="ts">
import { ref } from 'vue'
import { useShoppingCart } from '../composables/useShoppingCart'

const {
  detailedCart,
  giftCardError,
  isApplyingGiftCard,
  applyGiftCard,
  removeGiftCard,
  isCodeUpdating,
  isAnyGiftCardUpdating
} = useShoppingCart()
const codeInput = ref('')

const handleApply = async () => {
  await applyGiftCard(codeInput.value)
  if (!giftCardError.value) codeInput.value = ''
}
</script>

<template>
  <div class="gift-card-section">
    <!-- List of Gift Cards already applied -->
    <div v-if="detailedCart?.giftCardsCodes.length" class="applied-list mb-3">
      <div v-for="code in detailedCart.giftCardsCodes" :key="code" class="applied-item-card">
        <div class="applied-info">
          <span class="label">GIFT CARD APPLIED:</span>
          <strong class="applied-code">{{ code }}</strong>
        </div>

        <button
          type="button"
          @click="removeGiftCard(code)"
          class="btn-remove-custom"
          :disabled="isAnyGiftCardUpdating || isApplyingGiftCard"
        >
          <span v-if="isCodeUpdating(code).value" class="spinner-border spinner-border-sm"></span>
          <span v-else>REMOVE</span>
        </button>
      </div>

      <div class="gift-total-row" v-if="detailedCart.formattedGiftCardAmount">
        <span>GIFT CARDS TOTAL:</span>
        <span class="total-amount">{{ detailedCart.formattedGiftCardAmount }}</span>
      </div>
    </div>

    <!-- Input to add new -->
    <div class="apply-form">
      <input
        type="text"
        v-model="codeInput"
        placeholder="ENTER GIFT CARD"
        class="form-control"
        :disabled="isApplyingGiftCard || isAnyGiftCardUpdating"
        @keyup.enter="handleApply"
      />
      <button
        @click="handleApply"
        class="btn-apply"
        :disabled="isApplyingGiftCard || isAnyGiftCardUpdating || !codeInput"
      >
        <span v-if="isApplyingGiftCard" class="spinner-border spinner-border-sm"></span>
        <span v-else>ADD</span>
      </button>
    </div>

    <small v-if="giftCardError" class="error-msg">{{ giftCardError }}</small>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped>
.btn-remove-custom {
  appearance: none;
  -webkit-appearance: none;
  background: transparent !important;
  border: 1.5px solid #ff8c69 !important;
  color: #ff8c69 !important;
  padding: 6px 15px !important;
  border-radius: 6px;
  font-family: 'Avenir', sans-serif;
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  min-width: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove-custom:hover:not(:disabled) {
  background-color: #ff8c69 !important;
  color: white !important;
}

.btn-remove-custom:disabled {
  border-color: #6c757d !important;
  color: #6c757d !important;
  opacity: 0.5;
  cursor: not-allowed;
}

.applied-item-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 140, 105, 0.3);
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.applied-info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.label {
  font-size: 0.65rem;
  color: #adb5bd;
  font-weight: bold;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.applied-code {
  font-family: 'BigJohn', sans-serif;
  font-size: 1rem;
  color: #ff8c69;
  letter-spacing: 1px;
}

.btn-remove-custom-mini {
  appearance: none;
  background: transparent !important;
  border: 1.5px solid #ff8c69 !important;
  color: #ff8c69 !important;
  padding: 4px 10px !important;
  border-radius: 5px;
  font-size: 0.7rem;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-remove-custom-mini:hover {
  background-color: #ff8c69 !important;
  color: white !important;
}

.gift-total-row {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-top: 10px;
  color: #adb5bd;
}

.total-amount {
  color: #ff8c69;
}

.apply-form {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.gift-card-section {
  padding: 10px 0;
  font-family: 'Avenir', sans-serif;
}

.applied-item {
  display: flex;
  justify-content: space-between;
  background: #222;
  padding: 5px 10px;
  border-radius: 4px;
  margin-bottom: 5px;
  font-size: 0.8rem;
}
.code-tag {
  color: #fff;
}
.btn-remove-mini {
  background: none;
  border: none;
  color: #ff8c69;
  font-weight: bold;
  cursor: pointer;
}
.gift-total {
  font-size: 0.85rem;
  color: #ff8c69;
  text-align: right;
  font-weight: bold;
}
.apply-form {
  display: flex;
  gap: 10px;
}
.btn-apply {
  background-color: #ff8c69;
  border: none;
  color: white;
  padding: 0 15px;
  border-radius: 5px;
  font-weight: bold;
}
.error-msg {
  color: #ff8c69;
  font-size: 0.8rem;
  margin-top: 8px;
  display: block;
}
</style>
