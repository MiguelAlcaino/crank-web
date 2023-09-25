<script setup lang="ts">
import { inject, onMounted } from 'vue'

import DefaultButtonComponent from '@/components/DefaultButtonComponent.vue'
import type { ApiService } from '@/services/apiService'
import { appStore } from '@/stores/appStorage'

const apiService = inject<ApiService>('gqlApiService')!

onMounted(() => {
  // TODO: get layout list
})
</script>

<template>
  <h1>Room Layouts</h1>
</template>

<style scoped></style>
