<script setup lang="ts">
import { ref } from 'vue'
import { useShoppingCart } from '../composables/useShoppingCart'

const { detailedCart, error, isApplyingGiftCard, applyGiftCard, removeGiftCard } = useShoppingCart()
const codeInput = ref('')

const handleApply = async () => {
  await applyGiftCard(codeInput.value)
  if (!error.value) codeInput.value = ''
}
</script>

<template>
  <div class="gift-card-section">
    <!-- List of Gift Cards already applied -->
    <div v-if="detailedCart?.giftCardsCodes.length" class="applied-list mb-3">
      <div v-for="code in detailedCart.giftCardsCodes" :key="code" class="applied-item">
        <span class="code-tag"
          >GIFT CARD: <strong>{{ code }}</strong></span
        >
        <button
          @click="removeGiftCard(code)"
          class="btn-remove-mini"
          :disabled="isApplyingGiftCard"
        >
          &times;
        </button>
      </div>
      <div class="gift-total" v-if="detailedCart.formattedGiftCardAmount">
        Total Gift Cards: -{{ detailedCart.formattedGiftCardAmount }}
      </div>
    </div>

    <!-- Input to add new -->
    <div class="apply-form">
      <input
        type="text"
        v-model="codeInput"
        placeholder="ENTER GIFT CARD"
        class="form-control"
        :disabled="isApplyingGiftCard"
        @keyup.enter="handleApply"
      />
      <button @click="handleApply" class="btn-apply" :disabled="isApplyingGiftCard || !codeInput">
        <span v-if="isApplyingGiftCard" class="spinner-border spinner-border-sm"></span>
        <span v-else>ADD</span>
      </button>
    </div>

    <small v-if="error" class="error-msg">{{ error }}</small>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped>
.applied-item {
  display: flex;
  justify-content: space-between;
  background: #222; /* To make it stand out against the black background */
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
  display: block;
  margin-top: 5px;
}
</style>
