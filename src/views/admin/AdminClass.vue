<script lang="ts">
interface BookableSpotClickedEvent {
  spotNumber: number | null
  isBooked: boolean
}

interface ClassInfo {
  class: Class
  enrollments: Array<EnrollmentInfo>
  roomLayout?: RoomLayout
  onHoldSpots: number
}

interface RoomLayout {
  id: string
  name: string
  matrix?: Array<ClassPosition>
}

interface ClassPosition {
  x: number
  y: number
  icon: PositionIconEnum
  spotNumber?: number
  enabled?: boolean
  /** @deprecated Array of booked spots should be returned by other query to reduce complexity of creating SpotInfo instances. */
  spotInfo?: SpotInfo
}

interface Class {
  id: string
  name: string
  description: string
  instructorName: string
  startWithNoTimeZone: Date
  duration: number
  waitListAvailable: boolean
}

interface EnrollmentInfo {
  enrollmentDateTime: Date
  enrollmentStatus: EnrollmentStatusEnum
  id: string
  isCheckedIn?: boolean
  identifiableUser?: IdentifiableUser
  /** @deprecated Array of booked spots should be returned by other query to reduce complexity of creating SpotInfo instances. */
  spotInfo?: SpotInfo
  spotNumber?: number
}

interface IdentifiableUser {
  id?: string
  user?: User
}

interface SpotInfo {
  /** @deprecated Array of booked spots should be returned by other query to reduce complexity of creating SpotInfo instances. */
  isBooked: boolean
  spotNumber: number
}

interface User {
  email: string
  firstName: string
  lastName: string
  leaderboardUsername?: string
}

enum EnrollmentStatusEnum {
  Active = 'active',
  Cancelled = 'cancelled',
  LateCancelled = 'lateCancelled',
  Unknown = 'unknown',
  Waitlisted = 'waitlisted'
}

enum PositionIconEnum {
  Empty = 'empty',
  Fan = 'fan',
  Instructor = 'instructor',
  Speaker = 'speaker',
  Spot = 'spot',
  Tv = 'tv'
}

enum SpotActionEnum {
  none,
  asignUserToSpot,
  changeMemberSpot,
  swapSpot
}
</script>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import dayjs from 'dayjs'

import type { ApiService } from '@/services/apiService'

import { appStore } from '@/stores/appStorage'

import SpotMatrix from '@/components/SpotMatrix.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import AdminBookedUsersList from '@/components/AdminBookedUsersList.vue'
import EnrollSelectedMemberComponent from '@/components/EnrollSelectedMemberComponent.vue'
import DefaultButtonComponent from '@/components/DefaultButtonComponent.vue'
import ChangeLayoutClass from '@/components/ChangeLayoutClass.vue'
import ViewWaitlistEntries from '@/components/ViewWaitlistEntries.vue'
import CheckInCheckOutUserInClass from '@/components/CheckInCheckOutUserInClass.vue'
import SetOnHoldSpots from '@/components/SetOnHoldSpots.vue'

import {
  ERROR_CLIENT_IS_OUTSIDE_SCHEDULING_WINDOW,
  ERROR_LATE_CANCELLATION_REQUIRED,
  ERROR_SPOT_ALREADY_RESERVED,
  ERROR_SPOT_NOT_FOUND,
  ERROR_TRYING_TO_MOVE_SAME_SPOT,
  ERROR_UNKNOWN
} from '@/utils/errorMessages'
import { authService } from '@/services/authService'
import { Role } from '@/utils/userRoles'

const route = useRoute()

const apiService = inject<ApiService>('gqlApiService')!
const isLoading = ref<boolean>(false)
const classInfo = ref<ClassInfo | null>(null)
const enrollments = ref<EnrollmentInfo[]>([])

const isEnablingDisablingSpot = ref<boolean>(false)
const changingMemberSpot = ref<boolean>(false)

const classId = ref<string>('')
const totalSignedIn = ref<number>(0)

const spotAction = ref<SpotActionEnum>(SpotActionEnum.none)

