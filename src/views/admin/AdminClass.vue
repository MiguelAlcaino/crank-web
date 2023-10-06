<script lang="ts">
interface BookableSpotClickedEvent {
  spotNumber: number | null
  isBooked: boolean
}

interface ClassInfo {
  class: Class
  enrollments: Array<EnrollmentInfo>
  roomLayout?: RoomLayout
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
  /** @deprecated This should be removed from here to avoid loops. */
  user?: User
  spotInfo?: SpotInfo
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

import {
  ERROR_LATE_CANCELLATION_REQUIRED,
  ERROR_SPOT_NOT_FOUND,
  ERROR_UNKNOWN
} from '@/utils/errorMessages'

const route = useRoute()

const apiService = inject<ApiService>('gqlApiService')!
const isLoading = ref<boolean>(false)
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
})

async function getClassInfo() {
  selectedSpot.value = {}

  isLoading.value = true
  classInfo.value = (await apiService.getClassInfo(appStore().site, classId.value)) as ClassInfo
  isLoading.value = false

  totalSignedIn.value =
    classInfo.value?.enrollments.filter((x) => x.isCheckedIn === true).length ?? 0
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
    const classPosition = classInfo.value!.roomLayout!.matrix![index]

    if (classPosition.icon === PositionIconEnum.Spot) {
      if (classPosition.spotNumber === event.spotNumber) {
        var fullName = ''
        let isCheckedIn: boolean | undefined
        var enrollmentId: string | null | undefined

        if (classInfo.value?.enrollments != null) {
          for (let index = 0; index < classInfo.value?.enrollments.length; index++) {
            const enrollment = classInfo.value?.enrollments[index]
            isCheckedIn = enrollment.isCheckedIn
            if (classPosition.spotNumber === enrollment.spotInfo?.spotNumber && enrollment.user) {
              fullName =
                (enrollment.user?.firstName ?? '') + ' ' + (enrollment.user?.lastName ?? '')
              enrollmentId = enrollment.id
              break
            }
          }
        }

        selectedSpot.value = {
          spotNumber: classPosition.spotInfo?.spotNumber,
          isBooked: classPosition.spotInfo?.isBooked,
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
</script>

<template>
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

  <div class="row">
    <div class="col-md-12">
      <ChangeLayoutClass
        v-if="classInfo?.roomLayout?.id"
        :class-id="classId"
        :room-layout-id="classInfo.roomLayout.id"
        @after-changing-room-layout="getClassInfo()"
      ></ChangeLayoutClass>
      &nbsp;
      <ViewWaitlistEntries :class-id="classId"></ViewWaitlistEntries>
    </div>
  </div>
  <div class="row" v-if="classInfo !== null && classInfo.class.waitListAvailable === true">
    <div class="col-md-12">
      <hr />
      <EnrollSelectedMemberComponent
        :class-id="classId"
        v-if="classInfo !== null && classInfo.class.waitListAvailable === true"
        @after-enrolling="getClassInfo()"
        :spot-number="null"
        enrollButtonText="Enroll In Waitlist"
        :is-waitlist-booking="true"
      >
      </EnrollSelectedMemberComponent>
    </div>
  </div>

  <hr />
  <br />
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
    :is-waitlist-booking="false"
  >
  </EnrollSelectedMemberComponent>

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
    <CheckInCheckOutUserInClass
      v-if="selectedSpot.enrollmentId != null && selectedSpot.isCheckedIn != null"
      :enrollment-id="selectedSpot.enrollmentId"
      :is-checked-in="selectedSpot.isCheckedIn"
      @after-check-in-check-out="getClassInfo()"
    ></CheckInCheckOutUserInClass>
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
      enrollButtonText="Assign"
      @after-enrolling="getClassInfo()"
      :is-waitlist-booking="false"
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
    message="ARE YOU SURE, YOU WANT TO CANCEL THE RESERVATION?"
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
