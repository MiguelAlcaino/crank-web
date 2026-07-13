<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import useVuelidate from '@vuelidate/core'
import { email as emailRule, helpers, maxLength, minLength, required } from '@vuelidate/validators'
import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'

import DefaultButtonComponent from '@/components/DefaultButtonComponent.vue'
import DeviceFingerprint from '@/modules/shop/components/DeviceFingerprint.vue'
import type { PhoneObject } from '@/modules/buy_packages/interfaces/phone-object.interface'
import { getFormattedPhoneNumber } from '@/utils/utility-functions'
import { formatPrice, luhnCheck } from '@/modules/shop/utils/shop-utils'
import { createPayfortFormManager } from '@/modules/shop/services/PayfortFormManager'
import type { CardData } from '@/modules/shop/interfaces/card-data'
import { useShopApiService } from '@/modules/shop/composables/useShopApiService'
import {
  usePaymentLinkCheckout,
  type PaymentLinkBuyer
} from '@/modules/shop/composables/usePaymentLinkCheckout'
import { usePaymentLinkApplePay } from '@/modules/shop/composables/usePaymentLinkApplePay'
import type { SiteEnum } from '@/modules/shared/interfaces/site.enum'
import type { PaymentLinkForCheckoutQuery } from '@/gql/graphql'

const route = useRoute()
const shopApi = useShopApiService()
const paymentLinkId = String(route.params.id)

const paymentLink = ref<PaymentLinkForCheckoutQuery['paymentLink']>(null)
const isLoadingLink = ref(true)
const loadError = ref<string | null>(null)

const {
  isLoading: isSubmittingCard,
  error: cardError,
  payfortFormHtml,
  initiatePayment
} = usePaymentLinkCheckout()

const applePay = usePaymentLinkApplePay()

// The card form is collapsed behind a "Credit card" button when Apple Pay is available; when Apple
// Pay isn't offered (e.g. non-Safari) the card form is shown directly.
const showCardForm = ref(!applePay.isApplePayAvailable.value)

const FINGERPRINT_INPUT_ID = 'payment_link_io_blackbox'
const fingerprintSessionId = ref('')
function onFingerprintReady(sessionId: string) {
  fingerprintSessionId.value = sessionId
}

const formData = reactive({
  fullName: '',
  email: '',
  phone: '',
  cardholderName: '',
  cardNumber: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: ''
})
const phoneObject = ref<PhoneObject>({})
function onPhoneValidate(phone: PhoneObject) {
  phoneObject.value = phone
}

const validateUAEphone = (phone: string) =>
  phone.startsWith('+971') ? getFormattedPhoneNumber(phone).startsWith('+9715') : true
const lengthUAEphone = (phone: string) =>
  phone.startsWith('+971') ? getFormattedPhoneNumber(phone).length === 13 : true

const luhnValidator = helpers.withMessage('Invalid card number', (value: string) => {
  if (!value) return true
  return luhnCheck(value.replace(/\s/g, ''))
})

const rules = computed(() => ({
  fullName: { required: helpers.withMessage('Full name is required', required) },
  email: {
    required: helpers.withMessage('Email address is required', required),
    email: helpers.withMessage('Please enter a valid email address', emailRule)
  },
  phone: {
    required: helpers.withMessage('Valid mobile number is required', required),
    validateUAEphone: helpers.withMessage(
      'A UAE phone number must start with +9715',
      validateUAEphone
    ),
    lengthUAEphone: helpers.withMessage('Invalid Mobile Number', lengthUAEphone)
  },
  cardholderName: { required: helpers.withMessage('Field is required', required) },
  cardNumber: {
    required: helpers.withMessage('Field is required', required),
    minLength: helpers.withMessage('Card number must be at least 13 digits', minLength(13)),
    maxLength: helpers.withMessage('Card number must be at most 19 digits', maxLength(19)),
    luhn: luhnValidator
  },
  expiryMonth: { required: helpers.withMessage('Field is required', required) },
  expiryYear: { required: helpers.withMessage('Field is required', required) },
  cvv: {
    required: helpers.withMessage('Field is required', required),
    minLength: helpers.withMessage('CVV must be at least 3 digits', minLength(3)),
    maxLength: helpers.withMessage('CVV must be at most 4 digits', maxLength(4))
  }
}))

const v$ = useVuelidate(rules, formData)

const buyerRules = computed(() => ({
  fullName: rules.value.fullName,
  email: rules.value.email,
  phone: rules.value.phone
}))
const buyer$ = useVuelidate(buyerRules, formData)

const submitError = ref<string | null>(null)

const formattedAmount = computed(() =>
  paymentLink.value ? formatPrice(paymentLink.value.amount, paymentLink.value.currency) : ''
)

const site = computed<SiteEnum | null>(() =>
  paymentLink.value ? (paymentLink.value.site.code as unknown as SiteEnum) : null
)

