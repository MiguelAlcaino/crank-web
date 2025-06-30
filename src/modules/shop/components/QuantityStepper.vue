<script setup lang="ts">
import { ref, watch } from 'vue'
import { debounce } from 'lodash'

const props = withDefaults(
  defineProps<{
    modelValue: number
    min?: number
    max?: number
    step?: number
    disabled?: boolean
  }>(),
  {
    min: 0,
    step: 1,
    disabled: false
  }
)

const emits = defineEmits<{
  (e: 'updateItem', quantity: number): void
}>()

const localQuantity = ref(props.modelValue)

const debouncedUpdate = debounce((newValue: number) => {
  emits('updateItem', newValue)
}, 500)

const decrease = () => {
  if (localQuantity.value > props.min) {
    localQuantity.value -= props.step
    debouncedUpdate(localQuantity.value)
  }
}

const increase = () => {
  if (props.max === undefined || localQuantity.value < props.max) {
    localQuantity.value += props.step
    debouncedUpdate(localQuantity.value)
  }
}

watch(
  () => props.modelValue,
  (newValue) => {
    localQuantity.value = newValue
  }
)
</script>

<template>
  <div class="quantity-stepper d-flex justify-content-around align-items-center">
    <button class="btn-stepper" @click="decrease" :disabled="disabled || localQuantity <= min">
      -
    </button>
    <span class="font-weight-bold quantity-display">{{ localQuantity }}</span>
    <button
      class="btn-stepper"
      @click="increase"
      :disabled="disabled || (max !== undefined && localQuantity >= max)"
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
  min-width: 30px;
  text-align: center;
}
</style>
