<template>
  <button type="button" @click="clickCancelEnrollment"
          :disabled="disabled  || enrollmentStatus.toUpperCase() !== 'ACTIVE'">{{ buttonText }}
  </button>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import dayjs from "dayjs";

const props = defineProps<{
  siteDateTimeNow: Date,
  disabled: boolean,
  enrollmentId: string,
  startOfClass: Date,
  enrollmentStatus: string
}>();

const emits = defineEmits<{
  (e: 'clickCancelEnrollment', enrollmentId: string, isLateCancel?: boolean): void
}>();

const buttonText = ref<string>("");
const isLateCancel = ref<boolean>(false);


onMounted(() => {

  isLateCancel.value = dayjs(props.startOfClass).diff(dayjs(props.siteDateTimeNow), 'hour') < 12;

  if (isLateCancel.value) {
    buttonText.value = "LATE CANCEL";
  } else {
    buttonText.value = "EARLY CANCEL";
  }
});

function clickCancelEnrollment(): void {
  emits('clickCancelEnrollment', props.enrollmentId, isLateCancel.value);
}

</script>

<style scoped></style>