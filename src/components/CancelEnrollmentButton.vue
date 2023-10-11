<template>
  <button
    type="button"
    class="btn btn-primary"
    @click="clickCancelEnrollment"
    :disabled="disabled || enrollmentStatus.toUpperCase() !== 'ACTIVE'"
  >
    CANCEL
  </button>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'

const props = defineProps<{
  siteDateTimeNow: Date
  disabled: boolean
  enrollmentId: string
  startOfClass: Date
  enrollmentStatus: string
}>()

const emits = defineEmits<{
  (e: 'clickCancelEnrollment', enrollmentId: string, isLateCancel: boolean): void
}>()

const isLateCancel = ref<boolean>(false)

onMounted(() => {
  isLateCancel.value = dayjs(props.startOfClass).diff(dayjs(props.siteDateTimeNow), 'hour') < 12
})

function clickCancelEnrollment(): void {
  emits('clickCancelEnrollment', props.enrollmentId, isLateCancel.value)
}
</script>

<style scoped></style>
