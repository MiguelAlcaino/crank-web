<script setup lang="ts">
import { computed, inject, reactive, ref } from 'vue'
import { helpers, maxLength, minLength, required } from '@vuelidate/validators'

// Components
import DeviceFingerprint from '@/modules/shop/components/DeviceFingerprint.vue'

// Composables, Services & Utilities
import { useCheckout } from '@/modules/shop/composables/useCheckout'
import type { IApiService } from '@/services/IApiService'
import { luhnCheck } from '@/modules/shop/utils/shop-utils'

import cardsAccepted from '../assets/images/cards_accepted.png'
import protectedByPayfort from '../assets/images/protected_by_payfort.png'
import applePay from '../assets/images/apple_pay_button_pay.png'
import useVuelidate from '@vuelidate/core'

// --- Dependencies & State from Composables ---
const apiService = inject<IApiService>('gqlApiService')!
const { error: checkoutError, payfortFormHtml, initiatePayment } = useCheckout(apiService)

// --- Component-Specific State ---
const isSubmitting = ref(false)

// State for the Device Fingerprint, controlled by the child component's events.
const fingerprintSessionId = ref('')
const fingerprintError = ref<Error | null>(null)
const isFingerprintReady = computed(() => !!fingerprintSessionId.value && !fingerprintError.value)

const currentYear = new Date().getFullYear() % 100
const years = Array.from({ length: 15 }, (_, i) => (currentYear + i).toString().padStart(2, '0'))

const formData = reactive({
  cardholderName: '',
  cardNumber: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: '',
  saveForFuture: false
})

const selectedPaymentMethod = ref('newCard')

const luhnValidator = helpers.withMessage('Invalid card number', (value: string) => {
  const clean = value.replace(/\s/g, '')
  return luhnCheck(clean)
})

const rules = computed(() => ({
  cardNumber: {
    required: helpers.withMessage('Field is required', required),
    minLength: helpers.withMessage('Card number must be at least 13 digits', minLength(13)),
    maxLength: helpers.withMessage('Card number must be at most 19 digits', maxLength(19)),
    luhn: luhnValidator
  },
  expiryMonth: {
    required: helpers.withMessage('Field is required', required)
  },
  expiryYear: {
    required: helpers.withMessage('Field is required', required)
  },
  /*  expiryDate: {
      required: helpers.withMessage('Expiration date is required', required),
      validFormat: helpers.withMessage('Invalid format (must be MM/YY)', (value: string) =>
        /^\d{2}\/\d{2}$/.test(value)
      ),
      notExpired: helpers.withMessage('Card has expired', (value: string) => {
        if (!/^\d{2}\/\d{2}$/.test(value)) return false
        const [month, year] = value.split('/')
        const currentYear = new Date().getFullYear() % 100
        const currentMonth = new Date().getMonth() + 1
        return (
          parseInt(year) > currentYear ||
          (parseInt(year) === currentYear && parseInt(month) >= currentMonth)
        )
      })
    },*/
  cvv: {
    required: helpers.withMessage('Field is required', required),
    minLength: helpers.withMessage('CVV must be at least 3 digits', minLength(3)),
    maxLength: helpers.withMessage('CVV must be at most 4 digits', maxLength(4))
  },
  cardholderName: {
    required: helpers.withMessage('Field name is required', required)
  }
}))

const v$ = useVuelidate(rules, formData)

// --- Event Handlers for Child Component ---
/**
 * Handles the 'ready' event from the DeviceFingerprint component.
 * It stores the session ID and enables the UI for submission.
 */
const onFingerprintReady = (sessionId: string) => {
  fingerprintSessionId.value = sessionId
  fingerprintError.value = null
}

/**
 * Handles the 'error' event from the DeviceFingerprint component.
 * It stores the error to display a message to the user.
 */
const onFingerprintError = (error: Error) => {
  fingerprintError.value = error
}

const handleSubmit = async () => {
  if (selectedPaymentMethod.value === 'newCard') {
    const isValid = await v$.value.$validate()
    if (isValid) {
      if (!isFingerprintReady.value) {
        alert('Security session is not yet ready. Please wait a moment.')
        return
      }
    }
  } else if (selectedPaymentMethod.value === 'digitalWallet') {
    // Visa Checkout
  }
}

