<script lang="ts">
interface ResetPasswordLinkSentSuccessfully {
  __typename: 'ResetPasswordLinkSentSuccessfully'
  status: boolean
}

interface TooManyResetPasswordLinkRequestsError {
  __typename: 'TooManyResetPasswordLinkRequestsError'
  availableAgainAt?: Date
  code: string
}
</script>

<script setup lang="ts">
import type { ApiService } from '@/services/apiService'
import useVuelidate from '@vuelidate/core'
import { email, helpers, required } from '@vuelidate/validators'
import { computed, inject, reactive, ref } from 'vue'
import DefaultButtonComponent from '@/components/DefaultButtonComponent.vue'
import { appStore } from '@/stores/appStorage'

import ModalComponent from '@/components/ModalComponent.vue'
import { ERROR_UNKNOWN } from '@/utils/errorMessages'
import { SUCCESS_RESET_PASSWORD_LINK_SENT } from '@/utils/successMessages'
import dayjs from 'dayjs'
import router from '@/router'

const apiService = inject<ApiService>('gqlApiService')!

const sendingEmail = ref<boolean>(false)
const errorModalIsVisible = ref<boolean>(false)
const successModalIsVisible = ref<boolean>(false)

const errorMessage = ref<string>('')

const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage('Email is required', required),
      email: helpers.withMessage('The email address is not valid', email)
    }
  }
})

const formData = reactive({
  email: ''
})

const v$ = useVuelidate(rules, formData)

const submitForm = async () => {
  const isValid = await v$.value.$validate()

  if (isValid) {
    requestPasswordLink()
  } else {
    console.error('error form')
  }
}

async function requestPasswordLink() {
  sendingEmail.value = true
  const response = (await apiService.requestPasswordLink(appStore().site, formData.email)) as
    | ResetPasswordLinkSentSuccessfully
    | TooManyResetPasswordLinkRequestsError
    | null
  sendingEmail.value = false

  if (response) {
    if (response.__typename === 'ResetPasswordLinkSentSuccessfully') {
      successModalIsVisible.value = true
    } else if (response.__typename === 'TooManyResetPasswordLinkRequestsError') {
      errorMessage.value =
        'A RESET LINK HAS ALREADY BEEN SENT TO YOU. PLEASE TRY AGAIN AFTER ' +
        dayjs(response.availableAgainAt).format('DD/MM/YYYY h:mm a')
      errorModalIsVisible.value = true
    } else {
      errorMessage.value = ERROR_UNKNOWN
      errorModalIsVisible.value = true
    }
  } else {
    errorMessage.value = ERROR_UNKNOWN
    errorModalIsVisible.value = true
  }
}
</script>

<template>
  <div class="d-flex justify-content-center h-10">
    <div class="card">
      <div class="card-body mt-3">
        <div class="row form-inline">
          <div class="col-md-12 text-center">
            <h2>Forgot Password</h2>
          </div>
        </div>
        <p class="mt-3">
          Please enter your CRANK account email address and we will send you a reset link.
        </p>
        <form @submit.prevent="submitForm" autocomplete="off">
          <div class="form-row">
            <div class="col-md-12 mb-5">
              <!-- email -->
              <label for="emailRegistration" class="input-label">Email *</label>
              <input
                type="email"
                v-model="formData.email"
                class="form-control"
                id="emailRegistration"
                maxlength="200"
                placeholder="Email"
                required
              />
              <small
                v-for="error in v$.email.$errors"
                :key="error.$uid"
                class="form-text"
                style="color: red"
              >
                {{ error.$message }}
              </small>
            </div>
          </div>
          <br />
          <!--submit button-->
          <div class="form-row">
            <div class="col-md-12 mb-3">
              <DefaultButtonComponent
                type="submit"
                text="OK"
                :is-loading="sendingEmail"
                :block="true"
              >
              </DefaultButtonComponent>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Success Modal -->
  <ModalComponent
    title="CONFIRMATION"
    :message="SUCCESS_RESET_PASSWORD_LINK_SENT"
    :closable="false"
    @on-ok="router.replace({ name: 'login' })"
    :cancel-text="null"
    v-if="successModalIsVisible"
  >
  </ModalComponent>

  <!-- Error Modal -->
  <ModalComponent
    title="Error"
    :message="errorMessage"
    :closable="false"
    v-if="errorModalIsVisible"
    @on-ok="router.replace({ name: 'login' })"
    :cancel-text="null"
  >
  </ModalComponent>
</template>

<style scoped>
.page-login-v3 .panel .panel-body {
  padding: 50px 40px 40px;
}

.card {
  height: 613px;
  margin-top: auto;
  margin-bottom: auto;
  width: 400px;
}
</style>
