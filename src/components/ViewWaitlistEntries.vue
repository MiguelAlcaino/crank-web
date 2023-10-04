<script lang="ts">
interface WaitlistEntry {
  id: string
  user: User
}

interface User {
  firstName: string
  lastName: string
}

interface RemoveFromWaitlistResult {
  code?: string | null
  success?: boolean | null
}
</script>

<script setup lang="ts">
import DefaultButtonComponent from '@/components/DefaultButtonComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import type { ApiService } from '@/services/apiService'
import { appStore } from '@/stores/appStorage'
import { ERROR_UNKNOWN } from '@/utils/errorMessages'
import { inject, ref } from 'vue'

const apiService = inject<ApiService>('gqlApiService')!

const props = defineProps<{
  classId: string
}>()

const emits = defineEmits<{
  (e: 'afterChangingRoomLayout'): void
}>()

const errorModalIsVisible = ref<boolean>(false)
const errorModalMessage = ref<string>('')
const modalIsVisible = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const isRemoving = ref<boolean>(false)
const waitlistEntries = ref<WaitlistEntry[]>([])

function openModal() {
  getWaitlistEntries()
  modalIsVisible.value = true
}

async function getWaitlistEntries() {
  waitlistEntries.value = []

  try {
    isLoading.value = true
    waitlistEntries.value = (await apiService.getClassWaitlistEntries(
      appStore().site,
      props.classId
    )) as WaitlistEntry[]
  } catch (error) {
    errorModalMessage.value = ERROR_UNKNOWN
    errorModalIsVisible.value = true
  } finally {
    isLoading.value = false
  }
}

async function removeUserFromWaitlist(waitlistEntryId: string) {
  //TODO: check method
  waitlistEntryId = "5465"
  try {
    isRemoving.value = true
    const response = (await apiService.removeUserFromWaitlist(
      waitlistEntryId
    )) as RemoveFromWaitlistResult

    if (response.success) {
        //TODO: add success modal and reload waitlist table
    } else {
      errorModalMessage.value = ERROR_UNKNOWN
        errorModalIsVisible.value = true
    }
  } catch (error) {
    errorModalMessage.value = ERROR_UNKNOWN
    errorModalIsVisible.value = true
  } finally {
    isRemoving.value = false
  }
}
</script>

<template>
  <DefaultButtonComponent
    text="View Waitlist"
    type="button"
    @on-click="openModal()"
  ></DefaultButtonComponent>

  <transition name="modal" v-if="modalIsVisible">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header border-0">
              <h5 class="modal-title">Waitlist Entries</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true" @click="modalIsVisible = false">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <table class="table table-sm">
                <thead>
                  <tr class="text-center">
                    <th>NO</th>
                    <th>FIRST NAME</th>
                    <th>LAST NAME</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in waitlistEntries" :key="index">
                    <td class="text-center align-middle">
                      {{ index + 1 }}
                    </td>
                    <td class="text-center align-middle">
                      {{ item.user.firstName.toUpperCase() }}
                    </td>
                    <td class="text-center align-middle">
                      {{ item.user.lastName.toUpperCase() }}
                    </td>
                    <td class="text-center align-middle">
                      <DefaultButtonComponent
                        text="REMOVE"
                        type="button"
                        @on-click="removeUserFromWaitlist(item.id)"
                        :is-loading="isRemoving"
                      ></DefaultButtonComponent>
                    </td>
                  </tr>
                  <tr v-if="waitlistEntries.length === 0 && !isLoading">
                    <td colspan="4" class="text-center">
                      <p>NO DATA AVAILABLE IN TABLE</p>
                    </td>
                  </tr>
                  <tr v-if="isLoading" class="text-center">
                    <td colspan="4">LOADING...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- ERROR modal -->
  <ModalComponent
    title="ERROR"
    :message="errorModalMessage"
    :closable="false"
    :cancel-text="null"
    v-if="errorModalIsVisible"
    @on-ok="errorModalIsVisible = false"
  >
  </ModalComponent>
</template>

<style scoped></style>
