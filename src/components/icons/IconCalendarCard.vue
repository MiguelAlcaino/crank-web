<script setup lang="ts">
defineProps<{ letter: string }>()
</script>

<template>
  <span class="i-circle">{{ letter }}</span>
</template>

<style scoped>
.i-circle {
  margin-right: 5px;
  border-radius: 50px;
  background: gray;
  display: inline-block !important;
  padding-top: 1px;
  width: 20px;
  height: 20px;
  font-size: 12px;
  text-align: center;
  color: white !important;
}
</style>
