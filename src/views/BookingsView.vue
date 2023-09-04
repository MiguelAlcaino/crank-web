<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import {
  type CancelEnrollmentInput,
  type CurrentUserEnrollmentsParams,
  type Enrollment,
  EnrollmentTypeEnum,
  type RemoveCurrentUserFromWaitlistInput
} from '@/gql/graphql'
import dayjs from 'dayjs'

import BookingsTable from '@/components/BookingsTable.vue'
import DefaultButtonComponent from '@/components/DefaultButtonComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'

import type { ApiService } from '@/services/apiService'
import { appStore } from '@/stores/appStorage'
import { ERROR_LATE_CANCELLATION_REQUIRED, ERROR_UNKNOWN } from '@/utils/errorMessages'
import router from '@/router'

const isLoading = ref<boolean>(false)
const userErollments = ref<Enrollment[]>([])
const siteDateTimeNow = ref<Date>(new Date())
const isCancellingCurrentUserEnrollment = ref<boolean>(false)

const filterEnrollmentType = ref<EnrollmentTypeEnum>(EnrollmentTypeEnum.Upcoming)

const modalConfirmRemoveFromWaitlistisVisible = ref<boolean>(false)
const waitlistEntryIdToRemove = ref<string | null>(null)

const enrollmentIdToRemove = ref<string | null>(null)
const enrollmentIsLateCancel = ref<boolean>(false)

const dateRangeFilter = ref<[Date | null, Date | null] | undefined>()

const successModalData = ref<{
  title: string
  message: string
  isLoading: boolean
  isVisible: boolean
}>({
  title: '',
  message: '',
  isLoading: false,
  isVisible: false
})

const errorModalData = ref<{
  title: string
  message: string
  isLoading: boolean
  isVisible: boolean
}>({
  title: '',
  message: '',
  isLoading: false,
  isVisible: false
})

const confirmModalData = ref<{
  title: string
  message: string
  textConfirmButton: string
  isLoading: boolean
  isVisible: boolean
}>({
  title: '',
  message: '',
  textConfirmButton: '',
  isLoading: false,
  isVisible: false
})

const apiService = inject<ApiService>('gqlApiService')!

onMounted(() => {
  getSiteDateTimeNow()
  getUserErollments()
})

async function getSiteDateTimeNow() {
  siteDateTimeNow.value = new Date()

  const siteSetting = await apiService.getSiteSettings(appStore().site)

  if (siteSetting) siteDateTimeNow.value = new Date(siteSetting.siteDateTimeNow)
}

async function getUserErollments() {
  userErollments.value = []

  isLoading.value = true

  const params = { enrollmentType: filterEnrollmentType.value } as CurrentUserEnrollmentsParams

  if (dateRangeFilter.value) {
    if (dateRangeFilter.value[0])
      params.startDate = dayjs(dateRangeFilter.value[0]).format('YYYY-MM-DD')

    if (dateRangeFilter.value[1])
      params.endDate = dayjs(dateRangeFilter.value[1]).format('YYYY-MM-DD')
  }

  userErollments.value = await apiService.getCurrentUserEnrollments(appStore().site, params)

  isLoading.value = false
}

async function cancelCurrentUserEnrollment(
  enrollmentId: string,
  lateCancel: boolean
): Promise<void> {
  isCancellingCurrentUserEnrollment.value = true

  const input = { enrollmentId: enrollmentId, lateCancel: lateCancel } as CancelEnrollmentInput

  const response = await apiService.cancelCurrentUserEnrollment(appStore().site, input)

  isCancellingCurrentUserEnrollment.value = false

  confirmModalData.value.isVisible = false

  switch (response) {
    case 'CancelUserEnrollmentSuccess': {
      successModalData.value.title = 'SUCCESS'
      successModalData.value.message = 'YOUR BOOKING HAS BEEN CANCELLED'
      successModalData.value.isVisible = true
      break
    }
    case 'LateCancellationRequiredError': {
      enrollmentIdToRemove.value = enrollmentId
      enrollmentIsLateCancel.value = true

      confirmModalData.value.title = 'CANCEL BOOKING'
      confirmModalData.value.message = ERROR_LATE_CANCELLATION_REQUIRED
      confirmModalData.value.textConfirmButton = 'CONFIRM'
      confirmModalData.value.isVisible = true
      break
    }
    default: {
      errorModalData.value.message = ERROR_UNKNOWN
      errorModalData.value.isVisible = true
      break
    }
  }
}

async function removeCurrentUserFromWaitlist(waitlistEntryId: string): Promise<void> {
  const input = { waitlistEntryId: waitlistEntryId } as RemoveCurrentUserFromWaitlistInput

  isCancellingCurrentUserEnrollment.value = true

  const response = await apiService.removeCurrentUserFromWaitlist(appStore().site, input)

  isCancellingCurrentUserEnrollment.value = false

  modalConfirmRemoveFromWaitlistisVisible.value = false

  switch (response['__typename']) {
    case 'RemoveFromWaitlistResult': {
      successModalData.value.title = 'SUCCESS'
      successModalData.value.message = 'HAS BEEN SUCCESSFULLY REMOVED FROM WAITLIST'
      successModalData.value.isVisible = true
      break
    }
    case 'WaitlistEntryNotFoundError': {
      errorModalData.value.message = ERROR_UNKNOWN
      errorModalData.value.isVisible = true
      break
    }
    default: {
      errorModalData.value.message = ERROR_UNKNOWN
      errorModalData.value.isVisible = true
      break
    }
  }
}

