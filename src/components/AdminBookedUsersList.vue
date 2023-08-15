<script lang="ts">
interface EnrollmentInfo {
  id: string
  enrollmentStatus?: string
  enrollmentDateTime?: string
  user?: User | null
}

interface User {
  firstName: string
  lastName: string
}
</script>

<script setup lang="ts">
import { inject, ref } from 'vue'
import ModalComponent from '@/components/ModalComponent.vue'
import type { ApiService } from '@/services/apiService'

defineProps<{
  enrollments: EnrollmentInfo[]
  isLoading: boolean
}>()

const emits = defineEmits<{
  (e: 'afterCancelMemberReservation'): void
}>()

const apiService = inject<ApiService>('gqlApiService')!

const selectedEnrollmentId = ref<string | null>(null)
const removingUserFromClass = ref<boolean>(false)
const modalCancelReservationIsVisible = ref<boolean>(false)
const modalLateCancelIsVisible = ref<boolean>(false)
const errorModalIsVisible = ref<boolean>(false)

function onClickCheckInOut() {
  //TODO: add check in and check out functionality
}

function onClickCancelMemberReservation(enrollmentId: string) {
  removingUserFromClass.value = false
  selectedEnrollmentId.value = enrollmentId
  modalCancelReservationIsVisible.value = true
}

function onClickViewProfile() {
  //TODO: view profile functionality
}

function onClickConfirmCancelMemberReservation() {
  removeUserFromClass(selectedEnrollmentId.value!, false)
}

function onClickConfirmLateCancelMemberReservation() {
  removeUserFromClass(selectedEnrollmentId.value!, true)
}

async function removeUserFromClass(enrollmentId: string, lateCancel: boolean) {
  removingUserFromClass.value = true
  const response = await apiService.removeUserFromClass(enrollmentId, lateCancel)
  removingUserFromClass.value = false

  modalCancelReservationIsVisible.value = false
  modalLateCancelIsVisible.value = false

  if (response === 'CancelUserEnrollmentSuccess') {
    emits('afterCancelMemberReservation')
  } else if (response === 'LateCancellationRequiredError') {
    modalCancelReservationIsVisible.value = false
    modalLateCancelIsVisible.value = true
  } else {
    errorModalIsVisible.value = true
  }
}
</script>

<template>
  <!-- Enrollments -->
  <table class="table">
    <thead>
      <tr>
        <th>FIRST NAME</th>
        <th>LAST NAME</th>
        <th>SIGN IN</th>
        <th>CANCEL RESERVATION</th>
        <th>VIEW PROFILE</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in enrollments" v-bind:key="item.id" v-bind:index="index">
        <td>{{ item.user?.firstName }}</td>
        <td>{{ item.user?.lastName }}</td>
        <td>
          <button class="btn btn-primary" type="button">Check - In</button>
        </td>
        <td>
          <button
            class="btn btn-primary"
            type="button"
            @click="onClickCancelMemberReservation(item.id)"
          >
            Cancel Member's Reservation
          </button>
        </td>
        <td>
          <button class="btn btn-primary" type="button">View Profile</button>
        </td>
      </tr>
      <tr v-if="!isLoading && enrollments.length === 0">
        <td colspan="4" class="tableMessageNoRecords">There are no users enrolled in this class</td>
      </tr>
    </tbody>
  </table>

  <!-- Modal Cancel Reservation? -->
  <ModalComponent
    v-if="modalCancelReservationIsVisible"
    title="Cancel Reservation?"
    message="Are you sure, you want to cancel the reservation?"
    cancel-text="No"
    ok-text="Yes"
    :ok-loading="removingUserFromClass"
    @on-cancel="modalCancelReservationIsVisible = false"
    @on-ok="onClickConfirmCancelMemberReservation()"
  >
  </ModalComponent>

  <!-- Modal Late Cancel -->
  <ModalComponent
    v-if="modalLateCancelIsVisible"
    title="Warning"
    message="You are outsade the early cancellation window. you can only make a late cancellaiton."
    cancel-button-text="No"
    confirm-button-text="Confirm"
    @cancel="modalLateCancelIsVisible = false"
    :ok-loading="removingUserFromClass"
    @confirm="onClickConfirmLateCancelMemberReservation()"
  >
  </ModalComponent>

  <!-- Ups Error Modal -->
  <ModalComponent
    v-if="errorModalIsVisible"
    title="Error"
    message="Ups! Sorry, we didn't see that coming!. Please try again or communicate wuth the team to resolve this issue."
    :cancel-text="null"
    @on-ok="errorModalIsVisible = false"
  >
  </ModalComponent>
</template>

<style scoped>
.tableMessageNoRecords {
  text-align: center;
}
</style>
