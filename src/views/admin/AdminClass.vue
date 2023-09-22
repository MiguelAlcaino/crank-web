<script lang="ts">
interface BookableSpotClickedEvent {
  spotNumber: number | null
  isBooked: boolean
}
</script>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import dayjs from 'dayjs'

import type { BookableSpot, ClassInfo, IconPosition } from '@/gql/graphql'

import type { ApiService } from '@/services/apiService'

import { appStore } from '@/stores/appStorage'

import SpotMatrix from '@/components/SpotMatrix.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import AdminBookedUsersList from '@/components/AdminBookedUsersList.vue'
import EnrollSelectedMemberComponent from '@/components/EnrollSelectedMemberComponent.vue'
import DefaultButtonComponent from '@/components/DefaultButtonComponent.vue'

import {
  ERROR_LATE_CANCELLATION_REQUIRED,
  ERROR_SPOT_NOT_FOUND,
  ERROR_UNKNOWN
} from '@/utils/errorMessages'

const route = useRoute()

const apiService = inject<ApiService>('gqlApiService')!
const isLoading = ref<boolean>(false)
const editingLayout = ref<boolean>(false)
const classInfo = ref<ClassInfo | null>(null)

const assignUserToThisSpotVisible = ref<boolean>(false)
const isEnablingDisablingSpot = ref<boolean>(false)

const classId = ref<string>('')
const totalSignedIn = ref<number>(0)

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

const confirmModalCancelReservationData = ref<{
  isLoading: boolean
  isVisible: boolean
}>({
  isLoading: false,
  isVisible: false
})

const confirmModalLateCancelReservationData = ref<{
  isLoading: boolean
  isVisible: boolean
}>({
  isLoading: false,
  isVisible: false
})

