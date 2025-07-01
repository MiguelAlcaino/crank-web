<script setup lang="ts">
import { computed, inject, reactive, ref } from 'vue'

// Components
import DeviceFingerprint from '@/modules/shop/components/DeviceFingerprint.vue'

// Composables, Services & Utilities
import { useCheckout } from '@/modules/shop/composables/useCheckout'
import { createPayfortFormManager } from '@/modules/shop/services/PayfortFormManager'
import type { IApiService } from '@/services/ApiService'
import type { CardData } from '@/modules/shop/interfaces/card-data'
import { luhnCheck } from '@/modules/shop/utils/shop-utils'

// --- Dependencies & State from Composables ---
const apiService = inject<IApiService>('gqlApiService')!
const { error: checkoutError, payfortFormHtml, initiatePayment } = useCheckout(apiService)

// --- Component-Specific State ---
const isSubmitting = ref(false)

// State for the Device Fingerprint, controlled by the child component's events.
const fingerprintSessionId = ref('')
const fingerprintError = ref<Error | null>(null)
const isFingerprintReady = computed(() => !!fingerprintSessionId.value && !fingerprintError.value)

// State for the credit card form.
const cardData = reactive<CardData>({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: '',
  saveForFuture: false
})

const formErrors = reactive({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: ''
})

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

// --- Form Submission Logic ---

/**
 * Orchestrates the entire payment process on form submission.
 */
const handleSubmit = async () => {
  if (!validateForm()) return

  // Guard clause to ensure the security fingerprint is ready before proceeding.
  if (!isFingerprintReady.value) {
    alert('Security session is not yet ready. Please wait a moment.')
    return
  }

  isSubmitting.value = true

  try {
    // 1. Call the composable to get the base Payfort form HTML from the backend.
    await initiatePayment(fingerprintSessionId.value)

    // 2. Stop if the composable reported an error.
    if (checkoutError.value) throw checkoutError.value

    // 3. Use a dedicated service to handle DOM manipulation and form submission.
    if (payfortFormHtml.value) {
      const formManager = createPayfortFormManager(payfortFormHtml.value)
      formManager.addCardData(cardData)
      formManager.submit()
      // The user will be redirected by the form submission.
    } else {
      throw new Error('Failed to generate the payment form.')
    }
  } catch (error) {
    // TODO: Implement a user-friendly error display (e.g., a toast notification).
    console.error('Submission failed:', error)
    alert('An error occurred during payment. Please check your details and try again.')
  } finally {
    isSubmitting.value = false
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
  cardData.cardNumber = value
}

const formatExpiryDate = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '') // Remove all non-digits
  if (value.length > 2) {
    // Add a slash after the first two digits (month)
    value = value.substring(0, 2) + '/' + value.substring(2, 4)
  }
  cardData.expiryDate = value
}

const validateForm = (): boolean => {
  // Reset previous errors before validating again.
  Object.assign(formErrors, { cardNumber: '', expiryDate: '', cvv: '', cardholderName: '' })
  let isValid = true

  // Card Number Validation
  const cardNumberClean = cardData.cardNumber.replace(/\s/g, '')
  if (!cardNumberClean) {
    formErrors.cardNumber = 'Card number is required'
    isValid = false
  } else if (!/^\d{13,19}$/.test(cardNumberClean)) {
    formErrors.cardNumber = 'Card number must be between 13 and 19 digits'
    isValid = false
  } else if (!luhnCheck(cardNumberClean)) {
    formErrors.cardNumber = 'Invalid card number'
    isValid = false
  }

  // Expiry Date Validation
  if (!cardData.expiryDate) {
    formErrors.expiryDate = 'Expiration date is required'
    isValid = false
  } else if (!/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
    formErrors.expiryDate = 'Invalid format (must be MM/YY)'
    isValid = false
  } else {
    const [month, year] = cardData.expiryDate.split('/')
    const currentYear = new Date().getFullYear() % 100
    const currentMonth = new Date().getMonth() + 1
    if (
      parseInt(year) < currentYear ||
      (parseInt(year) === currentYear && parseInt(month) < currentMonth)
    ) {
      formErrors.expiryDate = 'Card has expired'
      isValid = false
    }
  }

  // CVV Validation
  if (!cardData.cvv) {
    formErrors.cvv = 'CVV is required'
    isValid = false
  } else if (!/^\d{3,4}$/.test(cardData.cvv)) {
    formErrors.cvv = 'CVV must be 3 or 4 digits'
    isValid = false
  }

  // Cardholder Name Validation
  if (!cardData.cardholderName.trim()) {
    formErrors.cardholderName = "Cardholder's name is required"
    isValid = false
  }

  return isValid
}

