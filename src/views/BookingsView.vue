<script lang="ts">
enum EnrollmentTypeEnum {
  All = 'all',
  Historical = 'historical',
  Upcoming = 'upcoming',
  Waitlist = 'waitlist'
}
</script>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import type {
  CancelEnrollmentInput,
  CurrentUserEnrollmentsParams,
  Enrollment,
  RemoveCurrentUserFromWaitlistInput
} from '@/gql/graphql'
import dayjs from 'dayjs'

import BookingsTable from '@/components/BookingsTable.vue'
import DefaultButtonComponent from '@/components/DefaultButtonComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'

import type { ApiService } from '@/services/apiService'
import { appStore } from '@/stores/appStorage'
import { ERROR_LATE_CANCELLATION_REQUIRED, ERROR_UNKNOWN } from '@/utils/errorMessages'
import router from '@/router'

const upcomingEnrollments = ref<Enrollment[]>([])
const waitlistEnrollments = ref<Enrollment[]>([])
const oldEnrollments = ref<Enrollment[]>([])
const siteDateTimeNow = ref<Date>(new Date())
const isCancellingCurrentUserEnrollment = ref<boolean>(false)

const modalConfirmRemoveFromWaitlistisVisible = ref<boolean>(false)
const waitlistEntryIdToRemove = ref<string | null>(null)

const enrollmentIdToRemove = ref<string | null>(null)
const enrollmentIsLateCancel = ref<boolean>(false)

const upcomingEnrollmentsIsLoading = ref<boolean>(false)
const waitlistEnrollmentsIsLoading = ref<boolean>(false)
const oldEnrollmentsIsLoading = ref<boolean>(false)
const isFiltered = ref<boolean>(false)

const dateRangeFilter = ref<[Date | null, Date | null] | undefined>()

const successModalData = ref<{
  message: string
  isLoading: boolean
  isVisible: boolean
}>({
  message: '',
  isLoading: false,
  isVisible: false
})

