<script setup lang="ts">
import { inject, ref, reactive, computed } from 'vue'
import { required, minLength, sameAs, helpers } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'

import type { ApiService } from '@/services/apiService'
import ModalComponent from '@/components/ModalComponent.vue'
import { appStore } from '@/stores/appStorage'
import type { UpdateCurrentUserPasswordInput } from '@/gql/graphql'
import { ERROR_UNKNOWN } from '@/utils/errorMessages'
import { SUCCESS_RESET_PASSWORD } from '@/utils/successMessages'

const apiService = inject<ApiService>('gqlApiService')!
const isSaving = ref<boolean>(false)

const successModalIsVisible = ref<boolean>(false)
const errorModalIsVisible = ref<boolean>(false)
const errorMessage = ref<string>('')

const checkPass = helpers.regex(/^(?=.*[a-zA-Z])(?=.*\d).+$/)

const currentPasswordIsVisible = ref<boolean>(false)
const newPasswordIsVisible = ref<boolean>(false)
const confirmNewPasswordIsVisible = ref<boolean>(false)

const formData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

const rules = computed(() => {
  return {
    currentPassword: {
      required: helpers.withMessage('Field is required', required)
    },
    newPassword: {
      required: helpers.withMessage('Field is required', required),
      minLength: helpers.withMessage(
        'The password must contain at least 8 characters',
        minLength(8)
      ),
      checkPass: helpers.withMessage('The password must contain a letter and a number', checkPass)
    },
    confirmNewPassword: {
      required: helpers.withMessage('Field is required', required),
      sameAs: helpers.withMessage(
        'The password confirmation does not match',
        sameAs(formData.newPassword)
      )
    }
  }
})

const v$ = useVuelidate(rules, formData)

const submitForm = async () => {
  const isValid = await v$.value.$validate()

  if (isValid) {
    const input: UpdateCurrentUserPasswordInput = {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    }

    isSaving.value = true
    var response = await apiService.updateCurrentUserPassword(appStore().site, input)
    isSaving.value = false

    if (response === 'Success') {
      successModalIsVisible.value = true
    } else {
      if (response === 'PasswordMustContainLetterOrNumberException') {
        errorMessage.value = 'THE PASSWORD MUST CONTAIN A LETTER AND A NUMBER.'
      } else if (response === 'MinimumPasswordLengthException') {
        errorMessage.value = 'THE PASSWORD MUST CONTAIN AT LEAST 8 CHARACTERS.'
      } else if (response === 'IncorrectPasswordException') {
        errorMessage.value = 'INVALID CURRENT PASSWORD.'
      } else {
        errorMessage.value = ERROR_UNKNOWN
      }
      errorModalIsVisible.value = true
    }
  } else {
    console.error('error form')
  }
}
</script>

<template>
  <div>
    <h1>My Account</h1>
    <h3>Change Password</h3>
    <hr />
    <form @submit.prevent="submitForm" autocomplete="off">
      <div class="form-row">
        <!-- current password -->
        <div class="col-md-6 mb-3">
          <label for="currentPassword" class="input-label">Current Password *</label>
          <div class="input-group">
            <input
              id="currentPassword"
              class="form-control"
              v-model="formData.currentPassword"
              :type="currentPasswordIsVisible ? 'text' : 'password'"
              placeholder="Current Password"
              maxlength="50"
              required
            />
            <div
              class="input-group-prepend"
              @click="currentPasswordIsVisible = !currentPasswordIsVisible"
              style="cursor: pointer"
            >
              <span
                class="input-group-text"
                id="currentPasswordEye"
                style="background-color: transparent"
              >
                <i v-if="currentPasswordIsVisible" class="bi bi-eye-fill"></i>
                <i v-else class="bi bi-eye-slash-fill"></i>
              </span>
            </div>
            <small
              v-for="error in v$.currentPassword.$errors"
              :key="error.$uid"
              class="form-text"
              style="color: red"
            >
              {{ error.$message }}
            </small>
          </div>
        </div>
      </div>
      <div class="form-row">
        <!-- new password -->
        <div class="col-md-6 mb-3">
          <label for="newPassword" class="input-label">New Password *</label>
          <div class="input-group">
            <input
              id="newPassword"
              class="form-control"
              v-model="formData.newPassword"
              :type="newPasswordIsVisible ? 'text' : 'password'"
              placeholder="New Password"
              maxlength="50"
              required
            />
            <div
              class="input-group-prepend"
              @click="newPasswordIsVisible = !newPasswordIsVisible"
              style="cursor: pointer"
            >
              <span
                class="input-group-text"
                id="newPasswordEye"
                style="background-color: transparent"
              >
                <i v-if="newPasswordIsVisible" class="bi bi-eye-fill"></i>
                <i v-else class="bi bi-eye-slash-fill"></i>
              </span>
            </div>
          </div>
          <small
            v-for="error in v$.newPassword.$errors"
            :key="error.$uid"
            class="form-text"
            style="color: red"
          >
            {{ error.$message }}
          </small>
        </div>
      </div>

      <div class="form-row">
        <div class="col-md-6 mb-3">
          <label for="confirmNewPassword" class="input-label">Confirm New Password *</label>
          <div class="input-group">
            <input
              id="confirmNewPassword"
              class="form-control"
              v-model="formData.confirmNewPassword"
              :type="confirmNewPasswordIsVisible ? 'text' : 'password'"
              placeholder="Confirm New Password"
              maxlength="50"
              required
            />
            <div
              class="input-group-prepend"
              @click="confirmNewPasswordIsVisible = !confirmNewPasswordIsVisible"
              style="cursor: pointer"
            >
              <span
                class="input-group-text"
                id="confirmNewPasswordEye"
                style="background-color: transparent"
              >
                <i v-if="confirmNewPasswordIsVisible" class="bi bi-eye-fill"></i>
                <i v-else class="bi bi-eye-slash-fill"></i>
              </span>
            </div>
          </div>
          <small
            v-for="error in v$.confirmNewPassword.$errors"
            :key="error.$uid"
            class="form-text"
            style="color: red"
          >
            {{ error.$message }}
          </small>
        </div>
      </div>
      <div class="form-row">
        <div class="col-md-12 mb-3">
          <button class="btn btn-primary" type="submit" :disabled="isSaving">
            Update Password <span class="spinner-border spinner-border-sm" v-if="isSaving"></span>
          </button>
        </div>
      </div>
    </form>
  </div>
  <!-- error modal -->
  <ModalComponent
    title="ERROR"
    :message="errorMessage"
    :closable="false"
    v-if="errorModalIsVisible"
    @on-ok="errorModalIsVisible = false"
    :cancel-text="null"
  >
  </ModalComponent>

  <!-- success modal -->
  <ModalComponent
    v-if="successModalIsVisible"
    title="SUCCESS"
    :message="SUCCESS_RESET_PASSWORD"
    :ok-loading="false"
    @on-ok="$router.go(-1)"
    :cancel-text="null"
    :closable="true"
  >
  </ModalComponent>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
