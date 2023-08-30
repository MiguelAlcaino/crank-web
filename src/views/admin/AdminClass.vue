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

import type { BookableSpot, ClassInfo, IconPosition, IdentifiableUser } from '@/gql/graphql'

import type { ApiService } from '@/services/apiService'

import { appStore } from '@/stores/appStorage'

import SpotMatrix from '@/components/SpotMatrix.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import AdminBookedUsersList from '@/components/AdminBookedUsersList.vue'
import EnrollSelectedMemberComponent from '@/components/EnrollSelectedMemberComponent.vue'

import {
  ERROR_CLIENT_IS_OUTSIDE_SCHEDULING_WINDOW,
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
const query = ref<string>('')
const searchingUsers = ref<boolean>(false)
const users = ref<IdentifiableUser[]>([])
const selectedUserId = ref<string | null>(null)
const assigningUserToClass = ref<boolean>(false)

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

const isEnablingDisablingSpot = ref<boolean>(false)

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

function clickAssignUserToThisSpot() {
  assignUserToThisSpotVisible.value = true
}

async function searchUser() {
  users.value = []
  selectedUserId.value = null

  if (query.value.length < 3) return

  searchingUsers.value = true

  users.value = await apiService.searchUser(appStore().site, query.value)

  searchingUsers.value = false
}

function clickAssing() {
  if (selectedUserId.value) {
    bookUserIntoClass(classId.value, selectedUserId.value, selectedSpot.value.spotNumber!, true)
  }
}

async function bookUserIntoClass(
  classId: string,
  userId: string,
  spotNumber: number,
  isPaymentRequired: boolean
) {
  assigningUserToClass.value = true
  confirmModalData.value.isLoading = true

  const response = await apiService.bookUserIntoClass(
    classId,
    userId,
    spotNumber,
    isPaymentRequired,
    false
  )

  assigningUserToClass.value = false
  confirmModalData.value.isLoading = false

  if (response === 'BookClassSuccess') {
    selectedSpot.value = {
      enabled: null,
      fullName: null,
      isBooked: null,
      spotNumber: null,
      enrollmentId: null
    }
    confirmModalData.value.isVisible = false
    assignUserToThisSpotVisible.value = false
    await getClassInfo()
  } else if (response === 'PaymentRequiredError') {
    confirmModalData.value.isLoading = false
    confirmModalData.value.title = 'Warning'
    confirmModalData.value.message =
      'This user does not have any class packages purchases available for this class. Would you like to override the enrollment?'
    confirmModalData.value.isVisible = true
  } else if (response === 'ClientIsOutsideSchedulingWindowError') {
    errorModalData.value.message = ERROR_CLIENT_IS_OUTSIDE_SCHEDULING_WINDOW
    errorModalData.value.isVisible = true
  } else if (response === 'ClientIsAlreadyBookedError') {
    errorModalData.value.message = 'The user is already booked in this class.'
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
  ></EnrollSelectedMemberComponent>

  <AdminBookedUsersList
    v-if="classInfo !== null && classInfo.roomLayout === null && classInfo.enrollments !== null"
    :enrollments="classInfo.enrollments"
    :isLoading="false"
    @after-cancel-member-reservation="getClassInfo()"
  >
  </AdminBookedUsersList>

  <div v-if="selectedSpot?.isBooked === false && selectedSpot.enabled === true">
    <h1>Choose an action :</h1>
    <button class="btn btn-primary" @click="clickAssignUserToThisSpot">
      Assign User to this Spot
    </button>
    <button
      class="btn btn-primary"
      @click="clickPutUnderMaintenance"
      :disabled="isEnablingDisablingSpot"
    >
      Put under maintenance
    </button>
  </div>
  <div v-if="selectedSpot.enabled === false">
    <h1>Spot is under maintenance</h1>
    <button
      class="btn btn-primary"
      @click="clickRecoverFromMaintenance"
      :disabled="isEnablingDisablingSpot"
    >
      Recover from maintenance
    </button>
  </div>
  <div v-if="selectedSpot?.isBooked === true">
    <h1>Spot is reserved for - {{ selectedSpot.fullName }}</h1>
    <button class="btn btn-primary" @click="clickCancelMembersReservation">
      Cancel Member's Reservation
    </button>
    <button class="btn btn-primary" :disabled="true">Change Member's Spot</button>
    <button class="btn btn-primary" :disabled="true">Swap Spot</button>
    <button class="btn btn-primary" :disabled="true">Check-In</button>
    <button class="btn btn-primary" :disabled="true">Go to Profile</button>
  </div>

  <div v-if="assignUserToThisSpotVisible">
    <input v-model="query" @input="searchUser" placeholder="Please enter 3 or more characters" />
    <select v-model="selectedUserId">
      <option v-for="option in users" :key="option.id!" :value="option.id">
        {{ option.user!.firstName + ' ' + option.user!.lastName + ' - ' + option.user!.email }}
      </option>
    </select>
    <button
      class="btn btn-primary"
      @click="clickAssing"
      :disabled="selectedUserId === null || selectedUserId === undefined || assigningUserToClass"
    >
      Assing
    </button>
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
    v-if="confirmModalData.isVisible"
    :title="confirmModalData.title"
    :message="confirmModalData.message"
    :ok-loading="confirmModalData.isLoading"
    @on-cancel="confirmModalData.isVisible = false"
    @on-ok="bookUserIntoClass(classId, selectedUserId!, selectedSpot.spotNumber!, false)"
    :closable="false"
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