function buildBuyer(): PaymentLinkBuyer {
  const mobilePhone = phoneObject.value.number ?? getFormattedPhoneNumber(formData.phone)
  return {
    paymentLinkId,
    fullName: formData.fullName.trim(),
    email: formData.email.trim(),
    mobilePhone
  }
}

onMounted(async () => {
  try {
    paymentLink.value = await shopApi.getPaymentLinkForCheckout(paymentLinkId)
    if (!paymentLink.value) {
      loadError.value = 'This payment link was not found.'
      return
    }
    if (site.value && applePay.isApplePayAvailable.value) {
      await applePay.fetchApplePayConfig(site.value)
    }
  } catch (e) {
    console.error('Failed to load payment link:', e)
    loadError.value = 'We could not load this payment link. Please try again later.'
  } finally {
    isLoadingLink.value = false
  }
})

async function handleCardSubmit() {
  submitError.value = null

  const isValid = await v$.value.$validate()
  if (!isValid || phoneObject.value.valid === false) {
    return
  }
  if (!fingerprintSessionId.value) {
    submitError.value = 'Please wait a moment while we secure your session, then try again.'
    return
  }

  await initiatePayment(buildBuyer(), fingerprintSessionId.value)

  if (cardError.value) {
    submitError.value = 'We could not start the payment. Please try again.'
    return
  }

  if (payfortFormHtml.value) {
    const formManager = createPayfortFormManager(payfortFormHtml.value)
    const cardData: CardData = {
      cardNumber: formData.cardNumber,
      expiryDate: `${formData.expiryMonth}/${formData.expiryYear}`,
      cvv: formData.cvv,
      cardholderName: formData.cardholderName,
      saveForFuture: false
    }
    formManager.addCardData(cardData)
    formManager.submit()
  }
}

async function handleApplePay() {
  submitError.value = null

  const isValid = await buyer$.value.$validate()
  if (!isValid || phoneObject.value.valid === false) {
    return
  }
  if (!paymentLink.value) {
    return
  }

  const result = await applePay.startApplePayPayment(
    buildBuyer(),
    paymentLink.value.amount,
    paymentLink.value.title
  )

  if (result.result) {
    window.location.href = `/payfort/transaction-feedback-url/${encodeURIComponent(
      result.merchantReference
    )}`
  } else if (applePay.error.value) {
    submitError.value = applePay.error.value
  }
}
</script>

