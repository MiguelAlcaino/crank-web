<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref } from 'vue'

import useVuelidate from '@vuelidate/core'
import { helpers, minLength, required } from '@vuelidate/validators'
import { getFormattedPhoneNumber } from '@/utils/utility-functions'
import { ApiService } from '@/services/apiService'
import { VueTelInput } from 'vue-tel-input'

const apiService = inject<ApiService>('gqlApiService')!

onMounted(() => {
  console.log('mounted')
})

const formData = reactive({
  phone: ''
})

const rules = computed(() => {
  return {
    phone: {
      required: helpers.withMessage(
        'Valid mobile number is required to redeem the trial package through an SMS validation code',
        required
      ),
      validateUAEphone: helpers.withMessage(
        'A UAE phone number must start with +9715',
        validateUAEphone
      ),
      minLength: helpers.withMessage(
        'Valid mobile number is required to redeem the trial package through an SMS validation code',
        minLength(7)
      ),
      lengthUAEphone: helpers.withMessage('Invalid Mobile Number', lengthUAEphone)
    }
  }
})

const validateUAEphone = (phone: string) =>
  phone.startsWith('+971') ? getFormattedPhoneNumber(phone).startsWith('+9715') : true

const lengthUAEphone = (phone: string) =>
  phone.startsWith('+971') ? getFormattedPhoneNumber(phone).length === 13 : true

const v$ = useVuelidate(rules, formData)

const isSaving = ref(false)
const successModalIsVisible = ref(false)
const errorModalIsVisible = ref(false)

const submitForm = async () => {
  const isValid = await v$.value.$validate()

  if (isValid) {
    formData.phone = getFormattedPhoneNumber(formData.phone)

    // const input: UserInput = {
    //     phone: formData.phone,

    // }

    isSaving.value = true
    //const response = await apiService.updateCurrentUser(input)
    isSaving.value = false

    // if (response === 'UpdateProfileSuccess') {
    //     successModalIsVisible.value = true
    // } else {
    //     errorModalIsVisible.value = true
    // }
  } else {
    console.error('error form')
  }
}
</script>

<template>
  <h1>Phone Number Verification</h1>
  <br />
  <h5>We need to verify your mobile number to proceed with this purchase.</h5>

  <form @submit.prevent="submitForm" autocomplete="off">
    <div class="form-row">
      <!--phone-->
      <div class="col-md-4 mb-3">
        <label for="mobileNumberMyProfile" class="input-label">Mobile Number *</label>
        <vue-tel-input
          v-model="formData.phone"
          mode="international"
          id="mobileNumberMyProfile"
          placeholder="Mobile Number"
          required
          :dropdownOptions="{
            showSearchBox: true,
            showFlags: true,
            showDialCodeInList: true,
            showDialCodeInSelection: false
          }"
          :inputOptions="{
            id: 'mobileNumberMyProfile',
            showDialCode: true,
            required: true
          }"
          :validCharactersOnly="true"
          :autoDefaultCountry="false"
        ></vue-tel-input>
        <small
          v-for="error in v$.phone.$errors"
          :key="error.$uid"
          class="form-text"
          style="color: red"
        >
          {{ error.$message }}
        </small>
      </div>
    </div>

    {{ formData.phone }}

    <!--submit button-->
    <div class="form-row">
      <div class="col-md-6 mb-3">
        <button class="btn btn-primary" type="submit" :disabled="isSaving">
          Send Code
          <span class="spinner-border spinner-border-sm" v-if="isSaving"></span>
        </button>
      </div>
    </div>
  </form>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
<style scoped></style>
