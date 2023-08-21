<template>
  <button
    type="button"
    class="btn btn-primary"
    :disabled="disabled"
    @click="emits('clickRemoveFromWaitlist', enrollmentId)"
  >
    REMOVE FROM WAITLIST
  </button>
</template>

<script setup lang="ts">
defineProps<{
  disabled: boolean
  enrollmentId: string
}>()

const emits = defineEmits<{
  (e: 'clickRemoveFromWaitlist', waitlistEntryId: string): void
}>()
</script>

<style scoped></style>
