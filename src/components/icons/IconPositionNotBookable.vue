<script setup lang="ts">
defineProps<{
  iconName: string
}>()
</script>

<template>
  <div>
    <div v-if="iconName === 'instructor'">
      <i class="bi bi-person-fill" style="font-size: 1.8rem"></i>
    </div>
    <div v-else-if="iconName === 'speaker'">
      <i class="bi bi-speaker" style="font-size: 1.8rem"></i>
    </div>
    <div v-else-if="iconName === 'fan'">
      <i class="bi bi-fan" style="font-size: 1.8rem"></i>
    </div>
    <div v-else-if="iconName === 'tv'">
      <i class="bi bi-tv" style="font-size: 1.8rem"></i>
    </div>
  </div>
</template>

<style scoped></style>
