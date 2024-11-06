<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref } from 'vue'

import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import { getFormattedPhoneNumber } from '@/utils/utility-functions'
import type { ApiService } from '@/services/apiService'
import { VueTelInput } from 'vue-tel-input'

import DefaultButtonComponent from '@/components/DefaultButtonComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import type { PhoneObject } from '../interfaces/phone-object.interface'
import { ERROR_UNKNOWN } from '@/utils/errorMessages'
import { useRoute } from 'vue-router'
import router from '@/router'

const apiService = inject<ApiService>('gqlApiService')!

onMounted(() => {
  const route = useRoute()
  destination.value = (route.query.destination ?? null) as string

  currentUserPhoneNumber()
})

const isLoading = ref(false)
const isSubmitting = ref(false)
const phoneNumber = ref<PhoneObject>({})
const successModalIsVisible = ref(false)
const successModalMessage = ref('')
const errorModalIsVisible = ref(false)
const errorModalMessage = ref('')

const smsCodeModalIsVisible = ref(false)
const isSubmittingSmsCode = ref(false)

const destination = ref('')

const formData = reactive({
  phone: ''
})

const rules = computed(() => {
  return {
    phone: {
      required: helpers.withMessage('Valid mobile number is required', required),
      validateUAEphone: helpers.withMessage(
        'A UAE phone number must start with +9715',
        validateUAEphone
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

const smsCodeFormData = reactive({
  smsCode: ''
})

const smsCodeFormRules = computed(() => {
  return {
    smsCode: {
      required: helpers.withMessage('Code is required', required)
    }
  }
})

const smsCodeV$ = useVuelidate(smsCodeFormRules, smsCodeFormData)

const submitForm = async () => {
  const isValid = await v$.value.$validate()

  if (isValid && phoneNumber.value.valid) {
    isSubmitting.value = true

    try {
      const countryCode = '+' + phoneNumber.value.countryCallingCode
      const mobilePhone = phoneNumber.value.nationalNumber!

      const response = await apiService.requestSMSValidation(countryCode, mobilePhone)

      if (response.success) {
        smsCodeModalIsVisible.value = true
      } else {
        errorModalMessage.value = response.message
        errorModalIsVisible.value = true
      }
    } catch (error) {
      errorModalMessage.value = ERROR_UNKNOWN
      errorModalIsVisible.value = true
    } finally {
      isSubmitting.value = false
    }
  }
}

async function currentUserPhoneNumber() {
  isLoading.value = true
  try {
    var phone = await apiService.currentUserPhoneNumber()

    if (phone) {
      formData.phone = getFormattedPhoneNumber(phone)
    }
  } catch (error) {
    // ignore
  } finally {
    isLoading.value = false
  }
}

function onValidate(phoneObject: PhoneObject) {
  phoneNumber.value = phoneObject
}

const submitSmsCodeForm = async () => {
  const isValid = await smsCodeV$.value.$validate()

  if (isValid) {
    isSubmittingSmsCode.value = true

    try {
      const response = await apiService.isSMSValidationCodeValid(smsCodeFormData.smsCode)

      if (response.success) {
        successModalMessage.value = response.message
        successModalIsVisible.value = true
        smsCodeModalIsVisible.value = false
      } else {
        errorModalMessage.value = response.message
        errorModalIsVisible.value = true
      }
    } catch (error) {
      errorModalMessage.value = ERROR_UNKNOWN
      errorModalIsVisible.value = true
    } finally {
      isSubmittingSmsCode.value = false
    }
  }
}

async function acceptSuccessModal() {
  successModalIsVisible.value = false

  if (destination.value) {
    await router.push({ name: 'payments', query: { destination: destination.value } })
  } else {
    router.push({ name: 'payments' })
  }
}
</script>

<template>
  <!-- Phone number Form -->
  <div class="d-flex justify-content-center w-100">
    <div class="w-100" style="max-width: 1000px">
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
              :disabled="isLoading || isSubmitting"
              placeholder="Mobile Number"
              required
              defaultCountry="AE"
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
              @validate="onValidate"
            ></vue-tel-input>
            <small
              v-for="error in v$.phone.$errors"
              :key="error.$uid"
              class="form-text"
              style="color: red"
            >
              {{ error.$message }}
            </small>
            <small v-if="phoneNumber.valid === false" class="form-text" style="color: red">
              Valid mobile number is required
            </small>
          </div>
        </div>

        <div class="form-row">
          <div class="col">
            <p>
              We will send a verification code to <b>{{ formData.phone }}</b>
            </p>
          </div>
        </div>

        <!--submit button-->
        <div class="form-row">
          <div class="col-md-6 mb-3">
            <DefaultButtonComponent
              :text="'Send Code'"
              type="button"
              @on-click="submitForm"
              :disabled="isLoading"
              :isLoading="isSubmitting"
            ></DefaultButtonComponent>
          </div>
        </div>
      </form>
    </div>
  </div>

  <!-- SMS Code Modal -->
  <transition name="modal" v-if="smsCodeModalIsVisible">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header border-0">
              <h5 class="modal-title">Validation Code</h5>
            </div>
            <div class="modal-body">
              <p>Please enter the validation code that you received by SMS</p>
              <form @submit.prevent="submitForm" autocomplete="off">
                <div class="form-row">
                  <!--sms code-->
                  <div class="col-md-12 mb-3">
                    <label for="smsCode" class="input-label">SMS Code *</label>
                    <input
                      id="smsCode"
                      class="form-control"
                      v-model="smsCodeFormData.smsCode"
                      type="text"
                      placeholder="SMS Code"
                      maxlength="20"
                      required
                    />
                    <small
                      v-for="error in smsCodeV$.smsCode.$errors"
                      :key="error.$uid"
                      class="form-text"
                      style="color: red"
                    >
                      {{ error.$message }}
                    </small>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer border-0">
              <button
                type="button"
                class="btn btn-default"
                @click="smsCodeModalIsVisible = false"
                :disabled="isSubmittingSmsCode"
              >
                Cancel
              </button>
              <button
                class="btn btn-primary"
                type="button"
                :disabled="isSubmittingSmsCode"
                @click="submitSmsCodeForm"
              >
                Validate Code
                <span
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                  v-if="isSubmittingSmsCode"
                ></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- ERROR modal -->
  <ModalComponent
    :ok-loading="false"
    title="ERROR"
    :message="errorModalMessage"
    :closable="false"
    :cancel-text="null"
    v-if="errorModalIsVisible"
    @on-ok="errorModalIsVisible = false"
  >
  </ModalComponent>

  <!-- SUCCESS modal -->
  <ModalComponent
    title="SUCCESS"
    :message="successModalMessage"
    :closable="false"
    @on-ok="acceptSuccessModal()"
    :cancel-text="null"
    v-if="successModalIsVisible"
    ok-text="Complete Purchase"
  >
  </ModalComponent>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
<style scoped></style>
