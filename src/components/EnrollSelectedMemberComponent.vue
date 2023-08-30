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
import { ERROR_UNKNOWN } from '@/utils/errorMessages'

const apiService = inject<ApiService>('gqlApiService')!

const props = defineProps<{
  classId: string
}>()

const emits = defineEmits<{
  (e: 'afterEnrolling'): void
}>()

const users = ref<IdentifiableUser[]>([])
const isLoading = ref<boolean>(false)
const selectedUser = ref<IdentifiableUser | null>(null)
const errorModalIsVisible = ref<boolean>(false)
const errorMessage = ref<string>('')
const paymentRequiredErrorModalIsVisible = ref<boolean>(false)

function onClickEnrollSelectedMember() {
  bookUserIntoClass(props.classId, selectedUser.value!.id!, true)
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
    users.value = []
    selectedUser.value = null
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
  <br />
  <!-- PaymentRequiredError Modal -->
  <ModalComponent
    v-if="paymentRequiredErrorModalIsVisible"
    title="Warning"
    message="This user does not have any class packages purchases available for this class. Would you like to override the enrollment?"
    cancel-text="No"
    ok-text="Yes"
    @on-cancel="paymentRequiredErrorModalIsVisible = false"
    :ok-loading="isLoading"
    @on-ok="bookUserIntoClass(props.classId, selectedUser?.id!, false)"
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
