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
import {
  ERROR_CLASS_IS_FULL,
  ERROR_CLIENT_IS_ALREADY_BOOKED_ADMIN,
  ERROR_CLIENT_IS_OUTSIDE_SCHEDULING_WINDOW,
  ERROR_UNKNOWN,
  ERROR_WAITLIST_FULL_ERROR
} from '@/utils/errorMessages'
import { SUCCESS_ADDED_USER_TO_WAITLIST } from '@/utils/successMessages'

const apiService = inject<ApiService>('gqlApiService')!

const props = defineProps<{
  classId: string
  spotNumber: number | null
  enrollButtonText: string
  isWaitlistBooking: boolean
}>()

const emits = defineEmits<{
  (e: 'afterEnrolling'): void
}>()

const users = ref<IdentifiableUser[]>([])
const isLoading = ref<boolean>(false)
const selectedUser = ref<IdentifiableUser | null>(null)
const errorModalIsVisible = ref<boolean>(false)
const errorMessage = ref<string>('')
const successModalIsVisible = ref<boolean>(false)
const successMessage = ref<string>('')
const paymentRequiredErrorModalIsVisible = ref<boolean>(false)

function onClickEnrollSelectedMember() {
  bookUserIntoClass(props.classId, selectedUser.value!.id!, props.spotNumber, true)
}

async function bookUserIntoClass(
  classId: string,
  userId: string,
  spotNumber: number | null,
  isPaymentRequired: boolean
) {
  isLoading.value = true

  const response = await apiService.bookUserIntoClass(
    classId,
    userId,
    spotNumber,
    isPaymentRequired,
    props.isWaitlistBooking
  )

  isLoading.value = false

  if (response === 'BookClassSuccess') {
    users.value = []
    selectedUser.value = null
    paymentRequiredErrorModalIsVisible.value = false

    emits('afterEnrolling')
  } else if (response === 'AddedToWaitlistSuccess') {
    users.value = []
    selectedUser.value = null
    paymentRequiredErrorModalIsVisible.value = false

    successMessage.value = SUCCESS_ADDED_USER_TO_WAITLIST
    successModalIsVisible.value = true

    emits('afterEnrolling')
  } else if (response === 'PaymentRequiredError') {
    paymentRequiredErrorModalIsVisible.value = true
  } else {
    if (response == 'ClassIsFullError') {
      errorMessage.value = ERROR_CLASS_IS_FULL
    } else if (response === 'ClientIsOutsideSchedulingWindowError') {
      errorMessage.value = ERROR_CLIENT_IS_OUTSIDE_SCHEDULING_WINDOW
    } else if (response === 'ClientIsAlreadyBookedError') {
      errorMessage.value = ERROR_CLIENT_IS_ALREADY_BOOKED_ADMIN
    } else if (response == 'WaitlistFullError') {
      errorMessage.value = ERROR_WAITLIST_FULL_ERROR
    } else {
      errorMessage.value = ERROR_UNKNOWN
    }

    errorModalIsVisible.value = true
  }
}

function selectItemEventHandler(item: IdentifiableUser) {
  selectedUser.value = item
}

async function onInputEventHandler(event: any) {
  users.value = []
  selectedUser.value = null

  if (event.input.length < 3) return

  isLoading.value = true

  users.value = await apiService.searchUser(appStore().site, event.input)

  isLoading.value = false
}

function onBlurEventHandler(event: any) {}

function itemProjectionFunction(item: any) {
  return item.user?.firstName + ' ' + item.user?.lastName + ' - ' + item.user?.email
}
</script>

<template>
  <div class="row">
    <div class="col-8">
      <vue3-simple-typeahead
        id="typeahead_users"
        class="form-control"
        placeholder="Please enter 3 or more characters"
        :items="users"
        :minInputLength="3"
        @selectItem="selectItemEventHandler"
        @onInput="onInputEventHandler"
        @onBlur="onBlurEventHandler"
        :itemProjection="itemProjectionFunction"
      >
        <template #list-item-text="slot"
          ><span v-html="slot.boldMatchText(slot.itemProjection(slot.item))"></span
        ></template>
      </vue3-simple-typeahead>
    </div>
    <div class="col-4">
      <button
        class="btn btn-primary"
        type="button"
        :disabled="selectedUser === null || selectedUser === undefined || isLoading"
        @click="onClickEnrollSelectedMember()"
      >
        {{ props.enrollButtonText }}
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
          v-if="isLoading"
        ></span>
      </button>
    </div>
  </div>
  <br />
  <!-- PaymentRequiredError Modal -->
  <ModalComponent
    v-if="paymentRequiredErrorModalIsVisible"
    title="Warning"
    message="This client has no credits in his account. Do you want to continue?"
    cancel-text="No"
    ok-text="Yes"
    @on-cancel="paymentRequiredErrorModalIsVisible = false"
    :ok-loading="isLoading"
    @on-ok="bookUserIntoClass(props.classId, selectedUser?.id!, props.spotNumber, false)"
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

  <!-- Success Modal -->
  <ModalComponent
    v-if="successModalIsVisible"
    title="SUCCESS"
    :message="successMessage"
    :cancel-text="null"
    @on-ok="successModalIsVisible = false"
  >
  </ModalComponent>
</template>

<style scoped></style>
