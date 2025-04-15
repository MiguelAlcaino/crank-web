<script setup lang="ts">
import { reactive, ref, computed, inject } from 'vue'

import type { ApiService } from '@/services/apiService'
import type { CardData } from '@/modules/shop/interfaces/card-data'
import { useCheckout } from '@/modules/shop/composables/useCheckout'
import { luhnCheck, convertDateFormat } from '@/modules/shop/utils/shop-utils'
import FingerprintHiddenInput from '@/modules/shop/components/FingerprintHiddenInput.vue'

const apiService = inject<ApiService>('gqlApiService')!
const { getPayfortForm } = useCheckout(apiService)

const fingerprintInputId = 'device_fingerprint'

interface FormErrors {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
}

const cardData = reactive<CardData>({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: '',
  saveForFuture: false
})

const errors = reactive<FormErrors>({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: ''
})

const isSubmitting = ref(false)

const cardType = computed(() => {
  const number = cardData.cardNumber.replace(/\s/g, '')
  if (number.startsWith('4')) {
    return 'Visa'
  } else if (/^5[1-5]/.test(number)) {
    return 'MasterCard'
  } else if (/^3[47]/.test(number)) {
    return 'American Express'
  } else if (/^6(?:011|5)/.test(number)) {
    return 'Discover'
  } else {
    return ''
  }
})

const formatCardNumber = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')

  // Add spaces every 4 digits
  if (value.length > 0) {
    value = value.match(new RegExp('.{1,4}', 'g'))?.join(' ') || ''
  }

  cardData.cardNumber = value
}

const formatExpiryDate = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')

  if (value.length > 2) {
    value = value.substring(0, 2) + '/' + value.substring(2)
  }

  cardData.expiryDate = value
}

