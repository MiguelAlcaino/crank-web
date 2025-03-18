<script setup lang="ts">
import { ref } from 'vue'
import { debounce } from 'lodash'

interface Props {
  modelValue: number
  min?: number
  max?: number
  step?: number
}

const props = defineProps<Props>()

const emits = defineEmits<{
  (e: 'updateItem', quantity: number): void
}>()

const value = ref(props.modelValue)

const updateValue = debounce((newValue: number) => {
  emits('updateItem', newValue)
}, 300)

const decrease = () => {
  if (props.min !== undefined && value.value <= props.min) return
  value.value -= props.step ?? 1
  updateValue(value.value)
}

const increase = () => {
  if (props.max !== undefined && value.value >= props.max) return
  value.value += props.step ?? 1
  updateValue(value.value)
}

const validateNumber = (event: Event) => {
  const input = event.target as HTMLInputElement
  const sanitizedValue = input.value.replace(/[^0-9]/g, '')
  input.value = sanitizedValue
  let newValue = Number(sanitizedValue)
  if (props.min !== undefined && newValue < props.min) {
    newValue = props.min
  }
  if (props.max !== undefined && newValue > props.max) {
    newValue = props.max
  }
  value.value = newValue
  updateValue(value.value)
}
</script>

<template>
  <div class="input-group">
    <div class="input-group-prepend">
      <button class="btn btn-outline-secondary" type="button" @click="decrease">-</button>
    </div>
    <input type="text" class="form-control text-center" v-model="value" @input="validateNumber" />
    <div class="input-group-append">
      <button class="btn btn-outline-secondary" type="button" @click="increase">+</button>
    </div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
<style scoped>
input {
  max-width: 80px;
}
</style>