const errorModalData = ref<{
  message: string
  isVisible: boolean
}>({
  message: '',
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

const activeItem = ref<EnrollmentTypeEnum>(EnrollmentTypeEnum.Upcoming)

const apiService = inject<ApiService>('gqlApiService')!

onMounted(() => {
  getSiteDateTimeNow()
  getUserEnrollments(true)
})

async function getSiteDateTimeNow() {
  siteDateTimeNow.value = new Date()

  const siteSetting = await apiService.getSiteSettings(appStore().site)

  if (siteSetting) siteDateTimeNow.value = new Date(siteSetting.siteDateTimeNow)
}

async function getUserEnrollments(isOnMount: boolean = false) {
  getOldEnrollments()
  await getUpcomingEnrollments()
  await getWaitlistEnrollments()

  if (isOnMount && upcomingEnrollments.value.length === 0 && waitlistEnrollments.value.length > 0)
    setActive(EnrollmentTypeEnum.Waitlist)
}

async function getUpcomingEnrollments() {
  isFiltered.value = false
  try {
    upcomingEnrollments.value = []

    const params = { enrollmentType: EnrollmentTypeEnum.Upcoming } as CurrentUserEnrollmentsParams

    if (dateRangeFilter.value) {
      if (dateRangeFilter.value[0])
        params.startDate = dayjs(dateRangeFilter.value[0]).format('YYYY-MM-DD')

      if (dateRangeFilter.value[1])
        params.endDate = dayjs(dateRangeFilter.value[1]).format('YYYY-MM-DD')

      isFiltered.value = true
    }

    upcomingEnrollmentsIsLoading.value = true

    upcomingEnrollments.value = await apiService.getCurrentUserEnrollments(appStore().site, params)
  } catch (error) {
    errorModalData.value.message = ERROR_UNKNOWN
    errorModalData.value.isVisible = true
  } finally {
    upcomingEnrollmentsIsLoading.value = false
  }
}

async function getWaitlistEnrollments() {
  try {
    waitlistEnrollments.value = []

    const params = { enrollmentType: EnrollmentTypeEnum.Waitlist } as CurrentUserEnrollmentsParams

    if (dateRangeFilter.value) {
      if (dateRangeFilter.value[0])
        params.startDate = dayjs(dateRangeFilter.value[0]).format('YYYY-MM-DD')

      if (dateRangeFilter.value[1])
        params.endDate = dayjs(dateRangeFilter.value[1]).format('YYYY-MM-DD')
    }

    waitlistEnrollmentsIsLoading.value = true

    waitlistEnrollments.value = await apiService.getCurrentUserEnrollments(appStore().site, params)
  } catch (error) {
    errorModalData.value.message = ERROR_UNKNOWN
    errorModalData.value.isVisible = true
  } finally {
    waitlistEnrollmentsIsLoading.value = false
  }
}

async function getOldEnrollments() {
  try {
    oldEnrollments.value = []

    const params = { enrollmentType: EnrollmentTypeEnum.Historical } as CurrentUserEnrollmentsParams

    if (dateRangeFilter.value) {
      if (dateRangeFilter.value[0])
        params.startDate = dayjs(dateRangeFilter.value[0]).format('YYYY-MM-DD')

      if (dateRangeFilter.value[1])
        params.endDate = dayjs(dateRangeFilter.value[1]).format('YYYY-MM-DD')
    }

    oldEnrollmentsIsLoading.value = true

    oldEnrollments.value = await apiService.getCurrentUserEnrollments(appStore().site, params)
  } catch (error) {
    errorModalData.value.message = ERROR_UNKNOWN
    errorModalData.value.isVisible = true
  } finally {
    oldEnrollmentsIsLoading.value = false
  }
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
      successModalData.value.message = 'YOU HAVE BEEN REMOVED FROM THE WAITLIST'
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
  confirmModalData.value.message = 'ARE YOU SURE YOU WANT TO PROCEED?'
  confirmModalData.value.textConfirmButton = 'OK'

  confirmModalData.value.isLoading = false
  confirmModalData.value.isVisible = true
}

async function acceptSuccessModal() {
  await getUserEnrollments()
  successModalData.value.isVisible = false
}

function goToChangeSpot(classId: string) {
  router.push('/change-spot/' + classId)
}

function isActive(menuItem: EnrollmentTypeEnum) {
  return activeItem.value === menuItem
}

function setActive(menuItem: EnrollmentTypeEnum) {
  activeItem.value = menuItem
}
</script>

<template>
  <div class="row form-inline">
    <div class="col-md-6">
      <h1>Bookings</h1>
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
        @on-click="getUserEnrollments()"
        :is-loading="
          upcomingEnrollmentsIsLoading || waitlistEnrollmentsIsLoading || oldEnrollmentsIsLoading
        "
        text="Go"
        type="button"
        class="input-group-append"
      ></DefaultButtonComponent>
    </div>
  </div>
  <br />
  <br />

  <ul class="nav nav-tabs nav-justified">
    <li class="nav-item">
      <a
        class="nav-link"
        @click.prevent="setActive(EnrollmentTypeEnum.Upcoming)"
        :class="{ active: isActive(EnrollmentTypeEnum.Upcoming) }"
        href="#upcoming"
        >UPCOMING</a
      >
    </li>
    <li class="nav-item">
      <a
        class="nav-link"
        @click.prevent="setActive(EnrollmentTypeEnum.Waitlist)"
        :class="{ active: isActive(EnrollmentTypeEnum.Waitlist) }"
        href="#waitlist"
        >WAITLIST</a
      >
    </li>
    <li class="nav-item">
      <a
        class="nav-link"
        @click.prevent="setActive(EnrollmentTypeEnum.Historical)"
        :class="{ active: isActive(EnrollmentTypeEnum.Historical) }"
        href="#old"
        >OLD</a
      >
    </li>
  </ul>
  <div class="tab-content py-3" id="myTabContent">
    <div
      class="tab-pane fade"
      :class="{ 'active show': isActive(EnrollmentTypeEnum.Upcoming) }"
      id="upcoming"
    >
      <BookingsTable
        :enrollments="upcomingEnrollments"
        :isLoading="upcomingEnrollmentsIsLoading"
        :enrollmentType="EnrollmentTypeEnum.Upcoming"
        :siteDateTimeNow="siteDateTimeNow"
        @clickCancelEnrollment="clickCancelEnrollment"
        @clickRemoveFromWaitlist="clickRemoveFromWaitlist"
        @change-spot="goToChangeSpot"
        :is-filtered="isFiltered"
      >
      </BookingsTable>
    </div>
    <div
      class="tab-pane fade"
      :class="{ 'active show': isActive(EnrollmentTypeEnum.Waitlist) }"
      id="waitlist"
    >
      <BookingsTable
        :enrollments="waitlistEnrollments"
        :isLoading="waitlistEnrollmentsIsLoading"
        :enrollmentType="EnrollmentTypeEnum.Waitlist"
        :siteDateTimeNow="siteDateTimeNow"
        @clickCancelEnrollment="clickCancelEnrollment"
        @clickRemoveFromWaitlist="clickRemoveFromWaitlist"
        @change-spot="goToChangeSpot"
        :is-filtered="isFiltered"
      >
      </BookingsTable>
    </div>
    <div
      class="tab-pane fade"
      :class="{ 'active show': isActive(EnrollmentTypeEnum.Historical) }"
      id="old"
    >
      <BookingsTable
        :enrollments="oldEnrollments"
        :isLoading="oldEnrollmentsIsLoading"
        :enrollmentType="EnrollmentTypeEnum.Historical"
        :siteDateTimeNow="siteDateTimeNow"
        @clickRemoveFromWaitlist="clickRemoveFromWaitlist"
        @change-spot="goToChangeSpot"
        :is-filtered="isFiltered"
      >
      </BookingsTable>
    </div>
  </div>

  <!-- CONFIRM REMOVE FROM WAITLIST modal -->
  <ModalComponent
    title="Remove from waitlist"
    message="ARE YOU SURE YOU WANT TO BE REMOVED FROM THE WAITLIST?"
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
    title="SUCCESS"
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
    title="ERROR"
    :message="errorModalData.message"
    :closable="false"
    :cancel-text="null"
    v-if="errorModalData.isVisible"
    @on-ok="errorModalData.isVisible = false"
  >
  </ModalComponent>
</template>

<style scoped></style>
