<script setup lang="ts">
import { PositionIconEnum } from '@/modules/shared/interfaces/position-icon.enum'

defineProps<{
  icon: PositionIconEnum
}>()
</script>

<template>
  <div>
    <div v-if="icon === PositionIconEnum.Instructor">
      <i class="bi bi-person-fill" style="font-size: 1.8rem"></i>
    </div>
    <div v-else-if="icon === PositionIconEnum.Speaker">
      <i class="bi bi-speaker" style="font-size: 1.8rem"></i>
    </div>
    <div v-else-if="icon === PositionIconEnum.Fan">
      <i class="bi bi-fan" style="font-size: 1.8rem"></i>
    </div>
    <div v-else-if="icon === PositionIconEnum.Tv">
      <i class="bi bi-tv" style="font-size: 1.8rem"></i>
    </div>
  </div>
</template>

<style scoped></style>