const selectedSpot = ref<{
  spotNumber?: number | null
  isBooked?: boolean | null
  fullName?: string | null
  enabled?: boolean | null
  enrollmentId?: string | null
}>({
  spotNumber: null,
  isBooked: null,
  fullName: null,
  enabled: null,
  enrollmentId: null
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

onMounted(() => {
  classId.value = getClassId()
  getClassInfo()
})

async function getClassInfo() {
  isLoading.value = true
  classInfo.value = await apiService.getClassInfo(appStore().site, classId.value)
  totalSignedIn.value = classInfo.value?.enrollments.length ?? 0

  isLoading.value = false
}

function getClassId(): string {
  let mindbodyClass = inject<any | undefined>('mindbodyClass')
  if (mindbodyClass !== undefined) {
    return mindbodyClass.id as string
  }

  return route.params.id as string
}

function spotClicked(event: BookableSpotClickedEvent) {
  assignUserToThisSpotVisible.value = false

  for (let index = 0; index < classInfo.value!.roomLayout!.matrix!.length; index++) {
    const element = classInfo.value!.roomLayout!.matrix![index] as BookableSpot | IconPosition

    if (element.__typename == 'BookableSpot') {
      const bookableSpot = element as BookableSpot

      if (bookableSpot.spotInfo.spotNumber === event.spotNumber) {
        var fullName = ''
        var enrollmentId: string | null | undefined

        if (classInfo.value?.enrollments != null) {
          for (let index = 0; index < classInfo.value?.enrollments.length; index++) {
            const enrollment = classInfo.value?.enrollments[index]

            if (
              bookableSpot.spotInfo.spotNumber === enrollment.spotInfo?.spotNumber &&
              enrollment.user
            ) {
              fullName =
                (enrollment.user?.firstName ?? '') + ' ' + (enrollment.user?.lastName ?? '')
              enrollmentId = enrollment.id
              break
            }
          }
        }

        selectedSpot.value = {
          spotNumber: bookableSpot.spotInfo?.spotNumber,
          isBooked: bookableSpot.spotInfo?.isBooked,
          fullName: fullName,
          enabled: bookableSpot.enabled,
          enrollmentId: enrollmentId
        }
        break
      }
    }
  }
}

async function clickPutUnderMaintenance() {
  isEnablingDisablingSpot.value = true

  const response = await apiService.disableSpot(classId.value, selectedSpot.value.spotNumber!)

  isEnablingDisablingSpot.value = false

  if (response === 'Success') {
    await getClassInfo()
    selectedSpot.value = { enabled: null, fullName: null, isBooked: null, spotNumber: null }
  } else if (response === 'SpotNotFoundError') {
    errorModalData.value.message = ERROR_SPOT_NOT_FOUND
    errorModalData.value.isVisible = true
  } else {
    errorModalData.value.message = ERROR_UNKNOWN
    errorModalData.value.isVisible = true
  }
}

async function clickRecoverFromMaintenance() {
  isEnablingDisablingSpot.value = true

  const response = await apiService.enableSpot(classId.value, selectedSpot.value.spotNumber!)

  isEnablingDisablingSpot.value = false

  if (response === 'Success') {
    await getClassInfo()
    selectedSpot.value = { enabled: null, fullName: null, isBooked: null, spotNumber: null }
  } else if (response === 'SpotNotFoundError') {
    errorModalData.value.message = ERROR_SPOT_NOT_FOUND
    errorModalData.value.isVisible = true
  } else {
    errorModalData.value.message = ERROR_UNKNOWN
    errorModalData.value.isVisible = true
  }
}

function clickCancelMembersReservation() {
  confirmModalCancelReservationData.value.isLoading = false
  confirmModalCancelReservationData.value.isVisible = true
}

async function removeUserFromClass() {
  confirmModalCancelReservationData.value.isLoading = true

  const response = await apiService.removeUserFromClass(selectedSpot.value.enrollmentId!, false)

  confirmModalCancelReservationData.value.isLoading = false

  confirmModalCancelReservationData.value.isVisible = false

  if (response === 'CancelUserEnrollmentSuccess') {
    selectedSpot.value = {
      enabled: null,
      fullName: null,
      isBooked: null,
      spotNumber: null,
      enrollmentId: null
    }
    await getClassInfo()
  } else if (response === 'LateCancellationRequiredError') {
    confirmModalLateCancelReservationData.value.isLoading = false
    confirmModalLateCancelReservationData.value.isVisible = true
  } else {
    errorModalData.value.message = ERROR_UNKNOWN
    errorModalData.value.isVisible = true
  }
}

async function confirmLateCancelation() {
  confirmModalLateCancelReservationData.value.isLoading = true

  const response = await apiService.removeUserFromClass(selectedSpot.value.enrollmentId!, true)

  confirmModalLateCancelReservationData.value.isLoading = false

  confirmModalLateCancelReservationData.value.isVisible = false

  if (response === 'CancelUserEnrollmentSuccess') {
    selectedSpot.value = {
      enabled: null,
      fullName: null,
      isBooked: null,
      spotNumber: null,
      enrollmentId: null
    }
    await getClassInfo()
  } else if (response === 'LateCancellationRequiredError') {
    confirmModalLateCancelReservationData.value.isLoading = false
    confirmModalLateCancelReservationData.value.isVisible = true
  } else {
    errorModalData.value.message = ERROR_UNKNOWN
    errorModalData.value.isVisible = true
  }
}

function goToLayoutEditPage(url: string) {
  if (url) {
    window.location.href = url
  } else {
    errorModalData.value.message = 'Redirect url is not configured.'
    errorModalData.value.isVisible = true
  }
}

async function removeLayout() {
  editingLayout.value = true
  const result = await apiService.editClass({ classId: classId.value, roomLayoutId: null })
  editingLayout.value = false

  if (result.__typename === 'EditClassSuccessResult') {
    await getClassInfo()

    successModalData.value.title = 'SUCCESS'
    successModalData.value.message = 'The layout was removed successfully.'
    successModalData.value.isVisible = true
  } else {
    errorModalData.value.message = ERROR_UNKNOWN
    errorModalData.value.isVisible = true
  }
}

async function assignRoomLayoutId(roomLayoutId: string) {
  if (roomLayoutId) {
    editingLayout.value = true
    const result = await apiService.editClass({
      classId: classId.value,
      roomLayoutId: roomLayoutId
    })
    editingLayout.value = false

    if (result.__typename === 'EditClassSuccessResult') {
      await getClassInfo()

      successModalData.value.title = 'SUCCESS'
      successModalData.value.message = 'Room layout assigned successfully.'
      successModalData.value.isVisible = true
    } else {
      errorModalData.value.message = ERROR_UNKNOWN
      errorModalData.value.isVisible = true
    }
  } else {
    errorModalData.value.message = ERROR_UNKNOWN
    errorModalData.value.isVisible = true
  }
}
</script>

<template>
  <div>
    <h4>
      {{ classInfo?.class?.name }} - {{ classInfo?.class.instructorName }} ({{
        dayjs(classInfo?.class.startWithNoTimeZone).format('DD/MM/YYYY')
      }}) | Total Signed In : {{ totalSignedIn }} | ClassID:
      {{ classInfo?.class.id }}
    </h4>
    <h4>
      Time : {{ dayjs(classInfo?.class.startWithNoTimeZone).format('hh:mm A') }} | Duration :
      {{ classInfo?.class?.duration }} mins
    </h4>

    <h6 v-html="classInfo?.class?.description"></h6>
  </div>

  <hr />
  <SpotMatrix
    v-if="
      classInfo !== null && classInfo.roomLayout !== null && classInfo.roomLayout?.matrix !== null
    "
    :matrix="classInfo.roomLayout!.matrix!"
    :show-user-in-spots="true"
    :selectedSpotNumber="selectedSpot?.spotNumber"
    @click-spot="spotClicked"
    :enrollments="classInfo.enrollments"
  >
  </SpotMatrix>

  <EnrollSelectedMemberComponent
    :class-id="classId"
    v-if="classInfo !== null && classInfo.roomLayout === null && classInfo.enrollments !== null"
    @after-enrolling="getClassInfo()"
    :spot-number="null"
    enrollButtonText="Enroll Selected Member"
  ></EnrollSelectedMemberComponent>

  <AdminBookedUsersList
    v-if="classInfo !== null && classInfo.roomLayout === null && classInfo.enrollments !== null"
    :enrollments="classInfo.enrollments"
    :isLoading="false"
    @after-cancel-member-reservation="getClassInfo()"
  >
  </AdminBookedUsersList>

  <div v-if="selectedSpot?.isBooked === false && selectedSpot.enabled === true">
    <h2>Choose an action :</h2>
    <DefaultButtonComponent
      text="Assign User to this Spot"
      type="button"
      @on-click="assignUserToThisSpotVisible = true"
      class="mr-1"
    ></DefaultButtonComponent>
    <DefaultButtonComponent
      text="Put under maintenance"
      type="button"
      @on-click="clickPutUnderMaintenance"
      class="mr-1"
      :is-loading="isEnablingDisablingSpot"
    ></DefaultButtonComponent>
  </div>
  <div v-if="selectedSpot.enabled === false">
    <h2>Spot is under maintenance</h2>
    <DefaultButtonComponent
      text="Recover from maintenance"
      type="button"
      @on-click="clickRecoverFromMaintenance"
      class="mr-1"
      :is-loading="isEnablingDisablingSpot"
    ></DefaultButtonComponent>
  </div>
  <div v-if="selectedSpot?.isBooked === true">
    <h2>Spot is reserved for - {{ selectedSpot.fullName }}</h2>
    <DefaultButtonComponent
      text="Cancel Member's Reservation"
      type="button"
      @on-click="clickCancelMembersReservation"
      class="mr-1"
    ></DefaultButtonComponent>

    <button class="btn btn-primary mr-1" :disabled="true">Change Member's Spot</button>
    <button class="btn btn-primary mr-1" :disabled="true">Swap Spot</button>
    <button class="btn btn-primary mr-1" :disabled="true">Check-In</button>
    <button class="btn btn-primary mr-1" :disabled="true">Go to Profile</button>
  </div>

  <div v-if="assignUserToThisSpotVisible">
    <hr />
    <EnrollSelectedMemberComponent
      v-if="
        classInfo !== null &&
        selectedSpot.spotNumber !== null &&
        selectedSpot.spotNumber !== undefined
      "
      :class-id="classId"
      :spot-number="selectedSpot.spotNumber!"
      enrollButtonText="Assing"
      @after-enrolling="getClassInfo()"
    ></EnrollSelectedMemberComponent>
  </div>

  <!-- ERROR modal -->
  <ModalComponent
    title="ERROR"
    :message="errorModalData.message"
    :closable="false"
    v-if="errorModalData.isVisible"
    @on-ok="errorModalData.isVisible = false"
  >
  </ModalComponent>

  <ModalComponent
    v-if="confirmModalCancelReservationData.isVisible"
    title="Cancel Reservation?"
    message="Are you sure, you want to cancel the reservation?"
    :ok-loading="confirmModalCancelReservationData.isLoading"
    @on-cancel="confirmModalCancelReservationData.isVisible = false"
    @on-ok="removeUserFromClass()"
    :closable="false"
  >
  </ModalComponent>

  <ModalComponent
    v-if="confirmModalLateCancelReservationData.isVisible"
    title="Warning"
    :message="ERROR_LATE_CANCELLATION_REQUIRED"
    :isLoading="confirmModalLateCancelReservationData.isLoading"
    @on-cancel="confirmModalLateCancelReservationData.isVisible = false"
    ok-text="CONFIRM"
    @on-ok="confirmLateCancelation()"
    :closable="false"
  >
  </ModalComponent>

  <ModalComponent
    :title="successModalData.title"
    :message="successModalData.message"
    :closable="false"
    @on-ok="successModalData.isVisible = false"
    v-if="successModalData.isVisible"
  >
  </ModalComponent>
</template>
