<script setup lang="ts">
interface LateCancelledSpotInClassResult {
  code?: string
  success: boolean
}

import { inject, ref } from 'vue'

const apiService = inject<ApiService>('gqlApiService')!

import DefaultButtonComponent from '@/components/DefaultButtonComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import type { ApiService } from '@/services/apiService'
import { appStore } from '@/stores/appStorage'
import { ERROR_UNKNOWN } from '@/utils/errorMessages'

const props = defineProps<{
  waitlistEntryId: string
}>()

const emits = defineEmits<{
  (e: 'afterAcceptReject'): void
}>()

const isRejecting = ref<boolean>(false)
const isAccepting = ref<boolean>(false)

const confirmRejectModalIsVisible = ref<boolean>(false)
const confirmAcceptModalIsVisible = ref<boolean>(false)

const successModalIsVisible = ref<boolean>(false)
const errorModalIsVisible = ref<boolean>(false)
const successModalMessage = ref<string>('')
const errorModalMessage = ref<string>('')

async function acceptLateCancelledSpotInClass() {
  try {
    isAccepting.value = true

    const response = (await apiService.acceptLateCancelledSpotInClass(
      appStore().site,
      props.waitlistEntryId
    )) as LateCancelledSpotInClassResult

    console.log(response)

    if (response.success === true) {
      successModalMessage.value = 'CONGRATULATIONS! YOU HAVE BEEN ADDED TO THE CLASS.'
      successModalIsVisible.value = true
    } else {
      errorModalMessage.value = ERROR_UNKNOWN
      errorModalIsVisible.value = true
    }
  } catch (error) {
    console.log(error)
    errorModalMessage.value = ERROR_UNKNOWN
    errorModalIsVisible.value = true
  } finally {
    isAccepting.value = false
  }
}

async function rejectLateCancelledSpotInClass() {
  try {
    isRejecting.value = true

    const response = (await apiService.rejectLateCancelledSpotInClass(
      appStore().site,
      props.waitlistEntryId
    )) as LateCancelledSpotInClassResult

    console.log(response)

    if (response.success === true) {
      successModalMessage.value =
        'YOU HAVE REJECTED THE SPOT. YOU WILL BE REMOVED FROM THE WAITLIST'
      successModalIsVisible.value = true
    } else {
      errorModalMessage.value = ERROR_UNKNOWN
      errorModalIsVisible.value = true
    }
  } catch (error) {
    console.log(error)
    errorModalMessage.value = ERROR_UNKNOWN
    errorModalIsVisible.value = true
  } finally {
    isRejecting.value = false
  }
}

function acceptSuccessModal() {
  emits('afterAcceptReject')
  successModalIsVisible.value = false
}

function acceptErrorModal() {
  emits('afterAcceptReject')
  errorModalIsVisible.value = false
}
</script>

<template>
  <div class="row">
    <div class="col-md-6">
      <DefaultButtonComponent
        @on-click="confirmRejectModalIsVisible = true"
        :is-loading="isRejecting"
        :disabled="isAccepting"
        text="REJECT IT"
        type="button"
        :block="true"
        :variant="'secondary'"
      ></DefaultButtonComponent>
    </div>
    <div class="col-md-6">
      <DefaultButtonComponent
        @on-click="confirmAcceptModalIsVisible = true"
        :is-loading="isAccepting"
        :disabled="isRejecting"
        text="TAKE IT NOW!"
        type="button"
        :block="true"
      ></DefaultButtonComponent>
    </div>
  </div>

  <!-- Confirm Accept Modal -->
  <ModalComponent
    title="BOOK CLASS"
    message="ARE YOU SURE YOU WANT TO TAKE THIS CLASS?"
    cancel-text="CANCEL"
    ok-text="TAKE IT NOW!"
    :ok-loading="isAccepting"
    :closable="false"
    v-if="confirmAcceptModalIsVisible"
    @on-cancel="confirmAcceptModalIsVisible = false"
    @on-ok="acceptLateCancelledSpotInClass()"
  ></ModalComponent>

  <!-- COnform Reject Modal -->
  <ModalComponent
    title="REJECT CLASS"
    message="ARE YOU SURE YOU WANT TO REJECT THIS CLASS?"
    cancel-text="CANCEL"
    ok-text="REJECT IT"
    :ok-loading="isRejecting"
    :closable="false"
    v-if="confirmRejectModalIsVisible"
    @on-cancel="confirmRejectModalIsVisible = false"
    @on-ok="rejectLateCancelledSpotInClass()"
  ></ModalComponent>

  <!-- SUCCESS modal -->
  <ModalComponent
    title="SUCCESS"
    :message="successModalMessage"
    :closable="false"
    @on-ok="acceptSuccessModal()"
    :cancel-text="null"
    v-if="successModalIsVisible"
  >
  </ModalComponent>

  <!-- ERROR modal -->
  <ModalComponent
    :ok-loading="false"
    title="ERROR"
    :message="errorModalMessage"
    :closable="false"
    :cancel-text="null"
    v-if="errorModalIsVisible"
    @on-ok="acceptErrorModal()"
  >
  </ModalComponent>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped></style>
