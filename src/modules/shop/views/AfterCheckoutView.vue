<script setup lang="ts">
import { inject } from 'vue'
import type { ApiService } from '@/services/apiService'
import { useAfterCheckout } from '@/modules/shop/composables/useAfterCheckout'

const apiService = inject<ApiService>('gqlApiService')!
const { isLoading } = useAfterCheckout(apiService)
</script>

<template>
  <div>
    <p v-if="purchaseStatus">{{ purchaseStatus }}</p>
    <p v-else>Checking the status of the purchase...</p>
  </div>
</template>

<style scoped></style>
