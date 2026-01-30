<script setup lang="ts">
import { onMounted } from 'vue'
import { useCreditLeft } from '@/modules/shop/composables/useCreditsLeft'

const { creditsLeftText, isLoading, error, fetchCredits } = useCreditLeft()

onMounted(async () => {
  await fetchCredits()
})
</script>

<template>
  <div class="credit-left">
    <div v-if="isLoading">
      <p>LOADING CREDITS...</p>
    </div>
    <div v-else-if="error">
      <p>0 CREDITS LEFT</p>
    </div>
    <div v-else>
      <p>{{ creditsLeftText }}</p>
    </div>
  </div>
</template>

<style scoped>
.credit-left {
  color: #8a8a8a;
  font-size: 1.1rem;
  font-family: 'Avenir', sans-serif;
}
</style>
