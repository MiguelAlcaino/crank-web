<script lang="ts">
enum EnrollmentStatusEnum {
  Active = 'active',
  Cancelled = 'cancelled',
  LateCancelled = 'lateCancelled',
  Unknown = 'unknown',
  Waitlisted = 'waitlisted'
}

interface SpotInfo {
  spotNumber: number
}

interface EnrollmentInfo {
  enrollmentStatus: EnrollmentStatusEnum
  spotInfo?: SpotInfo | null
}
</script>

<script setup lang="ts">
defineProps<{
  enrollmentInfo: EnrollmentInfo
}>()
</script>

<template>
  <div v-if="enrollmentInfo.enrollmentStatus === EnrollmentStatusEnum.Active">
    <b v-if="enrollmentInfo.spotInfo === null">You are enrolled in this class already</b>
    <b v-else
      >You are enrolled in this class already in the spot
      {{ enrollmentInfo.spotInfo!.spotNumber }}</b
    >
  </div>
  <div v-else-if="enrollmentInfo.enrollmentStatus === EnrollmentStatusEnum.Waitlisted">
    <b>You are already on the waiting list</b>
  </div>
</template>

<style scoped></style>
