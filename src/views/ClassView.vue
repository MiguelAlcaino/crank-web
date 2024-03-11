<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import dayjs from 'dayjs'

import { EnrollmentStatusEnum, type ClassInfo, type EnrollmentInfo } from '@/gql/graphql'

import ModalComponent from '@/components/ModalComponent.vue'

import ReserveSpotButton from '@/components/ReserveSpotButton.vue'
import SpotMatrix from '@/components/SpotMatrix.vue'
import WaitlistButton from '@/components/WaitlistButton.vue'
import YouAreAlreadyEnrolled from '@/components/YouAreAlreadyEnrolled.vue'
import CancelEnrollment from '@/components/CancelEnrollment.vue'

import router from '@/router'
import type { ApiService } from '@/services/apiService'
import { appStore } from '@/stores/appStorage'
import {
  ERROR_BOOKING_OVERLAPS_ANOTHER_ONE,
  ERROR_CLASS_IS_FULL,
  ERROR_CLIENT_IS_ALREADY_BOOKED,
  ERROR_CLIENT_IS_ALREADY__ON_WAITLIST,
  ERROR_CLIENT_IS_OUTSIDE_SCHEDULING_WINDOW,
  ERROR_PAYMENT_REQUIRED,
  ERROR_SPOT_ALREADY_RESERVED,
  ERROR_UNKNOWN,
  ERROR_WAITLIST_FULL_ERROR
} from '@/utils/errorMessages'
import { SUCCESS_ADDED_TO_WAITLIST, SUCCESS_BOOK_CLASS } from '@/utils/successMessages'

const route = useRoute()

const classId = ref<string>('')
const spotNumber = ref<number | null>(null)
const isWaitlistBooking = ref<boolean | null>(null)

const isLoading = ref<boolean>(false)
const classInfo = ref<ClassInfo | null>(null)

const enrollmentEnabled = ref<boolean>(true)
const enrollmentInfo = ref<EnrollmentInfo | null>(null)

const siteDateTimeNow = ref<Date>(new Date())