function clickRemoveFromWaitlist(waitlistEntryId: string): void {
  waitlistEntryIdToRemove.value = waitlistEntryId
  modalConfirmRemoveFromWaitlistisVisible.value = true
}

function clickCancelEnrollment(enrollmentId: string, lateCancel: boolean): void {
  enrollmentIdToRemove.value = enrollmentId
  enrollmentIsLateCancel.value = lateCancel

  confirmModalData.value.title = 'CANCEL BOOKING'
  confirmModalData.value.message = 'ARE YOU SURE YOU WANT TO CANCEL YOUR BOOKING?'
  confirmModalData.value.textConfirmButton = 'OK'

  if (lateCancel) {
    confirmModalData.value.message += ' YOU WILL STILL BE CHARGED A CREDIT FOR THIS CLASS'
  }

  confirmModalData.value.isLoading = false
  confirmModalData.value.isVisible = true
}

async function acceptSuccessModal() {
  await getUserErollments()
  successModalData.value.isVisible = false
}

function goToChangeSpot(classId: string) {
  router.push('/change-spot/' + classId)
}
</script>

<template>
  <div class="card border-0">
    <div class="card-header border-0" style="background-color: white">
      <div class="row form-inline">
        <div class="col-md-6">
          <h1 class="page-title">Bookings</h1>
        </div>
        <div class="col-md-5 col-sm-6 text-right justify-content-end">
          <VueDatePicker
            v-model="dateRangeFilter"
            range
            :enable-time-picker="false"
            placeholder="Date Range"
          />
        </div>
        <div class="col-1">
          <DefaultButtonComponent
            @on-click="getUserErollments()"
            :is-loading="isLoading"
            text="Go"
            type="button"
            class="input-group-append"
          ></DefaultButtonComponent>
        </div>
      </div>
    </div>
    <div class="card-body">
      <select
        class="custom-select"
        v-model="filterEnrollmentType"
        @change="getUserErollments()"
        :disabled="isLoading"
      >
        <option :value="EnrollmentTypeEnum.Upcoming">UPCOMING</option>
        <option :value="EnrollmentTypeEnum.Waitlist">WAITLIST</option>
        <option :value="EnrollmentTypeEnum.Historical">HISTORICAL</option>
      </select>
      <br />
      <br />

      <BookingsTable
        :enrollments="userErollments"
        :isLoading="isLoading"
        :enrollmentType="filterEnrollmentType"
        :siteDateTimeNow="siteDateTimeNow"
        @clickCancelEnrollment="clickCancelEnrollment"
        @clickRemoveFromWaitlist="clickRemoveFromWaitlist"
        @change-spot="goToChangeSpot"
      >
      </BookingsTable>
    </div>
  </div>

  <!-- CONFIRM REMOVE FROM WAITLIST modal -->
  <ModalComponent
    title="Remove from waitlist"
    message="Are you sure you want to be removed from the waitlist?"
    cancel-text="CANCEL"
    ok-text="OK"
    :ok-loading="isCancellingCurrentUserEnrollment"
    :closable="true"
    v-if="modalConfirmRemoveFromWaitlistisVisible"
    @on-cancel="modalConfirmRemoveFromWaitlistisVisible = false"
    @on-ok="removeCurrentUserFromWaitlist(waitlistEntryIdToRemove!)"
  ></ModalComponent>

  <!-- CONFIRM CANCEL BOOKING modal -->
  <ModalComponent
    :title="confirmModalData.title"
    :message="confirmModalData.message"
    cancel-text="CANCEL"
    :ok-text="confirmModalData.textConfirmButton"
    :ok-loading="isCancellingCurrentUserEnrollment"
    :closable="true"
    v-if="confirmModalData.isVisible"
    @on-cancel="confirmModalData.isVisible = false"
    @on-ok="cancelCurrentUserEnrollment(enrollmentIdToRemove!, enrollmentIsLateCancel)"
  ></ModalComponent>

  <!-- SUCCESS modal -->
  <ModalComponent
    :title="successModalData.title"
    :message="successModalData.message"
    :closable="false"
    @on-ok="acceptSuccessModal"
    :cancel-text="null"
    v-if="successModalData.isVisible"
  >
  </ModalComponent>

  <!-- ERROR modal -->
  <ModalComponent
    :ok-loading="false"
    title="Error"
    :message="errorModalData.message"
    :closable="false"
    :cancel-text="null"
    v-if="errorModalData.isVisible"
    @on-ok="errorModalData.isVisible = false"
  >
  </ModalComponent>
</template>

<style scoped></style>
