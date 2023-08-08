<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import dayjs from 'dayjs'

import type { BookableSpot, ClassInfo, IconPosition, IdentifiableUser } from '@/gql/graphql'

import type { ApiService } from '@/services/apiService'

import { appStore } from '@/stores/appStorage'

import SpotMatrix from '@/components/SpotMatrix.vue'
import CheckClassLayoutWithPIQ from '@/components/CheckClassLayoutWithPIQ.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import ErrorModal from '@/components/ErrorModal.vue'
import SuccessModal from '@/components/SuccessModal.vue'

interface BookableSpotClickedEvent {
  spotNumber: number | null
  isBooked: boolean
}

interface DoesRoomLayoutMatchResult {
  __typename: string
  currentRoomLayout?: RoomLayout
  suggestedRoomLayout?: RoomLayout
  matchesPIQRoomLayout?: boolean
  urlToCreateRoomLayout?: string
  urlToFixRoomLayout?: string
}

interface RoomLayout {
  __typename: 'RoomLayout'
  id: string
  name: string
}

const route = useRoute()

const apiService = inject<ApiService>('gqlApiService')!
const isLoading = ref<boolean>(false)
const checkClassLayoutWithPIQIsLoading = ref<boolean>(false)
const classInfo = ref<ClassInfo | null>(null)

const assignUserToThisSpotVisible = ref<boolean>(false)
const query = ref<string>('')
const searchingUsers = ref<boolean>(false)
const users = ref<IdentifiableUser[]>([])
const selectedUserId = ref<string | null>(null)
const assigningUserToClass = ref<boolean>(false)
const doesRoomLayoutMatchResult = ref<DoesRoomLayoutMatchResult | null>(null)

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
  doesClassMatchPIQLayout()
})

async function getClassInfo() {
  isLoading.value = true
  classInfo.value = await apiService.getClassInfo(appStore().site, classId.value)
  totalSignedIn.value = getTotalSignedIn()
  isLoading.value = false
}

function getClassId(): string {
  let mindbodyClass = inject<any | undefined>('mindbodyClass')
  if (mindbodyClass !== undefined) {
    console.log('ESTAMOS DENTRO!!!!')
    console.log(mindbodyClass)

    return mindbodyClass.id as string
  }

  return route.params.id as string
}

function getTotalSignedIn(): number {
  let totalSignedIn = 0
  if (classInfo.value && classInfo.value.matrix && classInfo.value.matrix.length > 0)
    for (let index = 0; index < classInfo.value.matrix.length; index++) {
      const classPosition = classInfo.value.matrix[index] as BookableSpot | IconPosition

      if ('spotInfo' in classPosition) {
        if (classPosition.spotInfo.isBooked) {
          totalSignedIn++
        }
      }
    }

  return totalSignedIn
}

