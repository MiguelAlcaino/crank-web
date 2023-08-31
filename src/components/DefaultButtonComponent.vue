<script setup lang="ts">
defineProps<{
  text: string
  isLoading: boolean
  disabled?: boolean
  type: 'button' | 'submit'
}>()

const emits = defineEmits<{
  (e: 'onClick'): void
}>()
</script>
<template>
  <button
    :type="type"
    class="btn btn-primary"
    @click="emits('onClick')"
    :disabled="disabled || isLoading"
  >
    {{ text }}
    <span class="spinner-border spinner-border-sm" v-if="isLoading"></span>
  </button>
</template>

<style></style>