// --- Formatting and Validation Helpers ---
const formatCardNumber = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '') // Remove all non-digits
  if (value.length > 0) {
    // Add a space every 4 digits
    value = value.match(new RegExp('.{1,4}', 'g'))?.join(' ') || ''
  }
  formData.cardNumber = value
}

const formatCVV = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '').slice(0, 4)
  input.value = value
  formData.cvv = value
}
</script>

<template>
  <div>
    <DeviceFingerprint
      session-id-input-id="fingerprint_session_id"
      @ready="onFingerprintReady"
      @error="onFingerprintError"
    />
    <div class="main-container">
      <a href="#" class="back-arrow"><i class="fas fa-chevron-left"></i></a>

      <h2 class="header-title">PAYMENT DETAILS</h2>
      <p class="header-subtitle">LOGGED IN AS CHRISTINA SALIBI</p>

      <div class="purchase-summary">
        <h5 class="text-orange">YOU ARE BUYING:</h5>
        <h5>1 SESSION / TRIAL PACK / 5 SMOOTHIES</h5>
        <p>AED XXXX</p>
        <span class="item-count">3 items</span>
      </div>

      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-8">
            <p class="section-title">SELECT YOUR PAYMENT OPTION</p>
            <div class="payment-form-container">
              <div class="payment-option-header">
                <input
                  type="radio"
                  id="newCard"
                  name="paymentMethod"
                  value="newCard"
                  v-model="selectedPaymentMethod"
                />
                <label for="newCard">PAY WITH A NEW CARD</label>
              </div>
              <div class="form-row">
                <div class="form-group col-12">
                  <input
                    id="cardholderName"
                    v-model="formData.cardholderName"
                    type="text"
                    class="form-control"
                    placeholder="CARDHOLDER NAME"
                    maxlength="26"
                    @input="
                      formData.cardholderName = (
                        $event.target as HTMLInputElement
                      ).value.toUpperCase()
                    "
                    required
                  />
                  <small
                    v-for="error in v$.cardholderName.$errors"
                    :key="error.$uid"
                    class="form-text"
                    style="color: red"
                  >
                    {{ error.$message }}
                  </small>
                </div>
              </div>
              <div class="form-group">
                <input
                  id="cardNumber"
                  v-model="formData.cardNumber"
                  type="tel"
                  inputmode="numeric"
                  class="form-control"
                  placeholder="CARD NUMBER"
                  maxlength="19"
                  @input="formatCardNumber"
                  required
                />
                <small
                  v-for="error in v$.cardNumber.$errors"
                  :key="error.$uid"
                  class="form-text"
                  style="color: red"
                >
                  {{ error.$message }}
                </small>
              </div>
              <div class="form-row">
                <div class="form-group col-4">
                  <select
                    id="expiryMonth"
                    class="custom-select form-control"
                    v-model="formData.expiryMonth"
                    required
                  >
                    <option value="" disabled>MONTH</option>
                    <option v-for="m in 12" :key="m" :value="m.toString().padStart(2, '0')">
                      {{ m.toString().padStart(2, '0') }}
                    </option>
                  </select>
                  <small
                    v-for="error in v$.expiryMonth.$errors"
                    :key="error.$uid"
                    class="form-text"
                    style="color: red"
                  >
                    {{ error.$message }}
                  </small>
                </div>
                <div class="form-group col-4">
                  <select
                    id="expiryYear"
                    class="custom-select form-control"
                    v-model="formData.expiryYear"
                    required
                  >
                    <option value="" disabled>YEAR</option>
                    <option v-for="y in years" :key="y" :value="y">
                      {{ y }}
                    </option>
                  </select>
                  <small
                    v-for="error in v$.expiryYear.$errors"
                    :key="error.$uid"
                    class="form-text"
                    style="color: red"
                  >
                    {{ error.$message }}
                  </small>
                </div>
                <div class="form-group col-4">
                  <input
                    id="cvv"
                    class="form-control"
                    placeholder="CVV"
                    v-model="formData.cvv"
                    type="tel"
                    inputmode="numeric"
                    maxlength="4"
                    required
                    @input="formatCVV"
                  />
                  <small
                    v-for="error in v$.cvv.$errors"
                    :key="error.$uid"
                    class="form-text"
                    style="color: red"
                  >
                    {{ error.$message }}
                  </small>
                </div>
              </div>
            </div>
            <p class="section-title mt-4">PAY WITH YOUR DIGITAL WALLET</p>
            <div class="digital-wallet-container">
              <input type="radio" id="digitalWallet" name="paymentMethod" />
              <label for="digitalWallet">PAY WITH</label>
              <img :src="applePay" alt="Apple Pay" class="apple-pay-logo" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="payment-footer">
      <button class="pay-now-btn" @click="handleSubmit">PAY NOW</button>
      <div class="footer-disclaimer">
        <span>WE ACCEPT PAYMENTS ONLINE USING VISA AND MASTERCARD CREDIT/DEBIT CARD IN AED</span>
      </div>
      <div class="payment-logos">
        <img :src="cardsAccepted" alt="Cards Accepted" />
        <img :src="protectedByPayfort" alt="Protected by Payfort" />
      </div>
    </footer>
  </div>
