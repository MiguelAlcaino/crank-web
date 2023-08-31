<script setup lang="ts">
defineProps<{
  activeRoute?: string | null | undefined
}>()

const emits = defineEmits<{
  (e: 'onClick'): void
}>()
</script>
<template>
  <div></div>
</template>

<style></style>
