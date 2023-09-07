<script setup lang="ts">
interface Props {
  text: string
  isLoading?: boolean
  disabled?: boolean
  type: 'button' | 'submit'
  block?: boolean
}
withDefaults(defineProps<Props>(), {
  isLoading: false,
  disabled: false,
  type: 'button',
  block: false
})

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
    :class="{ 'btn-block': block }"
  >
    {{ text }}
    <span class="spinner-border spinner-border-sm" v-if="isLoading"></span>
  </button>
</template>

<style></style>
