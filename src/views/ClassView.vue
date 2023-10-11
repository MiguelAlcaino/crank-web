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

import router from '@/router'
import type { ApiService } from '@/services/apiService'
import { appStore } from '@/stores/appStorage'
import {
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
const showSuccessModal = ref<boolean>(false)
const showErrorModal = ref<boolean>(false)
const showModal = ref<boolean>(false)
const classInfo = ref<ClassInfo | null>(null)

const enrollmentEnabled = ref<boolean>(true)
const enrollmentInfo = ref<EnrollmentInfo | null>(null)

const confirmModalData = ref<{ title: string; message: string; isLoading: boolean }>({
  title: '',
  message: '',
  isLoading: false
})
const errorModalData = ref<{ title: string; message: string; isLoading: boolean }>({
  title: '',
  message: '',
  isLoading: false
})
const successModalData = ref<{ title: string; message: string; isLoading: boolean }>({
  title: '',
  message: '',
  isLoading: false
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

  showModal.value = true
}

function clickBookWaitList(): void {
  spotNumber.value = null
  isWaitlistBooking.value = true

  confirmModalData.value.isLoading = false
  confirmModalData.value.title = 'ENROLL ON THE WAITLIST'
  confirmModalData.value.message = 'WOULD YOU LIKE TO ENROLL ON THE WAITLIST?'

  showModal.value = true
}

function confirmBookClass(): void {
  spotNumber.value = null
  isWaitlistBooking.value = false

  confirmModalData.value.isLoading = false
  confirmModalData.value.title = 'BOOK THIS CLASS'
  confirmModalData.value.message = 'WOULD YOU LIKE TO BOOK THIS CLASS?'

  showModal.value = true
}

function acceptSuccessModal() {
  showSuccessModal.value = false
  router.replace({ name: 'calendar' })
}

function goToThePackagesScreen() {
  const paymentRedirectUrl = (import.meta.env.VITE_PAYMENT_REDIRECT_URL ?? null) as string | null
  if (paymentRedirectUrl) {
    window.location.href = paymentRedirectUrl
  }
}

async function bookClass(classId: string, spotNumber: number | null, isWaitlistBooking: boolean) {
  confirmModalData.value.isLoading = true

  const response = await apiService.bookClass(appStore().site, {
    classId: classId,
    spotNumber: spotNumber,
    isWaitlistBooking: isWaitlistBooking
  })

  confirmModalData.value.isLoading = false
  showModal.value = false

  if (response === 'BookClassSuccess') {
    successModalData.value.title = 'SUCCESS'
    successModalData.value.message = SUCCESS_BOOK_CLASS
    showSuccessModal.value = true
  } else if (response === 'AddedToWaitlistSuccess') {
    successModalData.value.title = 'SUCCESS'
    successModalData.value.message = SUCCESS_ADDED_TO_WAITLIST
    showSuccessModal.value = true
  } else {
    if (response === 'PaymentRequiredError') {
      paymentErrorModal.value = true
    } else if (response === 'ClientIsAlreadyBookedError') {
      errorModalData.value.message = ERROR_CLIENT_IS_ALREADY_BOOKED
      showErrorModal.value = true
      enrollmentEnabled.value = false
      getClassInfo()
    } else if (response === 'ClientIsAlreadyOnWaitlistError') {
      errorModalData.value.message = ERROR_CLIENT_IS_ALREADY__ON_WAITLIST
      showErrorModal.value = true
      enrollmentEnabled.value = false
      getClassInfo()
    } else if (response === 'WaitlistFullError') {
      errorModalData.value.message = ERROR_WAITLIST_FULL_ERROR
      showErrorModal.value = true
      enrollmentEnabled.value = false
      getClassInfo()
    } else if (response === 'ClientIsOutsideSchedulingWindowError') {
      errorModalData.value.message = ERROR_CLIENT_IS_OUTSIDE_SCHEDULING_WINDOW
      showErrorModal.value = true
      enrollmentEnabled.value = false
    } else if (response === 'SpotAlreadyReservedError') {
      errorModalData.value.message = ERROR_SPOT_ALREADY_RESERVED
      showErrorModal.value = true
      getClassInfo()
    } else if (response === 'BookedButInOtherSpotError') {
      //TODO: BookedButInOtherSpotError action
      errorModalData.value.message = 'BOOKED BUT IN OTHER SPOT ERROR.'
      showErrorModal.value = true
      getClassInfo()
    } else if (response === 'ClassIsFullError') {
      errorModalData.value.message = ERROR_CLASS_IS_FULL
      showErrorModal.value = true
      enrollmentEnabled.value = false
      getClassInfo()
    } else if (response === 'UnknownError') {
      errorModalData.value.message = ERROR_UNKNOWN
      showErrorModal.value = true
    } else {
      errorModalData.value.message = ERROR_UNKNOWN
      showErrorModal.value = true
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
              classInfo.roomLayout?.matrix !== null &&
              (!classInfo.class.waitListAvailable || enrollmentInfo !== null) &&
              enrollmentInfo?.enrollmentStatus !== 'waitlisted'
            "
            :matrix="classInfo.roomLayout?.matrix"
            @click-spot="confirmBookSpot"
            :spot-number-booked-by-current-user="enrollmentInfo?.spotInfo?.spotNumber"
          ></SpotMatrix>
          <ReserveSpotButton
            v-if="
              classInfo !== null &&
              classInfo.roomLayout === null &&
              !classInfo.class.waitListAvailable
            "
            @click-book-class="confirmBookClass"
            :enrollmentEnabled="enrollmentEnabled"
          >
          </ReserveSpotButton>
        </div>
      </div>
    </div>
  </div>

  <ModalComponent
    v-if="showModal"
    :title="confirmModalData.title"
    :message="confirmModalData.message"
    :ok-loading="confirmModalData.isLoading"
    @on-cancel="showModal = false"
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
    v-if="showSuccessModal"
  >
  </ModalComponent>

  <ModalComponent
    :ok-loading="false"
    :cancel-text="null"
    :message="errorModalData.message"
    title="ERROR"
    :closable="false"
    v-if="showErrorModal"
    @on-ok="showErrorModal = false"
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
</style>