const userCanModifyClass = ref<boolean>(false)

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
  isCheckedIn?: boolean
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

  userCanModifyClass.value = authService.userHasRole(Role.ROLE_STAFF)
})

async function getClassInfo() {
  selectedSpot.value = {}

  isLoading.value = true
  classInfo.value = (await apiService.getClassInfoAdmin(
    appStore().site,
    classId.value
  )) as ClassInfo

  enrollments.value =
    classInfo.value?.enrollments.filter(
      (x) =>
        x.enrollmentStatus !== EnrollmentStatusEnum.Cancelled &&
        x.enrollmentStatus !== EnrollmentStatusEnum.LateCancelled
    ) ?? []

  isLoading.value = false

  totalSignedIn.value = enrollments.value?.filter((x) => x.isCheckedIn === true).length ?? 0
}

function getClassId(): string {
  let mindbodyClass = inject<any | undefined>('mindbodyClass')
  if (mindbodyClass !== undefined) {
    return mindbodyClass.id as string
  }

  return route.params.id as string
}

async function spotClicked(event: BookableSpotClickedEvent) {
  if (spotAction.value === SpotActionEnum.changeMemberSpot) {
    await changeSelectedMemberSpot(event.spotNumber!)
  }
  if (spotAction.value === SpotActionEnum.swapSpot) {
    await swapSpot(event.spotNumber!)
  } else {
    spotAction.value = SpotActionEnum.none

    for (let index = 0; index < classInfo.value!.roomLayout!.matrix!.length; index++) {
      const classPosition = classInfo.value!.roomLayout!.matrix![index]

      if (classPosition.icon === PositionIconEnum.Spot) {
        if (classPosition.spotNumber === event.spotNumber) {
          let isBooked = false
          let fullName = ''
          let isCheckedIn: boolean | undefined
          let enrollmentId: string | null | undefined

          if (enrollments.value != null) {
            for (let index = 0; index < enrollments.value?.length; index++) {
              const enrollment = enrollments.value[index]
              isCheckedIn = enrollment.isCheckedIn
              if (
                classPosition.spotNumber === enrollment.spotNumber &&
                enrollment.identifiableUser?.user
              ) {
                isBooked = true
                fullName =
                  (enrollment.identifiableUser?.user?.firstName ?? '') +
                  ' ' +
                  (enrollment.identifiableUser?.user?.lastName ?? '')
                enrollmentId = enrollment.id
                break
              }
            }
          }

          selectedSpot.value = {
            spotNumber: classPosition.spotNumber,
            isBooked: isBooked,
            fullName: fullName,
            enabled: classPosition.enabled,
            enrollmentId: enrollmentId,
            isCheckedIn: isCheckedIn
          }
          break
        }
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
    await getClassInfo()
  } else if (response === 'LateCancellationRequiredError') {
    confirmModalLateCancelReservationData.value.isLoading = false
    confirmModalLateCancelReservationData.value.isVisible = true
  } else {
    errorModalData.value.message = ERROR_UNKNOWN
    errorModalData.value.isVisible = true
  }
}

async function changeSelectedMemberSpot(newSpotNumber: number) {
  changingMemberSpot.value = true

  try {
    const response = await apiService.editEnrollment(appStore().site, {
      enrollmentId: selectedSpot.value.enrollmentId!,
      newSpotNumber: newSpotNumber
    })

    if (response.__typename !== 'Enrollment') {
      if (response.__typename === 'SpotAlreadyReservedError') {
        errorModalData.value.message = ERROR_SPOT_ALREADY_RESERVED
      } else if (response.__typename === 'ClientIsOutsideSchedulingWindowError') {
        errorModalData.value.message = ERROR_CLIENT_IS_OUTSIDE_SCHEDULING_WINDOW
      } else if (response.__typename === 'TryToSwitchToSameSpotError') {
        errorModalData.value.message = ERROR_TRYING_TO_MOVE_SAME_SPOT
      } else {
        errorModalData.value.message = ERROR_UNKNOWN
      }
      errorModalData.value.isVisible = true
    }
  } catch (error) {
    errorModalData.value.message = ERROR_UNKNOWN
    errorModalData.value.isVisible = true
  } finally {
    selectedSpot.value = {}
    spotAction.value = SpotActionEnum.none
    await getClassInfo()
    changingMemberSpot.value = false
  }
}

async function swapSpot(newSpotNumber: number) {
  changingMemberSpot.value = true

  try {
    const response = await apiService.swapSpot(appStore().site, {
      enrollmentId: selectedSpot.value.enrollmentId!,
      newSpotNumber: newSpotNumber
    })

    if (response.__typename !== 'SwapSpotSuccess') {
      if (response.__typename === 'TryToSwitchToSameSpotError') {
        errorModalData.value.message = ERROR_TRYING_TO_MOVE_SAME_SPOT
      }

      errorModalData.value.isVisible = true
    }
  } catch (error) {
    errorModalData.value.message = ERROR_UNKNOWN
    errorModalData.value.isVisible = true
  } finally {
    selectedSpot.value = {}
    spotAction.value = SpotActionEnum.none
    await getClassInfo()
    changingMemberSpot.value = false
  }
}
</script>

<template>
  <!-- Class Description -->
  <div class="row">
    <div class="col-md-12">
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
    </div>
  </div>
  <h6 v-html="classInfo?.class?.description"></h6>

  <!-- Change Layout Class and View Waitlist Entries Options -->
  <div class="row" v-if="userCanModifyClass">
    <div class="col-md-12">
      <ChangeLayoutClass
        v-if="classInfo"
        :class-id="classId"
        :room-layout-id="classInfo?.roomLayout?.id"
        @after-changing-room-layout="getClassInfo()"
      ></ChangeLayoutClass>
      &nbsp;
      <ViewWaitlistEntries :class-id="classId"></ViewWaitlistEntries>
      &nbsp;
      <SetOnHoldSpots
        v-if="classInfo"
        :class-id="classId"
        @after-set-on-hold-spots="getClassInfo()"
        :on-hold-spots="classInfo?.onHoldSpots"
      ></SetOnHoldSpots>
    </div>
  </div>

  <!-- Enroll in Waitlist -->
  <div class="row" v-if="classInfo !== null && classInfo.class.waitListAvailable === true">
    <div class="col-md-12">
      <hr />
      <EnrollSelectedMemberComponent
        :class-id="classId"
        v-if="classInfo !== null && classInfo.class.waitListAvailable === true"
        @after-enrolling="getClassInfo()"
        :spot-number="null"
        enrollButtonText="ADD TO WAITLIST"
        :is-waitlist-booking="true"
      >
      </EnrollSelectedMemberComponent>
    </div>
  </div>

  <hr />
  <br />
  <!-- Matrix -->
  <SpotMatrix
    v-if="
      classInfo !== null && classInfo.roomLayout !== null && classInfo.roomLayout?.matrix !== null
    "
    :matrix="classInfo.roomLayout!.matrix!"
    :show-user-in-spots="true"
    :selectedSpotNumber="selectedSpot?.spotNumber"
    @click-spot="spotClicked"
    :enrollments="enrollments"
    :spot-action="spotAction"
    :spot-selection-is-disabled="!userCanModifyClass"
  >
  </SpotMatrix>

  <!-- Enroll without matrix option -->
  <EnrollSelectedMemberComponent
    :class-id="classId"
    v-if="
      classInfo !== null &&
      classInfo.roomLayout === null &&
      classInfo.enrollments !== null &&
      userCanModifyClass
    "
    @after-enrolling="getClassInfo()"
    :spot-number="null"
    enrollButtonText="BOOK"
    :is-waitlist-booking="false"
  >
  </EnrollSelectedMemberComponent>

  <!-- List enrollments -->
  <AdminBookedUsersList
    v-if="classInfo !== null && classInfo.roomLayout === null && classInfo.enrollments !== null"
    :enrollments="enrollments"
    :isLoading="false"
    @after-cancel-member-reservation="getClassInfo()"
    :show-edit-options="userCanModifyClass"
  >
  </AdminBookedUsersList>

  <div v-if="userCanModifyClass">
    <!-- Select empty spot options -->
    <div v-if="selectedSpot?.isBooked === false && selectedSpot.enabled === true">
      <h2>Choose an action :</h2>
      <DefaultButtonComponent
        text="ASSIGN CLIENT"
        type="button"
        @on-click="spotAction = SpotActionEnum.asignUserToSpot"
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
    <!-- Select under manteince spot options -->
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

    <!-- Select booked spot options -->
    <div v-if="selectedSpot?.isBooked === true">
      <h2>Spot is reserved for - {{ selectedSpot.fullName }}</h2>
      <!-- CCANCEL BOOKING Button -->
      <DefaultButtonComponent
        v-if="
          spotAction !== SpotActionEnum.changeMemberSpot && spotAction !== SpotActionEnum.swapSpot
        "
        text="CANCEL BOOKING"
        type="button"
        @on-click="clickCancelMembersReservation"
        class="mr-1"
      ></DefaultButtonComponent>
      <!-- CHANGE SPOT button -->
      <DefaultButtonComponent
        text="CHANGE SPOT"
        :is-loading="changingMemberSpot"
        type="button"
        :disabled="spotAction === SpotActionEnum.changeMemberSpot"
        @on-click="spotAction = SpotActionEnum.changeMemberSpot"
        v-if="spotAction !== SpotActionEnum.swapSpot"
        class="mr-1"
      >
      </DefaultButtonComponent>

      <!-- Swap Spot Button -->
      <DefaultButtonComponent
        type="button"
        text="Swap Spot"
        :is-loading="changingMemberSpot"
        :disabled="spotAction === SpotActionEnum.swapSpot"
        v-if="spotAction !== SpotActionEnum.changeMemberSpot"
        @on-click="spotAction = SpotActionEnum.swapSpot"
        class="mr-1"
      >
      </DefaultButtonComponent>

      <!-- Cancel button  -->
      <DefaultButtonComponent
        v-if="
          spotAction === SpotActionEnum.changeMemberSpot || spotAction === SpotActionEnum.swapSpot
        "
        :disabled="changingMemberSpot"
        text="Cancel"
        type="button"
        @on-click="spotAction = SpotActionEnum.none"
      ></DefaultButtonComponent>

      <!-- Check In - Out button -->
      <CheckInCheckOutUserInClass
        v-if="
          selectedSpot.enrollmentId != null &&
          selectedSpot.isCheckedIn != null &&
          spotAction !== SpotActionEnum.changeMemberSpot &&
          spotAction !== SpotActionEnum.swapSpot
        "
        :enrollment-id="selectedSpot.enrollmentId"
        :is-checked-in="selectedSpot.isCheckedIn"
        @after-check-in-check-out="getClassInfo()"
      ></CheckInCheckOutUserInClass>
      <button
        class="btn btn-primary mr-1"
        :disabled="true"
        v-if="
          spotAction !== SpotActionEnum.changeMemberSpot && spotAction !== SpotActionEnum.swapSpot
        "
      >
        Go to Profile
      </button>
    </div>

    <div v-if="spotAction === SpotActionEnum.asignUserToSpot">
      <hr />
      <EnrollSelectedMemberComponent
        v-if="
          classInfo !== null &&
          selectedSpot.spotNumber !== null &&
          selectedSpot.spotNumber !== undefined
        "
        :class-id="classId"
        :spot-number="selectedSpot.spotNumber!"
        enrollButtonText="Assign"
        @after-enrolling="getClassInfo()"
        :is-waitlist-booking="false"
      ></EnrollSelectedMemberComponent>
    </div>
  </div>

  <!----------------------------- Modals ----------------------------->
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
    title="CANCEL BOOKING"
    message="Are you sure you want to proceed?"
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
