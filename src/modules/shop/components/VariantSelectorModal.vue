<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ProductModel } from '../models/ProductModel'
import type { VariantBasicModel } from '../models/VariantBasicModel'

const props = defineProps<{
  modelValue: boolean // To control visibility (v-model)
  product: ProductModel | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', selectedVariantId: string): void
}>()

const selectedVariant = ref<VariantBasicModel | null>(null)

// When the modal opens, pre-select the first variant by default
watch(
  () => props.modelValue,
  (isShowing) => {
    if (isShowing && props.product && props.product.variants.length > 0) {
      selectedVariant.value = props.product.variants[0]
    } else {
      selectedVariant.value = null
    }
  }
)

const handleConfirm = () => {
  if (selectedVariant.value) {
    emit('confirm', selectedVariant.value.id)
    closeModal()
  }
}

const closeModal = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="modelValue && product" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h4 class="modal-title">Select an Option</h4>
        <p class="modal-subtitle">{{ product.title }}</p>

        <div class="variants-list">
          <div
            v-for="variant in product.variants"
            :key="variant.id"
            class="variant-item"
            :class="{ selected: selectedVariant?.id === variant.id }"
            @click="selectedVariant = variant"
          >
            <div class="variant-name">{{ variant.name || 'Standard Option' }}</div>
            <div class="variant-price">{{ variant.formattedPrice }}</div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="btn-cancel">Cancel</button>
          <button @click="handleConfirm" class="btn-confirm" :disabled="!selectedVariant">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Basic styling for the modal - reuse or adapt as needed */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
}
.modal-title {
  font-family: 'BigJohn', sans-serif;
  font-size: 1.5rem;
}
.modal-subtitle {
  color: #555;
  margin-bottom: 1.5rem;
}
.variants-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.variant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.variant-item:hover {
  border-color: #ff8c69;
}
.variant-item.selected {
  border-color: #ff8c69;
  background-color: #fff8f5;
}
.variant-name {
  font-weight: bold;
}
.variant-price {
  font-weight: bold;
  color: #333;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}
.btn-confirm {
  background-color: #ff8c69;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
.btn-confirm:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.btn-cancel {
  background-color: #eee;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