<template>
  <div class="payment-link-page">
    <div class="payment-card">
      <div v-if="isLoadingLink" class="loading-state">
        <span class="spinner-border" role="status" aria-hidden="true"></span>
      </div>

      <div v-else-if="loadError" class="error-state">
        <h3 class="title">Payment unavailable</h3>
        <p class="subtitle">{{ loadError }}</p>
      </div>

      <template v-else-if="paymentLink">
        <div class="summary">
          <h3 class="title">{{ paymentLink.title }}</h3>
          <div class="amount">{{ formattedAmount }}</div>
        </div>

        <form @submit.prevent="handleCardSubmit" autocomplete="off">
          <!-- Buyer details -->
          <div class="form-group">
            <label for="pl_fullName" class="input-label">Full Name *</label>
            <input
              id="pl_fullName"
              class="form-control"
              v-model="formData.fullName"
              type="text"
              placeholder="Enter your full name"
            />
            <small v-for="e in v$.fullName.$errors" :key="e.$uid" class="form-text text-danger">
              {{ e.$message }}
            </small>
          </div>

          <div class="form-group">
            <label for="pl_email" class="input-label">Email Address *</label>
            <input
              id="pl_email"
              class="form-control"
              v-model="formData.email"
              type="email"
              placeholder="Enter your email address"
            />
            <small v-for="e in v$.email.$errors" :key="e.$uid" class="form-text text-danger">
              {{ e.$message }}
            </small>
          </div>

          <div class="form-group">
            <label for="pl_mobile" class="input-label">Mobile Number *</label>
            <vue-tel-input
              v-model="formData.phone"
              mode="international"
              id="pl_mobile"
              placeholder="Mobile Number"
              defaultCountry="AE"
              :dropdownOptions="{
                showSearchBox: true,
                showFlags: true,
                showDialCodeInList: true,
                showDialCodeInSelection: false
              }"
              :inputOptions="{ id: 'pl_mobile', showDialCode: true, required: true }"
              :validCharactersOnly="true"
              :autoDefaultCountry="false"
              @validate="onPhoneValidate"
            ></vue-tel-input>
            <small v-for="e in v$.phone.$errors" :key="e.$uid" class="form-text text-danger">
              {{ e.$message }}
            </small>
          </div>

          <!-- Apple Pay -->
          <div v-if="applePay.isApplePayAvailable.value" class="apple-pay-section">
            <button
              type="button"
              class="apple-pay-button"
              :disabled="applePay.isProcessing.value"
              @click="handleApplePay"
              aria-label="Pay with Apple Pay"
            ></button>
          </div>

          <!-- Toggle: reveal the credit card form -->
          <button
            v-if="!showCardForm"
            type="button"
            class="credit-card-toggle"
            @click="showCardForm = true"
          >
            <i class="bi bi-credit-card"></i>
            Credit card
          </button>

          <!-- Card details (expandable) -->
          <div v-if="showCardForm" class="card-section">
            <div v-if="applePay.isApplePayAvailable.value" class="divider">
              <span>or pay with card</span>
            </div>

            <div class="form-group">
              <label for="pl_cardholder" class="input-label">Cardholder Name *</label>
            <input
              id="pl_cardholder"
              class="form-control"
              v-model="formData.cardholderName"
              type="text"
              placeholder="Name on card"
            />
            <small
              v-for="e in v$.cardholderName.$errors"
              :key="e.$uid"
              class="form-text text-danger"
            >
              {{ e.$message }}
            </small>
          </div>

          <div class="form-group">
            <label for="pl_cardNumber" class="input-label">Card Number *</label>
            <input
              id="pl_cardNumber"
              class="form-control"
              v-model="formData.cardNumber"
              type="text"
              inputmode="numeric"
              placeholder="1234 5678 9012 3456"
              maxlength="19"
            />
            <small v-for="e in v$.cardNumber.$errors" :key="e.$uid" class="form-text text-danger">
              {{ e.$message }}
            </small>
          </div>

          <div class="form-row">
            <div class="col-4 form-group">
              <label for="pl_expiryMonth" class="input-label">Month *</label>
              <input
                id="pl_expiryMonth"
                class="form-control"
                v-model="formData.expiryMonth"
                type="text"
                inputmode="numeric"
                placeholder="MM"
                maxlength="2"
              />
              <small
                v-for="e in v$.expiryMonth.$errors"
                :key="e.$uid"
                class="form-text text-danger"
              >
                {{ e.$message }}
              </small>
            </div>
            <div class="col-4 form-group">
              <label for="pl_expiryYear" class="input-label">Year *</label>
              <input
                id="pl_expiryYear"
                class="form-control"
                v-model="formData.expiryYear"
                type="text"
                inputmode="numeric"
                placeholder="YY"
                maxlength="2"
              />
              <small v-for="e in v$.expiryYear.$errors" :key="e.$uid" class="form-text text-danger">
                {{ e.$message }}
              </small>
            </div>
            <div class="col-4 form-group">
              <label for="pl_cvv" class="input-label">CVV *</label>
              <input
                id="pl_cvv"
                class="form-control"
                v-model="formData.cvv"
                type="text"
                inputmode="numeric"
                placeholder="123"
                maxlength="4"
              />
              <small v-for="e in v$.cvv.$errors" :key="e.$uid" class="form-text text-danger">
                {{ e.$message }}
              </small>
            </div>
          </div>

            <DefaultButtonComponent
              :text="`Pay ${formattedAmount}`"
              type="submit"
              block
              :isLoading="isSubmittingCard"
              @on-click="handleCardSubmit"
            ></DefaultButtonComponent>
          </div>

          <DeviceFingerprint
            :session-id-input-id="FINGERPRINT_INPUT_ID"
            @ready="onFingerprintReady"
          />

          <small v-if="submitError" class="form-text text-danger d-block mt-2">
            {{ submitError }}
          </small>
        </form>
      </template>
    </div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped>
.payment-link-page {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 2rem 1rem;
}

.payment-card {
  background-color: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 460px;
  border: 1px solid #ff8c69;
}

.summary {
  text-align: center;
  margin-bottom: 1.5rem;
}

.title {
  font-weight: 900;
  color: #000;
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.subtitle {
  color: #6c757d;
  font-size: 0.9rem;
}

.amount {
  font-size: 1.75rem;
  font-weight: 700;
  color: #ff8c69;
}

.input-label {
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: 0.35rem;
}

.form-group {
  margin-bottom: 1rem;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 2rem 0;
}

.apple-pay-section {
  margin: 1.25rem 0 0.75rem;
}

.credit-card-toggle {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  border: 1px solid #ff8c69;
  background-color: #fff;
  color: #ff8c69;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.credit-card-toggle:hover {
  background-color: #fff3ee;
}

.card-section {
  margin-top: 0.5rem;
}

.apple-pay-button {
  -webkit-appearance: -apple-pay-button;
  appearance: -apple-pay-button;
  -apple-pay-button-type: plain;
  -apple-pay-button-style: black;
  width: 100%;
  height: 44px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #6c757d;
  font-size: 0.8rem;
  margin: 1rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e0e0e0;
}

.divider span {
  padding: 0 0.75rem;
}

/* Make the intl phone input match the other full-width inputs */
:deep(.vue-tel-input) {
  border-radius: 0.25rem;
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
