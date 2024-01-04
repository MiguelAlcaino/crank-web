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

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