</template>
<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style>
body {
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
  overflow-x: hidden;
}
</style>

<style scoped>
.main-container {
  padding: 1.5rem 1.5rem 250px;
}

.back-arrow {
  position: absolute;
  top: 2rem;
  left: 1.5rem;
  font-size: 1.2rem;
  color: #000;
}

.header-title {
  font-weight: 900;
  color: #000;
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
  font-size: 2.5rem;
  text-align: center;
  margin-top: 2rem;
}

.header-subtitle {
  color: #6c757d;
  font-size: 0.9rem;
  letter-spacing: 1px;
  text-align: center;
  margin-bottom: 1.5rem;
}

.purchase-summary {
  background-color: #000;
  color: #fff;
  padding: 1.5rem;
  margin: 1.5rem -1.5rem;
  text-align: center;
}

.purchase-summary h5 {
  font-size: 1rem;
  font-weight: bold;
}

.purchase-summary p {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ff8c69;
  margin: 0.5rem 0;
}

.purchase-summary .item-count {
  font-size: 0.8rem;
  color: #adb5bd;
}

.section-title {
  color: #ff8c69;
  font-weight: bold;
  font-size: 0.9rem;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.payment-form-container,
.digital-wallet-container {
  background-color: #f7f8fa;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
}

.payment-option-header,
.digital-wallet-container {
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-bottom: 0.75rem;
}

.payment-option-header label,
.digital-wallet-container label {
  margin-bottom: 0;
  cursor: pointer;
}

.payment-option-header input,
.digital-wallet-container input {
  width: 20px;
  height: 20px;
  margin-right: 1rem;
  accent-color: #ff8c69;
}

.form-control {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem 1rem;
  font-size: 0.9rem;
  font-weight: bold;
}

.form-group {
  margin-bottom: 0.75rem;
}

.toggle-switch input[type='checkbox'] {
  height: 0;
  width: 0;
  visibility: hidden;
}

.toggle-switch label {
  cursor: pointer;
  width: 50px;
  height: 28px;
  background: #e0e0e0;
  display: block;
  border-radius: 100px;
  position: relative;
  margin: 0;
}

.toggle-switch label:after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  background: #fff;
  border-radius: 90px;
  transition: 0.3s;
}

.toggle-switch input:checked + label {
  background: #ff8c69;
}

.toggle-switch input:checked + label:after {
  left: calc(100% - 3px);
  transform: translateX(-100%);
}

.apple-pay-logo {
  height: 40px;
  margin-left: 0.5rem;
}

.payment-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
  z-index: 1000;
}

.pay-now-btn {
  width: 100%;
  background-color: #ff8c69;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 1rem;
}

.footer-disclaimer {
  display: flex;
  align-items: center;
  text-align: center;
  font-size: 0.7rem;
  color: #888;
  margin-bottom: 1rem;
}

.footer-disclaimer::before,
.footer-disclaimer::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e0e0e0;
}

.footer-disclaimer span {
  padding: 0 10px;
}

.payment-logos {
  display: flex;
  justify-content: center;
  align-items: center;
}

.payment-logos img {
  max-height: 50px;
  width: auto;
}

.text-orange {
  color: #ff8c69;
}

select.form-control {
  padding: 0.78rem 1rem;
  height: auto;
}
</style>
