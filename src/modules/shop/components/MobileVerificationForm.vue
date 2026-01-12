<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref } from 'vue'

import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import { getFormattedPhoneNumber } from '@/utils/utility-functions'
import type { ApiService } from '@/services/ApiService'
import { VueTelInput } from 'vue-tel-input'

import DefaultButtonComponent from '@/components/DefaultButtonComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import type { PhoneObject } from '@/modules/buy_packages/interfaces/phone-object.interface'
import { ERROR_UNKNOWN } from '@/utils/errorMessages'

// --- EVENT DEFINITIONS ---
const emit = defineEmits(['verified'])

const apiService = inject<ApiService>('gqlApiService')!

// --- STATES ---
const isLoading = ref(false)
const isSubmitting = ref(false)
const phoneNumber = ref<PhoneObject>({})

// UI Modals
const errorModalIsVisible = ref(false)
const errorModalMessage = ref('')

const smsCodeModalIsVisible = ref(false)
const isSubmittingSmsCode = ref(false)

// --- PHONE FORM ---
const formData = reactive({
  phone: ''
})

// Validation Rules
const validateUAEphone = (phone: string) =>
  phone.startsWith('+971') ? getFormattedPhoneNumber(phone).startsWith('+9715') : true

const lengthUAEphone = (phone: string) =>
  phone.startsWith('+971') ? getFormattedPhoneNumber(phone).length === 13 : true

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

const v$ = useVuelidate(rules, formData)

// --- SMS CODE FORM ---
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

// --- LIFECYCLE ---
onMounted(() => {
  currentUserPhoneNumber()
})

// --- METHODS ---
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

// 1. Send SMS Code
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

// 2. Validate SMS Code
const submitSmsCodeForm = async () => {
  const isValid = await smsCodeV$.value.$validate()

  if (isValid) {
    isSubmittingSmsCode.value = true

    try {
      const response = await apiService.isSMSValidationCodeValid(smsCodeFormData.smsCode)

      if (response.success) {
        // Success: Close modals and notify parent
        smsCodeModalIsVisible.value = false
        emit('verified')
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
</script>

<template>
  <div class="verification-container">
    <div class="verification-card">
      <h3 class="title">Verification Required</h3>
      <p class="subtitle">
        Some items in your cart require mobile verification. Please verify your number to continue
        to payment.
      </p>

      <form @submit.prevent="submitForm" autocomplete="off">
        <div class="form-row">
          <div class="col-12 mb-3">
            <label for="mobileNumberCheckout" class="input-label">Mobile Number *</label>
            <vue-tel-input
              v-model="formData.phone"
              mode="international"
              id="mobileNumberCheckout"
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
                id: 'mobileNumberCheckout',
                showDialCode: true,
                required: true
              }"
              :validCharactersOnly="true"
              :autoDefaultCountry="false"
              @validate="onValidate"
            ></vue-tel-input>

            <!-- Validation Errors -->
            <small
              v-for="error in v$.phone.$errors"
              :key="error.$uid"
              class="form-text text-danger"
            >
              {{ error.$message }}
            </small>
            <small v-if="phoneNumber.valid === false" class="form-text text-danger">
              Valid mobile number is required
            </small>
          </div>
        </div>

        <div class="form-row">
          <div class="col-12 mb-2">
            <p class="info-text">
              We will send a verification code to <b>{{ formData.phone }}</b>
            </p>
          </div>
        </div>

        <!-- Send Code Button -->
        <div class="form-row">
          <div class="col-12">
            <DefaultButtonComponent
              :text="'Send Verification Code'"
              type="button"
              @on-click="submitForm"
              :disabled="isLoading"
              :isLoading="isSubmitting"
            ></DefaultButtonComponent>
          </div>
        </div>
      </form>
    </div>

    <!-- SMS Code Modal -->
    <transition name="modal">
      <div class="modal-mask" v-if="smsCodeModalIsVisible">
        <div class="modal-wrapper">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header border-0">
                <h5 class="modal-title">Validation Code</h5>
              </div>
              <div class="modal-body">
                <p>Please enter the validation code that you received by SMS</p>
                <form @submit.prevent="submitSmsCodeForm" autocomplete="off">
                  <div class="form-row">
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
                        class="form-text text-danger"
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
                    class="spinner-border spinner-border-sm ml-2"
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

    <!-- ERROR Modal -->
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
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped>
.verification-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 2rem;
}

.verification-card {
  background-color: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  border: 1px solid #ff8c69;
}

.title {
  font-weight: 900;
  color: #000;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.input-label {
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.info-text {
  font-size: 0.9rem;
  color: #555;
}

.text-danger {
  color: #dc3545;
}

/* Modal Styles overrides if needed */
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.btn-primary {
  background-color: #ff8c69;
  border-color: #ff8c69;
}

.btn-primary:hover {
  background-color: #e67e5f;
  border-color: #e67e5f;
}
</style>
