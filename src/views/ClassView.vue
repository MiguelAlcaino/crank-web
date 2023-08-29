<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import dayjs from 'dayjs'

import type { ClassInfo, EnrollmentInfo } from '@/gql/graphql'

import ModalComponent from '@/components/ModalComponent.vue'

import ReserveSpotButton from '@/components/ReserveSpotButton.vue'
import SpotMatrix from '@/components/SpotMatrix.vue'
import WaitlistButton from '@/components/WaitlistButton.vue'
import YouAreAlreadyEnrolled from '@/components/YouAreAlreadyEnrolled.vue'

import router from '@/router'
import type { ApiService } from '@/services/apiService'
import { appStore } from '@/stores/appStorage'

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
    if (enrollmentInfo.value === null) enrollmentEnabled.value = true
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
  //TODO: go to the packages screen
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
    successModalData.value.title = 'Success'
    successModalData.value.message = 'Your booking is complete'
    showSuccessModal.value = true
  } else if (response === 'AddedToWaitlistSuccess') {
    successModalData.value.title = 'Success'
    successModalData.value.message =
      'You have added to the waitlist of class. You will be notified if you are added to the class.'
    showSuccessModal.value = true
  } else {
    if (response === 'PaymentRequiredError') {
      paymentErrorModal.value = true
    } else if (response === 'ClientIsAlreadyBookedError') {
      errorModalData.value.message = 'You already booked in this class.'
      showErrorModal.value = true
      enrollmentEnabled.value = false
      getClassInfo()
    } else if (response === 'ClientIsAlreadyOnWaitlistError') {
      errorModalData.value.message = 'You already booked in this waitlist.'
      showErrorModal.value = true
      enrollmentEnabled.value = false
      getClassInfo()
    } else if (response === 'WaitlistFullError') {
      errorModalData.value.message = 'The waitlist if full.'
      showErrorModal.value = true
      enrollmentEnabled.value = false
      getClassInfo()
    } else if (response === 'ClientIsOutsideSchedulingWindowError') {
      errorModalData.value.message = 'The class is outside the scheduling window.'
      showErrorModal.value = true
      enrollmentEnabled.value = false
    } else if (response === 'SpotAlreadyReservedError') {
      errorModalData.value.message = 'The spot has ben booked by another user.'
      showErrorModal.value = true
      getClassInfo()
    } else if (response === 'BookedButInOtherSpotError') {
      //TODO: BookedButInOtherSpotError action
      errorModalData.value.message = 'BOOKED BUT IN OTHER SPOT ERROR.'
      showErrorModal.value = true
      getClassInfo()
    } else if (response === 'ClassIsFullError') {
      errorModalData.value.message = 'The class is full.'
      showErrorModal.value = true
      enrollmentEnabled.value = false
      getClassInfo()
    } else if (response === 'UnknownError') {
      errorModalData.value.message =
        "Ups! Sorry, we didn't see that coming!. Please try again or communicate wuth the team to resolve this issue."
      showErrorModal.value = true
    } else {
      errorModalData.value.message =
        "Ups! Sorry, we didn't see that coming!. Please try again or communicate wuth the team to resolve this issue."
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
          <button type="button" class="btn btn-link" @click="$router.go(-1)">
            <font-awesome-icon icon="fa-solid fa-left-long" />&nbsp;Back to Calendar
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row">
      <div class="col-12 text-center">
        <h4>{{ classInfo?.class.name }}</h4>
        <p><span v-html="classInfo?.class.description"></span></p>
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
            v-if="classInfo !== null && classInfo.class.waitListAvailable"
            @clickBookWaitList="clickBookWaitList"
            :enrollmentEnabled="enrollmentInfo === null"
          >
          </WaitlistButton>
          <SpotMatrix
            v-if="
              classInfo !== null &&
              classInfo.roomLayout?.matrix !== null &&
              !classInfo.class.waitListAvailable
            "
            :matrix="classInfo.roomLayout?.matrix"
            @click-spot="confirmBookSpot"
          ></SpotMatrix>
          <ReserveSpotButton
            v-if="
              classInfo !== null &&
              classInfo.roomLayout === null &&
              !classInfo.class.waitListAvailable
            "
            @click-book-class="confirmBookClass"
            :enrollmentEnabled="enrollmentInfo === null"
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
    title="Error"
    :closable="false"
    v-if="showErrorModal"
    @on-ok="showErrorModal = false"
  ></ModalComponent>

  <!-- Error Payment Modal -->
  <ModalComponent
    v-if="paymentErrorModal"
    title="Error"
    message="You do not have sufficient credits in your account."
    @on-cancel="paymentErrorModal = false"
    @on-ok="goToThePackagesScreen()"
  >
  </ModalComponent>
</template>

<style scoped></style>
