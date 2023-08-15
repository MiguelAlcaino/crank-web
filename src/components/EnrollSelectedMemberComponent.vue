<script lang="ts">
interface IdentifiableUser {
  id?: string | null
  user?: User | null
}

interface User {
  email?: string | null
  firstName?: string | null
  lastName?: string | null
}
</script>

<script setup lang="ts">
import type { ApiService } from '@/services/apiService'
import { appStore } from '@/stores/appStorage'
import { inject, ref } from 'vue'

import ModalComponent from '@/components/ModalComponent.vue'

const apiService = inject<ApiService>('gqlApiService')!

const props = defineProps<{
  classId: string
}>()

const emits = defineEmits<{
  (e: 'afterEnrolling'): void
}>()

const query = ref<string>('')
const users = ref<IdentifiableUser[]>([])
const isLoading = ref<boolean>(false)
const selectedUserId = ref<string | null>(null)
const errorModalIsVisible = ref<boolean>(false)
const errorMessage = ref<string>('')
const paymentRequiredErrorModalIsVisible = ref<boolean>(false)

async function searchUser() {
  users.value = []
  selectedUserId.value = null

  if (query.value.length < 3) return

  isLoading.value = true

  users.value = await apiService.searchUser(appStore().site, query.value)

  isLoading.value = false
}

function onClickEnrollSelectedMember() {
  bookUserIntoClass(props.classId, selectedUserId.value!, true)
}

async function bookUserIntoClass(classId: string, userId: string, isPaymentRequired: boolean) {
  isLoading.value = true

  const response = await apiService.bookUserIntoClass(
    classId,
    userId,
    null,
    isPaymentRequired,
    false
  )

  isLoading.value = false

  if (response === 'BookClassSuccess') {
    selectedUserId.value = null
    paymentRequiredErrorModalIsVisible.value = false

    emits('afterEnrolling')
  } else if (response === 'PaymentRequiredError') {
    paymentRequiredErrorModalIsVisible.value = true
  } else {
    if (response === 'ClientIsOutsideSchedulingWindowError') {
      errorMessage.value = 'The class is outside the scheduling window.'
    } else if (response === 'ClientIsAlreadyBookedError') {
      errorMessage.value = 'The user is already booked in this class.'
    } else {
      errorMessage.value =
        "Ups! Sorry, we didn't see that coming!. Please try again or communicate wuth the team to resolve this issue."
    }

    errorModalIsVisible.value = true
  }
}
</script>

<template>
  <div class="input-group mb-3">
    <div class="input-group-prepend">
      <input
        class="form-control"
        v-model="query"
        @input="searchUser"
        placeholder="Please enter 3 or more characters"
      />
    </div>
    <select class="custom-select" v-model="selectedUserId">
      <option v-for="option in users" :key="option.id!" :value="option.id">
        {{ option.user!.firstName + ' ' + option.user!.lastName + ' - ' + option.user!.email }}
      </option>
    </select>
    <div class="input-group-append">
      <button
        class="btn btn-primary"
        type="button"
        :disabled="selectedUserId === null || selectedUserId === undefined || isLoading"
        @click="onClickEnrollSelectedMember()"
      >
        Enroll Selected Member
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
          v-if="isLoading"
        ></span>
      </button>
    </div>
  </div>

  <!-- PaymentRequiredError Modal -->
  <ModalComponent
    v-if="paymentRequiredErrorModalIsVisible"
    title="Warning"
    message="This user does not have any class packages purchases available for this class. Would you like to override the enrollment?"
    cancel-text="No"
    ok-text="Yes"
    @on-cancel="paymentRequiredErrorModalIsVisible = false"
    :ok-loading="isLoading"
    @on-ok="bookUserIntoClass(props.classId, selectedUserId!, false)"
  >
  </ModalComponent>

  <!-- Error Modal -->
  <ModalComponent
    v-if="errorModalIsVisible"
    title="Error"
    :message="errorMessage"
    :cancel-text="null"
    @on-ok="errorModalIsVisible = false"
  >
  </ModalComponent>
</template>

<style scoped></style>