const cardType = computed(() => {
  const number = cardData.cardNumber.replace(/\s/g, '')
  if (number.startsWith('4')) return 'Visa'
  if (/^5[1-5]/.test(number)) return 'MasterCard'
  if (/^3[47]/.test(number)) return 'American Express'
  return ''
})
</script>

<template>
  <div class="payment-form-container mt-3">
    <h2>Secure Payment</h2>

    <!--
      The DeviceFingerprint component is invisible to the user but essential for the payment flow.
      It handles the loading of the third-party security script and reports its status.
    -->
    <DeviceFingerprint
      session-id-input-id="fingerprint_session_id"
      @ready="onFingerprintReady"
      @error="onFingerprintError"
    />

    <form @submit.prevent="handleSubmit" class="payment-form" novalidate>
      <div class="form-group">
        <label for="cardNumber">Card Number</label>
        <input
          id="cardNumber"
          v-model="cardData.cardNumber"
          type="tel"
          inputmode="numeric"
          placeholder="XXXX XXXX XXXX XXXX"
          @input="formatCardNumber"
          maxlength="19"
          :class="{ error: formErrors.cardNumber }"
          required
        />
        <span v-if="formErrors.cardNumber" class="error-message">{{ formErrors.cardNumber }}</span>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="expiryDate">Expiration Date</label>
          <input
            id="expiryDate"
            v-model="cardData.expiryDate"
            type="tel"
            inputmode="numeric"
            placeholder="MM/YY"
            @input="formatExpiryDate"
            maxlength="5"
            :class="{ error: formErrors.expiryDate }"
            required
          />
          <span v-if="formErrors.expiryDate" class="error-message">{{
            formErrors.expiryDate
          }}</span>
        </div>

        <div class="form-group">
          <label for="cvv">CVV</label>
          <input
            id="cvv"
            v-model="cardData.cvv"
            type="tel"
            inputmode="numeric"
            placeholder="XXX"
            maxlength="4"
            :class="{ error: formErrors.cvv }"
            required
          />
          <span v-if="formErrors.cvv" class="error-message">{{ formErrors.cvv }}</span>
        </div>
      </div>

      <div class="form-group">
        <label for="cardholderName">Cardholder Name</label>
        <input
          id="cardholderName"
          v-model="cardData.cardholderName"
          type="text"
          placeholder="Full name as it appears on card"
          @input="cardData.cardholderName = ($event.target as HTMLInputElement).value.toUpperCase()"
          :class="{ error: formErrors.cardholderName }"
          required
        />
        <span v-if="formErrors.cardholderName" class="error-message">{{
          formErrors.cardholderName
        }}</span>
      </div>

      <div class="checkbox-group">
        <input type="checkbox" id="saveCard" v-model="cardData.saveForFuture" />
        <label for="saveCard" class="checkbox-label">Save this card for future payments</label>
      </div>

      <!-- Display a critical error if the security initialization fails. -->
      <div v-if="fingerprintError" class="error-message">
        Security initialization failed: {{ fingerprintError.message }}. Please refresh the page.
      </div>

      <!--
        The submit button's state is dynamically controlled, providing clear feedback to the user.
        It's disabled until the fingerprint is ready and during submission.
      -->
      <button type="submit" class="submit-button" :disabled="isSubmitting || !isFingerprintReady">
        <span v-if="isSubmitting">Processing...</span>
        <span v-else-if="!isFingerprintReady">Initializing Secure Payment...</span>
        <span v-else>Pay Now</span>
      </button>
    </form>
  </div>
</template>
<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
<style scoped>
.payment-form-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .form-group {
  flex: 1;
}

label {
  font-size: 14px;
  margin-bottom: 5px;
  color: #555;
  font-weight: 500;
}

input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #3f51b5;
  box-shadow: 0 0 0 2px rgba(63, 81, 181, 0.2);
}

input.error {
  border-color: #f44336;
}

.error-message {
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.checkbox-group input[type='checkbox'] {
  margin-right: 8px;
  width: 16px;
  height: 16px;
}

.checkbox-label {
  font-size: 14px;
  color: #555;
  margin-bottom: 0;
}

.submit-button {
  margin-top: 16px;
  padding: 12px;
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, opacity 0.3s;
}

.submit-button:hover:not(:disabled) {
  background-color: #333;
}

.submit-button:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>