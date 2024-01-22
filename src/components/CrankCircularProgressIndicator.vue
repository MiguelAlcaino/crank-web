<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<template>
  <div class="spinner-border crankSpiner" role="status">
    <span class="sr-only">Loading...</span>
  </div>
  &nbsp;
  <span>{{ text }}</span>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped>
.crankSpiner {
  color: #ff6f60;
}
</style>
