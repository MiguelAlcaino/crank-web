<script lang="ts">
enum EnrollmentStatusEnum {
  Active = 'active',
  Cancelled = 'cancelled',
  LateCancelled = 'lateCancelled',
  Unknown = 'unknown',
  Waitlisted = 'waitlisted'
}

interface EnrollmentInfo {
  enrollmentStatus: EnrollmentStatusEnum
  spotNumber?: number | null
}
</script>

<script setup lang="ts">
defineProps<{
  enrollmentInfo: EnrollmentInfo
}>()
</script>

<template>
  <div v-if="enrollmentInfo.enrollmentStatus === EnrollmentStatusEnum.Active">
    <p v-if="enrollmentInfo.spotNumber === null || enrollmentInfo.spotNumber === undefined">
      <b>YOU ARE ALREADY BOOKED IN THIS CLASS</b>
    </p>
    <p v-else>
      <b>YOU ARE BOOKED IN SPOT {{ enrollmentInfo.spotNumber }}</b>
    </p>
  </div>
  <div v-else-if="enrollmentInfo.enrollmentStatus === EnrollmentStatusEnum.Waitlisted">
    <p><b>YOU ARE CURRENTLY ON THE WAITLIST</b></p>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped>
p {
  font-family: 'BigJohn', sans-serif;
}
</style>
