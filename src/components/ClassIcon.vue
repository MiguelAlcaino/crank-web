<script setup lang="ts">
defineProps<{ className: string }>()
</script>
<template>
  <i
    v-if="className.toUpperCase().includes('RIDE')"
    class="bi bi-bicycle"
    style="font-size: 1.5rem"
  ></i>
  <img
    v-if="className.toUpperCase().includes('SHAPE')"
    src="../assets/icons/shape_icon.png"
    alt=""
    height="18"
  />
  <img
    v-if="className.toUpperCase().includes('STRETCH')"
    src="../assets/icons/stretch_icon.png"
    alt=""
    height="18"
  />
</template>

<style></style>
