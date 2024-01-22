<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import dayjs from 'dayjs'

import {
  PositionIconEnum,
  type ClassInfo,
  type EnrollmentInfo,
  type BookableSpot,
  EnrollmentStatusEnum
} from '@/gql/graphql'

import ModalComponent from '@/components/ModalComponent.vue'

import SpotMatrix from '@/components/SpotMatrix.vue'
import YouAreAlreadyEnrolled from '@/components/YouAreAlreadyEnrolled.vue'

import type { ApiService } from '@/services/apiService'
import { appStore } from '@/stores/appStorage'
import {
  ERROR_CLIENT_IS_OUTSIDE_SCHEDULING_WINDOW,
  ERROR_SPOT_ALREADY_RESERVED,
  ERROR_TRY_TO_SWITCH_TO_SAME_SPOT,
  ERROR_UNKNOWN
} from '@/utils/errorMessages'
import { SUCCESS_CHANGE_SPOT } from '@/utils/successMessages'

const route = useRoute()

const classId = ref<string>('')
const newSpotNumber = ref<number | null>(null)
const changeSpotModalIsVisible = ref<boolean>(false)
const changingSpot = ref<boolean>(false)
const changeSpotMessage = ref<string>('')

const isLoading = ref<boolean>(false)
const showSuccessModal = ref<boolean>(false)
const showErrorModal = ref<boolean>(false)
const errorModalMessage = ref<string>('')

const classInfo = ref<ClassInfo | null>(null)

const enrollmentEnabled = ref<boolean>(true)
const enrollmentInfo = ref<EnrollmentInfo | null>(null)
const thereAreSpotsAvailable = ref<boolean>(false)

interface SpotClickedEvent {
  spotNumber: number | null
}

const apiService = inject<ApiService>('gqlApiService')!

onMounted(() => {
  classId.value = route.params.classId as string
  getClassInfo()
})

watch(
  () => route.params.classId,
  () => {
    classId.value = route.params.classId as string
    getClassInfo()
  }
)

async function getClassInfo() {
  enrollmentEnabled.value = false
  isLoading.value = true

  const _classInfo = await apiService.getClassInfo(appStore().site, classId.value)

  if (_classInfo) {
    enrollmentInfo.value = await apiService.getCurrentUserEnrollmentInClass(classId.value)
    if (enrollmentInfo.value === null) enrollmentEnabled.value = true
  }

  classInfo.value = _classInfo

  checkAvailableSpots(_classInfo)

  isLoading.value = false
}

function checkAvailableSpots(classInfo: ClassInfo | null) {
  thereAreSpotsAvailable.value = false

  if (classInfo?.roomLayout?.matrix) {
    const matrix = classInfo?.roomLayout?.matrix

    for (let i = 0; i < matrix.length; i++) {
      if (matrix[i].icon === PositionIconEnum.Spot) {
        let bookableSpot = matrix[i] as BookableSpot

        let isBooked = classInfo?.usedSpots?.find((x) => x === bookableSpot.spotNumber)
          ? true
          : false

        if (!isBooked) {
          thereAreSpotsAvailable.value = true
          break
        }
      }
    }
  }
}

function confirmChangeSpot(event: SpotClickedEvent): void {
  newSpotNumber.value = event.spotNumber

  changingSpot.value = false
  changeSpotMessage.value = 'WOULD YOU LIKE TO MOVE TO SPOT ' + newSpotNumber.value + '?'

  changeSpotModalIsVisible.value = true
}

async function editCurrentUserEnrollment() {
  changingSpot.value = true

  const response = await apiService.editCurrentUserEnrollment(
    appStore().site,
    enrollmentInfo.value!.id!,
    newSpotNumber.value!
  )

  changingSpot.value = false
  changeSpotModalIsVisible.value = false

  if (response === 'Enrollment') {
    showSuccessModal.value = true
  } else if (response === 'ClientIsOutsideSchedulingWindowError') {
    errorModalMessage.value = ERROR_CLIENT_IS_OUTSIDE_SCHEDULING_WINDOW
    showErrorModal.value = true
    enrollmentEnabled.value = false
  } else if (response === 'SpotAlreadyReservedError') {
    errorModalMessage.value = ERROR_SPOT_ALREADY_RESERVED
    showErrorModal.value = true
  } else if (response === 'TryToSwitchToSameSpotError') {
    errorModalMessage.value = ERROR_TRY_TO_SWITCH_TO_SAME_SPOT
    showErrorModal.value = true
  } else {
    errorModalMessage.value = ERROR_UNKNOWN
    showErrorModal.value = true
  }

  getClassInfo()
}
</script>

<template>
  <div class="row">
    <div class="col-md-6 col-sm-8">
      <h1 class="page-title">CHANGE SPOT</h1>
    </div>
    <div class="col-md-6 col-sm-4">
      <div class="text-right">
        <div class="form-group form-material">
          <button type="button" class="btn btn-link" @click="$router.go(-1)">
            <font-awesome-icon icon="fa-solid fa-left-long" />&nbsp;Back to Bookings
          </button>
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

    <div class="row" v-if="!thereAreSpotsAvailable && classInfo !== null">
      <div class="col-12 text-center">
        <p class="spots-not-available">No other spots are available</p>
      </div>
    </div>

    <hr />
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12" style="text-align: center">
          <SpotMatrix
            v-if="
              classInfo !== null &&
              classInfo.roomLayout?.matrix !== null &&
              (!classInfo.class.waitListAvailable || enrollmentInfo !== null)
            "
            :matrix="classInfo.roomLayout?.matrix"
            @click-spot="confirmChangeSpot"
            :spot-number-booked-by-current-user="enrollmentInfo?.spotNumber"
            :used-spots="classInfo.usedSpots"
          ></SpotMatrix>
        </div>
      </div>
    </div>
  </div>

  <!-- CONFIRIM CHANGE SPOT Modal -->
  <ModalComponent
    v-if="changeSpotModalIsVisible"
    title="CHANGE SPOT"
    :message="changeSpotMessage"
    :ok-loading="changingSpot"
    @on-cancel="changeSpotModalIsVisible = false"
    @on-ok="editCurrentUserEnrollment()"
    :closable="false"
  >
  </ModalComponent>

  <!-- SUCCESS Modal -->
  <ModalComponent
    title="SUCCESS"
    :message="SUCCESS_CHANGE_SPOT"
    :closable="false"
    @on-ok="showSuccessModal = false"
    :cancel-text="null"
    v-if="showSuccessModal"
  >
  </ModalComponent>

  <!-- ERROR modal -->
  <ModalComponent
    :ok-loading="false"
    :cancel-text="null"
    :message="errorModalMessage"
    title="ERROR"
    :closable="false"
    v-if="showErrorModal"
    @on-ok="showErrorModal = false"
  ></ModalComponent>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped>
p.spots-not-available {
  font-family: 'BigJohn', sans-serif;
  font-size: smaller;
}
</style>
