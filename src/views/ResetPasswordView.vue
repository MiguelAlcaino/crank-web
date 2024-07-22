<script lang="ts">
interface ResetPasswordSuccess {
  __typename: 'ResetPasswordSuccess'
  status: boolean
}

interface PasswordsDontMatchError {
  __typename: 'PasswordsDontMatchError'
  code: string
}
</script>

<script setup lang="ts">
import type { ApiService } from '@/services/apiService'
import useVuelidate from '@vuelidate/core'
import { helpers, minLength, required, sameAs } from '@vuelidate/validators'
import { computed, inject, onMounted, reactive, ref } from 'vue'
import DefaultButtonComponent from '@/components/DefaultButtonComponent.vue'

import ModalComponent from '@/components/ModalComponent.vue'
import {
  ERROR_EXPIRED_RESET_PASSWORD_TOKEN,
  ERROR_INVALID_TOKEN,
  ERROR_UNKNOWN
} from '@/utils/errorMessages'
import { SUCCESS_RESET_PASSWORD } from '@/utils/successMessages'
import router from '@/router'
import { useRoute } from 'vue-router'
import { authService } from '@/services/authService'
import { appStore } from '@/stores/appStorage'

const route = useRoute()

onMounted(() => {
  const token = route.query.token as string
  validateResetPasswordToken(token)
})

const apiService = inject<ApiService>('gqlApiService')!

const sendingEmail = ref<boolean>(false)
const validatingToken = ref<boolean>(false)
const errorValidateTokenModalIsVisible = ref<boolean>(false)
const successModalIsVisible = ref<boolean>(false)
const errorMessage = ref<string>('')
const errorModalVisible = ref<boolean>(false)

const passwordIsVisible = ref<boolean>(false)
const confirmPasswordIsVisible = ref<boolean>(false)

const checkPass = helpers.regex(/^(?=.*[a-zA-Z])(?=.*\d).+$/)

const rules = computed(() => {
  return {
    password: {
      required: helpers.withMessage('Field is required', required),
      minLength: helpers.withMessage(
        'The password must contain at least 8 characters',
        minLength(8)
      ),
      checkPass: helpers.withMessage('The password must contain a letter and a number', checkPass)
    },
    confirmPassword: {
      required: helpers.withMessage('Field is required', required),
      sameAs: helpers.withMessage(
        'The password confirmation does not match',
        sameAs(formData.password)
      )
    }
  }
})

const formData = reactive({
  password: '',
  confirmPassword: ''
})

const v$ = useVuelidate(rules, formData)

const submitForm = async () => {
  const isValid = await v$.value.$validate()

  if (isValid) {
    resetPasswordForCurrentUser()
  } else {
    console.error('error form')
  }
}

async function resetPasswordForCurrentUser() {
  sendingEmail.value = true
  const response = (await apiService.resetPasswordForCurrentUser(
    formData.password,
    formData.confirmPassword
  )) as ResetPasswordSuccess | PasswordsDontMatchError | null
  sendingEmail.value = false

  if (response) {
    if (response.__typename === 'ResetPasswordSuccess') {
      successModalIsVisible.value = true
    } else {
      errorModalVisible.value = true
    }
  } else {
    errorModalVisible.value = true
  }
}

async function validateResetPasswordToken(resetPasswordToken: string) {
  validatingToken.value = true
  var response = await authService.validateResetPasswordToken(resetPasswordToken)
  validatingToken.value = false

  if (response === 'success') {
    setCurrentUserSiteInStore()
  } else if (response === 'expired_reset_password_token') {
    errorMessage.value = ERROR_EXPIRED_RESET_PASSWORD_TOKEN
    errorValidateTokenModalIsVisible.value = true
  } else if (response === 'invalid_token') {
    errorMessage.value = ERROR_INVALID_TOKEN
    errorValidateTokenModalIsVisible.value = true
  } else {
    errorMessage.value = ERROR_UNKNOWN
    errorValidateTokenModalIsVisible.value = true
  }
}

async function setCurrentUserSiteInStore() {
  const userSites = await apiService.getCurrentUserSites()

  if (userSites && userSites.length > 0) {
    appStore().setSite(userSites[0])
  }
}
</script>

<template>
  <div class="d-flex justify-content-center h-10">
    <div class="card">
      <div class="card-body mt-4">
        <div class="row form-inline">
          <div class="col-md-12 text-center mb-3">
            <h2>RESET PASSWORD</h2>
          </div>
        </div>
        <form @submit.prevent="submitForm" autocomplete="off">
          <div class="form-row">
            <div class="col-md-12 mb-3">
              <label for="passwordRegistration" class="input-label">Password *</label>
              <div class="input-group">
                <input
                  id="passwordRegistration"
                  class="form-control"
                  v-model="formData.password"
                  :type="passwordIsVisible ? 'text' : 'password'"
                  placeholder="Password"
                  maxlength="50"
                  required
                />
                <div
                  class="input-group-prepend"
                  @click="passwordIsVisible = !passwordIsVisible"
                  style="cursor: pointer"
                >
                  <span
                    class="input-group-text"
                    id="passwordEye"
                    style="background-color: transparent"
                  >
                    <i v-if="passwordIsVisible" class="bi bi-eye-fill"></i>
                    <i v-else class="bi bi-eye-slash-fill"></i>
                  </span>
                </div>
              </div>
              <small
                v-for="error in v$.password.$errors"
                :key="error.$uid"
                class="form-text"
                style="color: red"
              >
                {{ error.$message }}
              </small>
            </div>
          </div>

          <div class="form-row">
            <div class="col-md-12 mb-2">
              <label for="confirmPasswordRegistration" class="input-label"
                >Confirm Password *</label
              >
              <div class="input-group">
                <input
                  id="confirmPasswordRegistration"
                  class="form-control"
                  v-model="formData.confirmPassword"
                  :type="confirmPasswordIsVisible ? 'text' : 'password'"
                  placeholder="Confirm Password"
                  maxlength="50"
                  required
                />
                <div
                  class="input-group-prepend"
                  @click="confirmPasswordIsVisible = !confirmPasswordIsVisible"
                  style="cursor: pointer"
                >
                  <span
                    class="input-group-text"
                    id="confirmPasswordEye"
                    style="background-color: transparent"
                  >
                    <i v-if="confirmPasswordIsVisible" class="bi bi-eye-fill"></i>
                    <i v-else class="bi bi-eye-slash-fill"></i>
                  </span>
                </div>
              </div>
              <small
                v-for="error in v$.confirmPassword.$errors"
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
                text="RESET"
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
    title="SUCCESS"
    :message="SUCCESS_RESET_PASSWORD"
    :closable="false"
    @on-ok="router.replace({ name: 'calendar' })"
    :cancel-text="null"
    v-if="successModalIsVisible"
  >
  </ModalComponent>

  <!-- Error Validate Token Modal -->
  <ModalComponent
    title="Error"
    :message="errorMessage"
    :closable="false"
    v-if="errorValidateTokenModalIsVisible"
    @on-ok="router.push({ name: 'login' })"
    :cancel-text="null"
  >
  </ModalComponent>

  <!-- Error Modal -->
  <ModalComponent
    title="Error"
    :message="ERROR_UNKNOWN"
    :closable="false"
    v-if="errorModalVisible"
    @on-ok="errorModalVisible = false"
    :cancel-text="null"
  >
  </ModalComponent>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

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