const confirmModalData = ref<{
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

const paymentErrorModal = ref<boolean>(false)

interface SpotClickedEvent {
  spotNumber: number | null
}

const apiService = inject<ApiService>('gqlApiService')!

onMounted(() => {
  classId.value = route.params.id as string
  getClassInfo()
})

watch(
  () => route.params.id,
  (Id) => {
    getClassInfo()
  }
)

async function getClassInfo() {
  enrollmentEnabled.value = false
  isLoading.value = true

  const classId = route.params.id as string
  const _classInfo = await apiService.getClassInfo(appStore().site, classId)
  const siteSettings = await apiService.getSiteSettings(appStore().site)

  if (siteSettings) siteDateTimeNow.value = siteSettings.siteDateTimeNow

  if (_classInfo) {
    enrollmentInfo.value = await apiService.getCurrentUserEnrollmentInClass(classId)
    if (enrollmentInfo.value === null || enrollmentInfo.value === undefined) {
      enrollmentEnabled.value = true
    } else if (enrollmentInfo.value.enrollmentStatus === EnrollmentStatusEnum.LateCancelled) {
      enrollmentEnabled.value = true
    }
  }

  classInfo.value = _classInfo

  isLoading.value = false
}

function confirmBookSpot(event: SpotClickedEvent): void {
  spotNumber.value = event.spotNumber
  isWaitlistBooking.value = false

  confirmModalData.value.isLoading = false
  confirmModalData.value.title = 'BOOK YOUR SPOT'
  confirmModalData.value.message = 'WOULD YOU LIKE TO BOOK SPOT ' + event.spotNumber + '?'

  confirmModalData.value.isVisible = true
}

function clickBookWaitList(): void {
  spotNumber.value = null
  isWaitlistBooking.value = true

  confirmModalData.value.isLoading = false
  confirmModalData.value.title = 'WAITLIST'
  confirmModalData.value.message = 'WOULD YOU LIKE TO ENROLL ON THE WAITLIST?'

  confirmModalData.value.isVisible = true
}

function confirmBookClass(): void {
  spotNumber.value = null
  isWaitlistBooking.value = false

  confirmModalData.value.isLoading = false
  confirmModalData.value.title = 'BOOK THIS CLASS'
  confirmModalData.value.message = 'WOULD YOU LIKE TO BOOK THIS CLASS?'

  confirmModalData.value.isVisible = true
}

function acceptSuccessModal() {
  successModalData.value.isVisible = false
  router.replace({ name: 'calendar' })
}

function goToThePackagesScreen() {
  router.push({ name: 'payments' })
}

async function bookClass(classId: string, spotNumber: number | null, isWaitlistBooking: boolean) {
  confirmModalData.value.isLoading = true

  const response = await apiService.bookClass(appStore().site, {
    classId: classId,
    spotNumber: spotNumber,
    isWaitlistBooking: isWaitlistBooking
  })

  confirmModalData.value.isLoading = false
  confirmModalData.value.isVisible = false

  if (response === 'BookClassSuccess') {
    successModalData.value.title = 'SUCCESS'
    successModalData.value.message = SUCCESS_BOOK_CLASS
    successModalData.value.isVisible = true
  } else if (response === 'AddedToWaitlistSuccess') {
    successModalData.value.title = 'SUCCESS'
    successModalData.value.message = SUCCESS_ADDED_TO_WAITLIST
    successModalData.value.isVisible = true
  } else {
    if (response === 'PaymentRequiredError') {
      paymentErrorModal.value = true
    } else if (response === 'ClientIsAlreadyBookedError') {
      errorModalData.value.message = ERROR_CLIENT_IS_ALREADY_BOOKED
      errorModalData.value.isVisible = true
      await getClassInfo()
      enrollmentEnabled.value = false
    } else if (response === 'BookingOverlapsAnotherOneError') {
      errorModalData.value.message = ERROR_BOOKING_OVERLAPS_ANOTHER_ONE
      errorModalData.value.isVisible = true
      await getClassInfo()
      enrollmentEnabled.value = false
    } else if (response === 'ClientIsAlreadyOnWaitlistError') {
      errorModalData.value.message = ERROR_CLIENT_IS_ALREADY__ON_WAITLIST
      errorModalData.value.isVisible = true
      enrollmentEnabled.value = false
      getClassInfo()
    } else if (response === 'WaitlistFullError') {
      errorModalData.value.message = ERROR_WAITLIST_FULL_ERROR
      errorModalData.value.isVisible = true
      enrollmentEnabled.value = false
      getClassInfo()
    } else if (response === 'ClientIsOutsideSchedulingWindowError') {
      errorModalData.value.message = ERROR_CLIENT_IS_OUTSIDE_SCHEDULING_WINDOW
      errorModalData.value.isVisible = true
      enrollmentEnabled.value = false
    } else if (response === 'SpotAlreadyReservedError') {
      errorModalData.value.message = ERROR_SPOT_ALREADY_RESERVED
      errorModalData.value.isVisible = true
      getClassInfo()
    } else if (response === 'BookedButInOtherSpotError') {
      errorModalData.value.message = ERROR_BOOKING_OVERLAPS_ANOTHER_ONE
      errorModalData.value.isVisible = true
      getClassInfo()
    } else if (response === 'ClassIsFullError') {
      errorModalData.value.message = ERROR_CLASS_IS_FULL
      errorModalData.value.isVisible = true
      enrollmentEnabled.value = false
      getClassInfo()
    } else if (response === 'UnknownError') {
      errorModalData.value.message = ERROR_UNKNOWN
      errorModalData.value.isVisible = true
    } else {
      errorModalData.value.message = ERROR_UNKNOWN
      errorModalData.value.isVisible = true
    }
  }
}
</script>

<template>
  <div class="row">
    <div class="col-md-6 col-sm-8">
      <h1 class="page-title">RESERVE A SPOT</h1>
    </div>
    <div class="col-md-6 col-sm-4">
      <div class="text-right">
        <div class="form-group form-material">
          <a class="nav-link" @click="$router.go(-1)" href="#">
            <font-awesome-icon icon="fa-solid fa-left-long" />&nbsp;Back to Calendar
          </a>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row">
      <div class="col-12 text-center">
        <h4>{{ classInfo?.class.name }}</h4>
        <p><b>Instructor: </b> {{ classInfo?.class.instructorName }}</p>
        <p>
          <b>Date: </b>
          <span>{{ dayjs(classInfo?.class.startWithNoTimeZone).format('DD/MM/YYYY') }}</span>
        </p>
        <p>
          <b>Time: </b>
          <span>{{ dayjs(classInfo?.class.startWithNoTimeZone).format('h:mm a') }}</span> |
          <b>Duration: </b>
          <span>{{ classInfo?.class.duration }}</span> mins.
        </p>
      </div>
    </div>

    <div class="row">
      <div class="col-12 text-center">
        <YouAreAlreadyEnrolled
          v-if="enrollmentInfo !== null"
          :enrollment-info="enrollmentInfo"
        ></YouAreAlreadyEnrolled>
      </div>
    </div>

    <hr />
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12" style="text-align: center">
          <WaitlistButton
            v-if="
              classInfo !== null &&
              classInfo.class.waitListAvailable &&
              (enrollmentInfo === null || enrollmentInfo === undefined)
            "
            @clickBookWaitList="clickBookWaitList"
            :enrollmentEnabled="enrollmentEnabled"
          >
          </WaitlistButton>
          <SpotMatrix
            v-if="
              classInfo !== null &&
              classInfo?.roomLayout?.matrix !== null &&
              (!classInfo.class.waitListAvailable || enrollmentInfo !== null) &&
              enrollmentInfo?.enrollmentStatus !== EnrollmentStatusEnum.Waitlisted
            "
            :matrix="classInfo.roomLayout?.matrix"
            @click-spot="confirmBookSpot"
            :spot-number-booked-by-current-user="enrollmentInfo?.spotNumber"
            :used-spots="classInfo.usedSpots"
          ></SpotMatrix>
          <ReserveSpotButton
            v-if="
              classInfo !== null &&
              classInfo.roomLayout === null &&
              !classInfo.class.waitListAvailable &&
              enrollmentInfo?.enrollmentStatus !== EnrollmentStatusEnum.Waitlisted &&
              enrollmentInfo?.enrollmentStatus !== EnrollmentStatusEnum.Active
            "
            @click-book-class="confirmBookClass"
            :enrollmentEnabled="enrollmentEnabled"
          >
          </ReserveSpotButton>
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col-4">
          <CancelEnrollment
            v-if="
              enrollmentInfo?.enrollmentStatus &&
              (enrollmentInfo.enrollmentStatus === EnrollmentStatusEnum.Waitlisted ||
                enrollmentInfo.enrollmentStatus === EnrollmentStatusEnum.Active)
            "
            :enrollment-status="enrollmentInfo?.enrollmentStatus"
            :enrollment-id="enrollmentInfo.id"
            @after-cancelling="acceptSuccessModal()"
            :site-date-time-now="siteDateTimeNow"
            :start="classInfo!.class.start"
          ></CancelEnrollment>
        </div>
      </div>
    </div>
  </div>

  <!-- Confirm Modal -->
  <ModalComponent
    v-if="confirmModalData.isVisible"
    :title="confirmModalData.title"
    :message="confirmModalData.message"
    :ok-loading="confirmModalData.isLoading"
    @on-cancel="confirmModalData.isVisible = false"
    @on-ok="bookClass(classId, spotNumber, isWaitlistBooking!)"
    :closable="false"
  >
  </ModalComponent>

  <!-- Success Modal -->
  <ModalComponent
    :title="successModalData.title"
    :message="successModalData.message"
    :closable="false"
    @on-ok="acceptSuccessModal"
    :cancel-text="null"
    v-if="successModalData.isVisible"
  >
  </ModalComponent>

  <ModalComponent
    :ok-loading="false"
    :cancel-text="null"
    :message="errorModalData.message"
    title="ERROR"
    :closable="false"
    v-if="errorModalData.isVisible"
    @on-ok="errorModalData.isVisible = false"
  ></ModalComponent>

  <!-- Error Payment Modal -->
  <ModalComponent
    v-if="paymentErrorModal"
    title="ERROR"
    :message="ERROR_PAYMENT_REQUIRED"
    @on-cancel="paymentErrorModal = false"
    @on-ok="goToThePackagesScreen()"
    ok-text="BUY"
  >
  </ModalComponent>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped>
a:link {
  color: #000000;
  background-color: transparent;
  text-decoration: none;
  font-family: 'BigJohn', sans-serif;
}

a:visited {
  color: #000000;
  background-color: transparent;
  text-decoration: none;
  font-family: 'BigJohn', sans-serif;
}

a:hover {
  color: #ff7f61;
  background-color: transparent;
  text-decoration: none;
  font-family: 'BigJohn', sans-serif;
}

a:active {
  color: #000000;
  background-color: transparent;
  text-decoration: none;
  font-family: 'BigJohn', sans-serif;
}

b {
  font-family: 'BigJohn', sans-serif;
}

p {
  font-family: 'Avenir', sans-serif;
}
</style>
