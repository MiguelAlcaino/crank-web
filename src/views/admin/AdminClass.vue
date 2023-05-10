<script setup lang="ts">
import SpotMatrix from '@/components/SpotMatrix.vue'
import {
  type BookableSpot,
  type ClassInfo,
  type IconPosition,
  type IdentifiableUser,
  SiteEnum
} from '@/gql/graphql'
import type { ApiService } from '@/services/apiService'
import { inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import ErrorModal from '@/components/ErrorModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

interface BookableSpotClickedEvent {
  spotNumber: number | null
  isBooked: boolean
}

const route = useRoute()

const { id } = route.params as { id: string }

const apiService = inject<ApiService>('gqlApiService')!
const isLoading = ref<boolean>(false)
const classInfo = ref<ClassInfo | null>(null)

const assignUserToThisSpotVisible = ref<boolean>(false)
const query = ref<string>('')
const searchingUsers = ref<boolean>(false)
const users = ref<IdentifiableUser[]>([])
const selectedUserId = ref<string | null>(null)
const assigningUserToClass = ref<boolean>(false)

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

const selectedSpot = ref<{
  spotNumber?: number | null
  isBooked?: boolean | null
  fullName?: string | null
  enabled?: boolean | null
}>({
  spotNumber: null,
  isBooked: null,
  fullName: null,
  enabled: null
})

onMounted(() => {
  getClassInfo()
})

async function getClassInfo() {
  isLoading.value = true
  classInfo.value = await apiService.getClassInfo(SiteEnum.Dubai, id)
  isLoading.value = false
}

function spotClicked(event: BookableSpotClickedEvent) {
  assignUserToThisSpotVisible.value = false

  for (let index = 0; index < classInfo.value!.matrix!.length; index++) {
    const element = classInfo.value!.matrix![index] as BookableSpot | IconPosition

    if (element.__typename == 'BookableSpot') {
      const bookableSpot = element as BookableSpot

      if (bookableSpot.spotInfo.spotNumber === event.spotNumber) {
        console.log(bookableSpot)
        selectedSpot.value = {
          spotNumber: bookableSpot.spotInfo?.spotNumber,
          isBooked: bookableSpot.spotInfo?.isBooked,
          fullName:
            (bookableSpot.spotInfo?.bookedSpotUserInfo?.user?.firstName ?? '') +
            ' ' +
            (bookableSpot?.spotInfo?.bookedSpotUserInfo?.user?.lastName ?? ''),
          enabled: bookableSpot.enabled
        }
        break
      }
    }
  }
}

const isEnablingDisablingSpot = ref<boolean>(false)

async function clickPutUnderMaintenance() {
  isEnablingDisablingSpot.value = true

  const response = await apiService.disableSpot(id, selectedSpot.value.spotNumber!)

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

  const response = await apiService.enableSpot(id, selectedSpot.value.spotNumber!)

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

  users.value = await apiService.searchUser(SiteEnum.Dubai, query.value)

  searchingUsers.value = false
}

function clickAssing() {
  if (selectedUserId.value) {
    bookUserIntoClass(id, selectedUserId.value, selectedSpot.value.spotNumber!, true)
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

  console.log(response)
  if (response === 'BookClassSuccess') {
    selectedSpot.value = { enabled: null, fullName: null, isBooked: null, spotNumber: null }
    confirmModalData.value.isVisible = false
    assignUserToThisSpotVisible.value = false
    await getClassInfo()
  } else if (response === 'PaymentRequiredError') {
    //TODO: PaymentRequiredError
    confirmModalData.value.isLoading = false
    confirmModalData.value.title = 'Override'
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
</script>

<template>
  <spot-matrix
    v-if="classInfo !== null && classInfo.matrix !== null"
    :matrix="classInfo.matrix"
    :show-user-in-spots="true"
    @click-spot="spotClicked"
  >
  </spot-matrix>

  <div v-if="selectedSpot?.isBooked === false && selectedSpot.enabled === true">
    <h1>Choose an action :</h1>
    <button @click="clickAssignUserToThisSpot">Assign User to this Spot</button>
    <button @click="clickPutUnderMaintenance" :disabled="isEnablingDisablingSpot">
      Put under maintenance
    </button>
  </div>
  <div v-if="selectedSpot.enabled === false">
    <h1>Spot is under maintenance</h1>
    <button @click="clickRecoverFromMaintenance" :disabled="isEnablingDisablingSpot">
      Recover from maintenance
    </button>
  </div>
  <div v-if="selectedSpot?.isBooked === true">
    <h1>Spot is reserved for - {{ selectedSpot.fullName }}</h1>
    <button>Cancel Member's Reservation</button>
    <button>Change Member's Spot</button>
    <button>Swap Spot</button>
    <button>Check-In</button>
    <button>Go to Profile</button>
  </div>

  <div v-if="assignUserToThisSpotVisible">
    <input v-model="query" @input="searchUser" placeholder="Please enter 3 or more characters" />
    <select v-model="selectedUserId">
      <option v-for="option in users" :key="option.id!" :value="option.id">
        {{ option.user!.firstName + ' ' + option.user!.lastName + ' - ' + option.user!.email }}
      </option>
    </select>
    <button
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
    @confirm="bookUserIntoClass(id, selectedUserId!, selectedSpot.spotNumber!, false)"
    :clickToClose="false"
  >
  </ConfirmModal>
</template>
