<script setup lang="ts">
import SpotMatrix from '@/components/SpotMatrix.vue'
import { SiteEnum, type ClassInfo, type BookableSpot, type IconPosition } from '@/gql/graphql'
import type { ApiService } from '@/services/apiService'
import { inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ErrorModal from '@/components/ErrorModal.vue'

interface BookableSpotClickedEvent {
  spotNumber: number | null
  isBooked: boolean
}

const route = useRoute()
const apiService = inject<ApiService>('gqlApiService')!

const classId = ref<string>('')
const isLoading = ref<boolean>(false)
const classInfo = ref<ClassInfo | null>(null)

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

/*
const classInfo = {
    matrix: [
        {
            __typename: 'BookableSpot',
            x: 0,
            y: 1,
            icon: "spot",
            enabled: true,
            spotInfo: {
                isBooked: true,
                spotNumber: 4,
                bookedSpotUserInfo: {
                    user: {
                        firstName: 'Gabriel',
                        lastName: 'Correa'
                    }
                }
            }
        },
        {
            __typename: 'BookableSpot',
            x: 2,
            y: 0,
            icon: "spot",
            enabled: true,
            spotInfo: {
                isBooked: true,
                spotNumber: 3,
                bookedSpotUserInfo: {
                    user: {
                        firstName: 'Maria Jose',
                        lastName: 'Henriquez'
                    }
                }
            }
        },
        {
            __typename: 'BookableSpot',
            x: 0,
            y: 0,
            icon: "spot",
            enabled: true,
            spotInfo: {
                isBooked: true,
                spotNumber: 1,
                bookedSpotUserInfo: {
                    user: {
                        firstName: 'Miguel',
                        lastName: 'Alcaino'
                    }
                }
            }
        },
        {
            __typename: 'BookableSpot',
            x: 1,
            y: 0,
            icon: "spot",
            enabled: true,
            spotInfo: {
                isBooked: true,
                spotNumber: 2,
                bookedSpotUserInfo: {
                    user: {
                        firstName: 'Sebastian',
                        lastName: 'Alcaino'
                    }
                }
            }
        },
        {
            __typename: 'IconPosition',
            x: 1,
            y: 1,
            icon: 'speaker'
        },
        {
            __typename: 'BookableSpot',
            x: 2,
            y: 1,
            icon: "spot",
            enabled: true,
            spotInfo: {
                isBooked: false,
                spotNumber: 5,
                bookedSpotUserInfo: null
            }
        },
    ]
}
*/

const selectedSpot = ref<{
  spotNumber?: number | null
  isBooked?: boolean | null
  fullName?: string | null
  enebled?: boolean | null
}>({
  spotNumber: null,
  isBooked: null,
  fullName: null,
  enebled: null
})

onMounted(() => {
  classId.value = route.params.id as string
  getClassInfo()
})

async function getClassInfo() {
  isLoading.value = true

  const classId = route.params.id as string
  classInfo.value = await apiService.getClassInfo(SiteEnum.Dubai, classId)
  isLoading.value = false
}

function spotClicked(event: BookableSpotClickedEvent) {
  for (let index = 0; index < classInfo.value!.matrix!.length; index++) {
    const element = classInfo.value!.matrix![index] as BookableSpot | IconPosition

    if (element.__typename == 'BookableSpot') {
      var bookableSpot = element as BookableSpot

      if (bookableSpot.spotInfo.spotNumber === event.spotNumber) {
        selectedSpot.value = {
          spotNumber: bookableSpot.spotInfo?.spotNumber,
          isBooked: bookableSpot.spotInfo?.isBooked,
          fullName:
            bookableSpot.spotInfo?.bookedSpotUserInfo?.user?.firstName ??
            '' + ' ' + bookableSpot?.spotInfo?.bookedSpotUserInfo?.user?.lastName ??
            '',
          enebled: bookableSpot.enabled
        }
        break
      }
    }
  }
}

const isEnablingDisablingSpot = ref<boolean>(false)

async function clickPutUnderMaintenance() {
  const classId = route.params.id as string

  isEnablingDisablingSpot.value = true

  const response = await apiService.disableSpot(classId, selectedSpot.value.spotNumber!)

  isEnablingDisablingSpot.value = false

  if (response === 'Success') {
    await getClassInfo()
    selectedSpot.value = { enebled: null, fullName: null, isBooked: null, spotNumber: null }
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
  const classId = route.params.id as string

  isEnablingDisablingSpot.value = true

  const response = await apiService.enableSpot(classId, selectedSpot.value.spotNumber!)

  isEnablingDisablingSpot.value = false

  if (response === 'Success') {
    await getClassInfo()
    selectedSpot.value = { enebled: null, fullName: null, isBooked: null, spotNumber: null }
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
  console.log('clickAssignUserToThisSpot')
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

  <div v-if="selectedSpot?.isBooked === false && selectedSpot.enebled === true">
    <h1>Choose an action :</h1>
    <button @click="clickAssignUserToThisSpot">Assign User to this Spot</button>
    <button @click="clickPutUnderMaintenance" :disabled="isEnablingDisablingSpot">
      Put under maintenance
    </button>
  </div>
  <div v-if="selectedSpot.enebled === false">
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

  <!-- ERROR modal -->
  <ErrorModal
    :isLoading="false"
    :message="errorModalData.message"
    :clickToClose="false"
    v-model="errorModalData.isVisible"
    @close="errorModalData.isVisible = false"
  >
  </ErrorModal>
</template>
