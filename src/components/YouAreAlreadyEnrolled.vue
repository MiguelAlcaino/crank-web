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
    <p v-if="enrollmentInfo.spotInfo === null"><b>You are enrolled in this class already</b></p>
    <p v-else>
      <b>YOU ARE BOOKED IN SPOT {{ enrollmentInfo.spotInfo!.spotNumber }}</b>
    </p>
  </div>
  <div v-else-if="enrollmentInfo.enrollmentStatus === EnrollmentStatusEnum.Waitlisted">
    <p><b>You are already on the waiting list</b></p>
  </div>
</template>

<style scoped>
p {
  font-family: 'BigJohn', sans-serif;
}
</style>
