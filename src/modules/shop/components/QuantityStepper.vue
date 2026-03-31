<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { debounce } from 'lodash'

const DEBOUNCE_DELAY_MS = 800

const props = withDefaults(
  defineProps<{
    modelValue: number
    min?: number
    max?: number
    step?: number
    loading?: boolean
    disabled?: boolean
  }>(),
  {
    min: 0,
    step: 1,
    loading: false,
    disabled: false
  }
)

const emits = defineEmits<{
  (e: 'updateItem', quantity: number): void
  (e: 'change', quantity: number): void
}>()

const localQuantity = ref(props.modelValue)
const isPending = ref(false)
const isServerSyncing = computed(() => props.loading)
const isInteractionDisabled = computed(() => props.disabled || props.loading)

const debouncedUpdate = debounce((newValue: number) => {
  emits('updateItem', newValue)
}, DEBOUNCE_DELAY_MS)

const decrease = () => {
  if (isInteractionDisabled.value) return

  if (localQuantity.value > props.min) {
    localQuantity.value -= props.step
    isPending.value = true
    emits('change', localQuantity.value)
    debouncedUpdate(localQuantity.value)
  }
}

const increase = () => {
  if (isInteractionDisabled.value) return

  if (props.max === undefined || localQuantity.value < props.max) {
    localQuantity.value += props.step
    isPending.value = true
    emits('change', localQuantity.value)
    debouncedUpdate(localQuantity.value)
  }
}

watch(
  () => props.modelValue,
  (newValue) => {
    localQuantity.value = newValue
    isPending.value = false
  }
)

watch(
  () => props.disabled,
  (isDisabled) => {
    if (!isDisabled && props.modelValue === localQuantity.value) {
      isPending.value = false
    }
  }
)
</script>

<template>
  <div class="quantity-stepper d-flex justify-content-around align-items-center">
    <button
      class="btn-stepper"
      @click="decrease"
      :disabled="isInteractionDisabled || localQuantity <= min"
    >
      -
    </button>
    <span
      class="font-weight-bold quantity-display"
      :class="{
        'quantity-display--loading': isPending || isServerSyncing,
        'quantity-display--pending': isPending && !isServerSyncing
      }"
    >
      <span v-if="isServerSyncing" class="quantity-spinner" aria-hidden="true"></span>
      <span v-else>{{ localQuantity }}</span>
    </span>
    <button
      class="btn-stepper"
      @click="increase"
      :disabled="isInteractionDisabled || (max !== undefined && localQuantity >= max)"
    >
      +
    </button>
  </div>
</template>

<style scoped>
.quantity-stepper {
  width: 100%;
}

.btn-stepper {
  background: none;
  border: none;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  color: #555;
  padding: 0.5rem;
  line-height: 1;
}

.btn-stepper:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.font-weight-bold {
  font-family: 'BigJohn', 'Arial Black', sans-serif;
  font-size: 1rem;
}

.quantity-display {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  min-width: 30px;
  text-align: center;
}

.quantity-display--loading {
  opacity: 0.85;
}

.quantity-display--pending {
  color: #ff8a73;
}

.quantity-spinner {
  width: 0.7rem;
  height: 0.7rem;
  border: 2px solid rgba(17, 17, 17, 0.18);
  border-top-color: #111111;
  border-radius: 50%;
  animation: quantity-spin 0.8s linear infinite;
}

@keyframes quantity-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