const validateForm = (): boolean => {
  let isValid = true

  // Reset errors
  errors.cardNumber = ''
  errors.expiryDate = ''
  errors.cvv = ''
  errors.cardholderName = ''

  // Validate card number - allow masked numbers for saved cards
  const cardNumberClean = cardData.cardNumber.replace(/\s/g, '')
  if (!cardNumberClean) {
    errors.cardNumber = 'Card number is required'
    isValid = false
  } else if (!cardNumberClean.startsWith('****') && !/^\d{13,19}$/.test(cardNumberClean)) {
    errors.cardNumber = 'The card number must be between 13 and 19 digits'
    isValid = false
  } else if (!cardNumberClean.startsWith('****') && !luhnCheck(cardNumberClean)) {
    errors.cardNumber = 'Invalid card number'
    isValid = false
  }

  // Validate expiry date
  if (!cardData.expiryDate) {
    errors.expiryDate = 'Expiration date is required'
    isValid = false
  } else {
    const [month, year] = cardData.expiryDate.split('/')
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1

    if (!/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
      errors.expiryDate = 'Invalid format (MM/YY)'
      isValid = false
    } else if (parseInt(month) < 1 || parseInt(month) > 12) {
      errors.expiryDate = 'Invalid month'
      isValid = false
    } else if (
      parseInt(year) < currentYear ||
      (parseInt(year) === currentYear && parseInt(month) < currentMonth)
    ) {
      errors.expiryDate = 'Card has expired'
      isValid = false
    }
  }

  // Validate CVV
  if (!cardData.cvv) {
    errors.cvv = 'CVV is required'
    isValid = false
  } else if (!/^\d{3,4}$/.test(cardData.cvv)) {
    errors.cvv = 'The CVV must be 3 or 4 digits long.'
    isValid = false
  }

  // Validate cardholder name
  if (!cardData.cardholderName.trim()) {
    errors.cardholderName = "Holder's name is required"
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const fingerprintElement = document.getElementById(fingerprintInputId) as HTMLInputElement

    // Get HTML form as string
    let hiddenPayFormHtml = await getPayfortForm(fingerprintElement.value)

    // Create a temporary container and assign the HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = hiddenPayFormHtml

    // Get the form from the inserted HTML
    const formElement = tempDiv.querySelector('form') as HTMLFormElement

    if (formElement) {
      // card_holder_name
      const cardholderNameInput = document.createElement('input')
      cardholderNameInput.type = 'hidden'
      cardholderNameInput.name = 'card_holder_name'
      cardholderNameInput.value = cardData.cardholderName

      // card_number
      const cardNumberInput = document.createElement('input')
      cardNumberInput.type = 'hidden'
      cardNumberInput.name = 'card_number'
      cardNumberInput.value = cardData.cardNumber.replace(/\s/g, '')

      // expiry_date
      const expiryDateInput = document.createElement('input')
      expiryDateInput.type = 'hidden'
      expiryDateInput.name = 'expiry_date'
      expiryDateInput.value = convertDateFormat(cardData.expiryDate)

      // card_security_code
      const cardSecurityCodeInput = document.createElement('input')
      cardSecurityCodeInput.type = 'hidden'
      cardSecurityCodeInput.name = 'card_security_code'
      cardSecurityCodeInput.value = cardData.cvv

      // remember_me
      const rememberMeInput = document.createElement('input')
      rememberMeInput.type = 'hidden'
      rememberMeInput.name = 'remember_me'
      rememberMeInput.value = cardData.saveForFuture ? 'YES' : 'NO'

      // Find the submit button
      const submitButton = formElement.querySelector('input[type="submit"]')

      if (submitButton) {
        submitButton.id = 'submitButton'

        // Insert new inputs after the submit button
        submitButton.insertAdjacentElement('beforebegin', cardholderNameInput)
        submitButton.insertAdjacentElement('beforebegin', cardNumberInput)
        submitButton.insertAdjacentElement('beforebegin', expiryDateInput)
        submitButton.insertAdjacentElement('beforebegin', cardSecurityCodeInput)
        submitButton.insertAdjacentElement('beforebegin', rememberMeInput)
      }

      formElement.style.cssText = 'visibility: hidden;'

      document.body.appendChild(formElement)
      formElement.submit()
    } else {
      console.error('Form not found in generated HTML')
    }
  } catch (error) {
    // TODO: Handle error
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="payment-form-container mt-3">
    <h2>Payment Form</h2>
    <form @submit.prevent="handleSubmit" class="payment-form">
      <div class="form-group">
        <label for="cardNumber">Card Number</label>
        <input
          id="cardNumber"
          v-model="cardData.cardNumber"
          type="text"
          placeholder="XXXX XXXX XXXX XXXX"
          @input="formatCardNumber"
          maxlength="19"
          :class="{ error: errors.cardNumber }"
        />
        <span v-if="errors.cardNumber" class="error-message">{{ errors.cardNumber }}</span>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="expiryDate">Expiration Date</label>
          <input
            id="expiryDate"
            v-model="cardData.expiryDate"
            type="text"
            placeholder="MM/AA"
            @input="formatExpiryDate"
            maxlength="5"
            :class="{ error: errors.expiryDate }"
          />
          <span v-if="errors.expiryDate" class="error-message">{{ errors.expiryDate }}</span>
        </div>

        <div class="form-group">
          <label for="cvv">CVV</label>
          <input
            id="cvv"
            v-model="cardData.cvv"
            type="text"
            placeholder="XXX"
            maxlength="4"
            :class="{ error: errors.cvv }"
          />
          <span v-if="errors.cvv" class="error-message">{{ errors.cvv }}</span>
        </div>
      </div>

      <div class="form-group">
        <label for="cardholderName">Cardholder Name</label>
        <input
          id="cardholderName"
          v-model="cardData.cardholderName"
          type="text"
          placeholder="Full name"
          @input="cardData.cardholderName = cardData.cardholderName.toUpperCase()"
          :class="{ error: errors.cardholderName }"
        />
        <span v-if="errors.cardholderName" class="error-message">{{ errors.cardholderName }}</span>
      </div>

      <div class="checkbox-group">
        <input type="checkbox" id="saveCard" v-model="cardData.saveForFuture" />
        <label for="saveCard" class="checkbox-label">Save this card for future payments</label>
      </div>

      <div class="card-type" v-if="cardType">
        <span>Card type: {{ cardType }}</span>
      </div>

      <button type="submit" class="submit-button" :disabled="isSubmitting">
        {{ isSubmitting ? 'Processing...' : 'Pay' }}
      </button>
    </form>
    <FingerprintHiddenInput :input-id="fingerprintInputId" />
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

h2,
h3 {
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
  width: 18px;
  height: 18px;
}

.checkbox-label {
  font-size: 14px;
  color: #555;
  margin-bottom: 0;
}

.card-type {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
}

.submit-button {
  margin-top: 16px;
  padding: 12px;
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #2f2f2f;
}

.submit-button:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

.saved-cards-section {
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.saved-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.saved-card:hover {
  background-color: #f5f5f5;
}

.saved-card-info {
  display: flex;
  flex-direction: column;
}

.saved-card-type {
  font-weight: bold;
  color: #333;
}

.saved-card-number {
  font-size: 14px;
  color: #555;
}

.saved-card-expiry {
  font-size: 12px;
  color: #777;
}

.remove-card-btn {
  background: none;
  border: none;
  color: #f44336;
  font-size: 20px;
  cursor: pointer;
  padding: 0 8px;
}

.remove-card-btn:hover {
  color: #d32f2f;
}
</style>