function spotClicked(event: BookableSpotClickedEvent) {
  assignUserToThisSpotVisible.value = false

  for (let index = 0; index < classInfo.value!.matrix!.length; index++) {
    const element = classInfo.value!.matrix![index] as BookableSpot | IconPosition

    if (element.__typename == 'BookableSpot') {
      const bookableSpot = element as BookableSpot

      if (bookableSpot.spotInfo.spotNumber === event.spotNumber) {
        selectedSpot.value = {
          spotNumber: bookableSpot.spotInfo?.spotNumber,
          isBooked: bookableSpot.spotInfo?.isBooked,
          fullName:
            (bookableSpot.spotInfo?.bookedSpotUserInfo?.user?.firstName ?? '') +
            ' ' +
            (bookableSpot?.spotInfo?.bookedSpotUserInfo?.user?.lastName ?? ''),
          enabled: bookableSpot.enabled,
          enrollmentId: bookableSpot?.spotInfo?.bookedSpotUserInfo?.enrollmentId
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
    errorModalData.value.message =
      'The spot was not found in the list of disabled spots. This error is very unlikely to happen.'
    errorModalData.value.isVisible = true
  } else {
    errorModalData.value.message =
      "UPS! SORRY, WE DIDN'T SEE THAT COMING!. PLEASE TRY AGAIN OR COMMUNICATE WITH THE TEAM TO RESOLVE THIS ISSUE."
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
    errorModalData.value.message =
      'The spot was not found in the list of disabled spots. This error is very unlikely to happen.'
    errorModalData.value.isVisible = true
  } else {
    errorModalData.value.message =
      "UPS! SORRY, WE DIDN'T SEE THAT COMING!. PLEASE TRY AGAIN OR COMMUNICATE WITH THE TEAM TO RESOLVE THIS ISSUE."
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
    errorModalData.value.message = 'THE CLASS IS OUTSIDE THE SCHEDULING WINDOW.'
    errorModalData.value.isVisible = true
  } else if (response === 'ClientIsAlreadyBookedError') {
    errorModalData.value.message = 'The user is already booked in this class.'
    errorModalData.value.isVisible = true
  } else {
    errorModalData.value.message =
      "UPS! SORRY, WE DIDN'T SEE THAT COMING!. PLEASE TRY AGAIN OR COMMUNICATE WITH THE TEAM TO RESOLVE THIS ISSUE."
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
    errorModalData.value.message =
      "UPS! SORRY, WE DIDN'T SEE THAT COMING!. PLEASE TRY AGAIN OR COMMUNICATE WITH THE TEAM TO RESOLVE THIS ISSUE."
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
    errorModalData.value.message =
      "UPS! SORRY, WE DIDN'T SEE THAT COMING!. PLEASE TRY AGAIN OR COMMUNICATE WITH THE TEAM TO RESOLVE THIS ISSUE."
    errorModalData.value.isVisible = true
  }
}

// Match PIQ Layout
async function doesClassMatchPIQLayout() {
  checkClassLayoutWithPIQIsLoading.value = true
  try {
    var result = await apiService.doesClassMatchPIQLayout(appStore().site, classId.value)

    doesRoomLayoutMatchResult.value = result as DoesRoomLayoutMatchResult
  } catch (error) {
    doesRoomLayoutMatchResult.value = { __typename: 'UnknownError' } as DoesRoomLayoutMatchResult
  } finally {
    checkClassLayoutWithPIQIsLoading.value = false
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
  checkClassLayoutWithPIQIsLoading.value = true
  const result = await apiService.editClass({ classId: classId.value, roomLayoutId: null })
  checkClassLayoutWithPIQIsLoading.value = false

  if (result.__typename === 'EditClassSuccessResult') {
    getClassInfo()
    doesClassMatchPIQLayout()

    doesRoomLayoutMatchResult.value = null

    successModalData.value.title = 'Success'
    successModalData.value.message = 'The layout was removed successfully.'
    successModalData.value.isVisible = true
  } else {
    errorModalData.value.message =
      "UPS! SORRY, WE DIDN'T SEE THAT COMING!. PLEASE TRY AGAIN OR COMMUNICATE WITH THE TEAM TO RESOLVE THIS ISSUE."
    errorModalData.value.isVisible = true
  }
}

async function assignPiqId(piqClassId: string) {
  checkClassLayoutWithPIQIsLoading.value = true
  const result = await apiService.editClass({ classId: classId.value, piqClassId: piqClassId })
  checkClassLayoutWithPIQIsLoading.value = false

  if (result.__typename === 'EditClassSuccessResult') {
    getClassInfo()
    doesClassMatchPIQLayout()

    doesRoomLayoutMatchResult.value = null

    successModalData.value.title = 'Success'
    successModalData.value.message = 'PIQ ID assigned successfully.'
    successModalData.value.isVisible = true
  } else if (result.__typename === 'PIQClassNotFoundError') {
    errorModalData.value.message = 'PIQ Class ID Not Found.'
    errorModalData.value.isVisible = true
  } else {
    errorModalData.value.message =
      "UPS! SORRY, WE DIDN'T SEE THAT COMING!. PLEASE TRY AGAIN OR COMMUNICATE WITH THE TEAM TO RESOLVE THIS ISSUE."
    errorModalData.value.isVisible = true
  }
}

async function assignRoomLayoutId(roomLayoutId: string) {
  if (roomLayoutId) {
    checkClassLayoutWithPIQIsLoading.value = true
    const result = await apiService.editClass({
      classId: classId.value,
      roomLayoutId: roomLayoutId
    })
    checkClassLayoutWithPIQIsLoading.value = false

    if (result.__typename === 'EditClassSuccessResult') {
      getClassInfo()
      doesClassMatchPIQLayout()

      doesRoomLayoutMatchResult.value = null

      successModalData.value.title = 'Success'
      successModalData.value.message = 'Room layout assigned successfully.'
      successModalData.value.isVisible = true
    } else {
      errorModalData.value.message =
        "UPS! SORRY, WE DIDN'T SEE THAT COMING!. PLEASE TRY AGAIN OR COMMUNICATE WITH THE TEAM TO RESOLVE THIS ISSUE."
      errorModalData.value.isVisible = true
    }
  } else {
    errorModalData.value.message =
      "UPS! SORRY, WE DIDN'T SEE THAT COMING!. PLEASE TRY AGAIN OR COMMUNICATE WITH THE TEAM TO RESOLVE THIS ISSUE."
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

  <CheckClassLayoutWithPIQ
    :doesRoomLayoutMatchResult="doesRoomLayoutMatchResult"
    :isLoading="checkClassLayoutWithPIQIsLoading"
    @goToLayoutEditPage="goToLayoutEditPage"
    @removeLayout="removeLayout"
    @assignRoomLayoutId="assignRoomLayoutId"
    @assignPiqId="assignPiqId"
  >
  </CheckClassLayoutWithPIQ>

  <hr />
  <spot-matrix
    v-if="classInfo !== null && classInfo.matrix !== null"
    :matrix="classInfo.matrix"
    :show-user-in-spots="true"
    :selectedSpotNumber="selectedSpot?.spotNumber"
    @click-spot="spotClicked"
  >
  </spot-matrix>

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
  <ErrorModal
    :isLoading="false"
    :message="errorModalData.message"
    :clickToClose="false"
    v-model="errorModalData.isVisible"
    @close="errorModalData.isVisible = false"
  >
  </ErrorModal>

  <ConfirmModal
    v-model="confirmModalData.isVisible"
    :title="confirmModalData.title"
    :message="confirmModalData.message"
    :isLoading="confirmModalData.isLoading"
    @cancel="confirmModalData.isVisible = false"
    @confirm="bookUserIntoClass(classId, selectedUserId!, selectedSpot.spotNumber!, false)"
    :clickToClose="false"
  >
  </ConfirmModal>

  <ConfirmModal
    v-model="confirmModalCancelReservationData.isVisible"
    title="Cancel Reservation?"
    message="Are you sure, you want to cancel the reservation?"
    :isLoading="confirmModalCancelReservationData.isLoading"
    @cancel="confirmModalCancelReservationData.isVisible = false"
    @confirm="removeUserFromClass()"
    :clickToClose="false"
  >
  </ConfirmModal>

  <ConfirmModal
    v-model="confirmModalLateCancelReservationData.isVisible"
    title="Warning"
    message="You are outsade the early cancellation window. you can only make a late cancellaiton."
    :isLoading="confirmModalLateCancelReservationData.isLoading"
    @cancel="confirmModalLateCancelReservationData.isVisible = false"
    textConfirmButton="CONFIRM"
    @confirm="confirmLateCancelation()"
    :clickToClose="false"
  >
  </ConfirmModal>

  <SuccessModal
    :title="successModalData.title"
    :message="successModalData.message"
    :clickToClose="false"
    @accept="successModalData.isVisible = false"
    v-model="successModalData.isVisible"
  >
  </SuccessModal>
</template>
