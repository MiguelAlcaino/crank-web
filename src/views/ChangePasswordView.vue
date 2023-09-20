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
        errorMessage.value = 'The password must contain a letter and a number.'
      } else if (response === 'MinimumPasswordLengthException') {
        errorMessage.value = 'The password must contain at least 8 characters.'
      } else if (response === 'IncorrectPasswordException') {
        errorMessage.value = 'The current password is not correct.'
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
          <input
            id="currentPassword"
            class="form-control"
            v-model="formData.currentPassword"
            type="password"
            placeholder="Current Password"
            maxlength="50"
            required
          />
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
      <div class="form-row">
        <!-- new password -->
        <div class="col-md-6 mb-3">
          <label for="newPassword" class="input-label">New Password *</label>
          <input
            id="newPassword"
            class="form-control"
            v-model="formData.newPassword"
            type="password"
            placeholder="New Password"
            maxlength="50"
            required
          />
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
          <input
            id="confirmNewPassword"
            class="form-control"
            v-model="formData.confirmNewPassword"
            type="password"
            placeholder="Confirm New Password"
            maxlength="50"
            required
          />
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
    title="Error"
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
    title="Update Password"
    :message="SUCCESS_RESET_PASSWORD"
    :ok-loading="false"
    @on-ok="$router.go(-1)"
    :cancel-text="null"
    :closable="true"
  >
  </ModalComponent>
</template>
