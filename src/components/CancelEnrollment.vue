<script lang="ts">
enum EnrollmentStatusEnum {
  Active = 'active',
  Cancelled = 'cancelled',
  LateCancelled = 'lateCancelled',
  Unknown = 'unknown',
  Waitlisted = 'waitlisted'
}
</script>

<script setup lang="ts">
import type { ApiService } from '@/services/apiService'
import { appStore } from '@/stores/appStorage'
import { computed, inject, ref } from 'vue'

import DefaultButtonComponent from '@/components/DefaultButtonComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import { ERROR_LATE_CANCELLATION_REQUIRED, ERROR_UNKNOWN } from '@/utils/errorMessages'
import dayjs from 'dayjs'

const apiService = inject<ApiService>('gqlApiService')!

const props = defineProps<{
  enrollmentId: string
  enrollmentStatus: EnrollmentStatusEnum
  siteDateTimeNow: Date
  start: Date
}>()

const emits = defineEmits<{
  (e: 'afterCancelling'): void
}>()

const isLoading = ref<boolean>(false)

const confirmEarlyCancelModalIsVisible = ref<boolean>(false)
const confirmLateCancelModalIsVisible = ref<boolean>(false)
const confirmRemoveFromWaitlistModalIsVisible = ref<boolean>(false)

const successModalIsVisible = ref<boolean>(false)
const successModalMessage = ref<string>('')

const errorModalIsVisible = ref<boolean>(false)
const errorModalMessage = ref<string>('')

const isLateCancel = computed<boolean>(() => {
  return dayjs(props.start).diff(dayjs(props.siteDateTimeNow), 'hour') < 12
})

function onClickOpenConfirmModal() {
  if (props.enrollmentStatus === EnrollmentStatusEnum.Waitlisted) {
    confirmRemoveFromWaitlistModalIsVisible.value = true
  } else if (props.enrollmentStatus === EnrollmentStatusEnum.Active) {
    if (isLateCancel.value) {
      confirmLateCancelModalIsVisible.value = true
      return
    }

    confirmEarlyCancelModalIsVisible.value = true
  }
}

async function cancelCurrentUserEnrollment(lateCancel: boolean): Promise<void> {
  isLoading.value = true

  const response = await apiService.cancelCurrentUserEnrollment(appStore().site, {
    enrollmentId: props.enrollmentId,
    lateCancel: lateCancel
  })

  isLoading.value = false

  confirmEarlyCancelModalIsVisible.value = false
  confirmLateCancelModalIsVisible.value = false

  switch (response) {
    case 'CancelUserEnrollmentSuccess': {
      successModalMessage.value = 'YOUR BOOKING HAS BEEN CANCELLED'
      successModalIsVisible.value = true
      break
    }
    case 'LateCancellationRequiredError': {
      confirmLateCancelModalIsVisible.value = true
      break
    }
    default: {
      errorModalMessage.value = ERROR_UNKNOWN
      errorModalIsVisible.value = true
      break
    }
  }
}

async function removeCurrentUserFromWaitlist(): Promise<void> {
  isLoading.value = true

  const response = await apiService.removeCurrentUserFromWaitlist(appStore().site, {
    waitlistEntryId: props.enrollmentId
  })

  isLoading.value = false

  confirmRemoveFromWaitlistModalIsVisible.value = false

  switch (response['__typename']) {
    case 'RemoveFromWaitlistResult': {
      successModalMessage.value = 'YOU HAVE BEEN REMOVED FROM THE WAITLIST'
      successModalIsVisible.value = true
      break
    }
    case 'WaitlistEntryNotFoundError': {
      errorModalMessage.value = ERROR_UNKNOWN
      errorModalIsVisible.value = true
      break
    }
    default: {
      errorModalMessage.value = ERROR_UNKNOWN
      errorModalIsVisible.value = true
      break
    }
  }
}

function acceptSuccessModal() {
  emits('afterCancelling')
  successModalIsVisible.value = false
}
</script>

<template>
  <DefaultButtonComponent
    :text="
      enrollmentStatus === EnrollmentStatusEnum.Waitlisted
        ? 'REMOVE FROM WAITLIST'
        : isLateCancel
        ? 'LATE CANCEL'
        : 'CANCEL'
    "
    type="button"
    @on-click="onClickOpenConfirmModal()"
    :block="true"
  ></DefaultButtonComponent>

  <!-- CONFIRM REMOVE FROM WAITLIST modal -->
  <ModalComponent
    title="Remove from waitlist"
    message="ARE YOU SURE YOU WANT TO BE REMOVED FROM THE WAITLIST?"
    cancel-text="CANCEL"
    ok-text="OK"
    :ok-loading="isLoading"
    :closable="false"
    v-if="confirmRemoveFromWaitlistModalIsVisible"
    @on-cancel="confirmRemoveFromWaitlistModalIsVisible = false"
    @on-ok="removeCurrentUserFromWaitlist()"
  ></ModalComponent>

  <!-- CONFIRM CANCEL BOOKING modal -->
  <ModalComponent
    title="CANCEL BOOKING"
    message="ARE YOU SURE YOU WANT TO PROCEED?"
    cancel-text="CANCEL"
    ok-text="OK"
    :ok-loading="isLoading"
    :closable="false"
    v-if="confirmEarlyCancelModalIsVisible"
    @on-cancel="confirmEarlyCancelModalIsVisible = false"
    @on-ok="cancelCurrentUserEnrollment(false)"
  ></ModalComponent>

  <!-- CONFIRM LATE CANCEL BOOKING modal -->
  <ModalComponent
    title="CANCEL BOOKING"
    :message="ERROR_LATE_CANCELLATION_REQUIRED"
    cancel-text="CANCEL"
    ok-text="CONFIRM"
    :ok-loading="isLoading"
    :closable="false"
    v-if="confirmLateCancelModalIsVisible"
    @on-cancel="confirmLateCancelModalIsVisible = false"
    @on-ok="cancelCurrentUserEnrollment(true)"
  ></ModalComponent>

  <!-- SUCCESS modal -->
  <ModalComponent
    title="SUCCESS"
    :message="successModalMessage"
    :closable="false"
    @on-ok="acceptSuccessModal()"
    :cancel-text="null"
    v-if="successModalIsVisible"
  >
  </ModalComponent>

  <!-- ERROR modal -->
  <ModalComponent
    :ok-loading="false"
    title="ERROR"
    :message="errorModalMessage"
    :closable="false"
    :cancel-text="null"
    v-if="errorModalIsVisible"
    @on-ok="errorModalIsVisible = false"
  >
  </ModalComponent>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
