<script setup lang="ts">
//
// -----------------
// IMPORTS
// -----------------
//

// Libs & Frameworks
import { computed, inject, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

// Vuelidate Validators
import useVuelidate from '@vuelidate/core'
import { helpers, maxLength, minLength, required } from '@vuelidate/validators'

// Local Components
import BaseModal from '@/modules/shop/components/BaseModal.vue'
import DeviceFingerprint from '@/modules/shop/components/DeviceFingerprint.vue'
import DiscountCodeForm from '@/modules/shop/components/DiscountCodeForm.vue'
import CheckoutConfirmation from '@/modules/shop/components/CheckoutConfirmation.vue'
import MobileVerificationForm from '@/modules/shop/components/MobileVerificationForm.vue'

// Composables, Services & Utilities
import { useCheckout } from '@/modules/shop/composables/useCheckout'
import { useAuth } from '@/modules/auth/composables/useAuth'
import { useShoppingCart } from '@/modules/shop/composables/useShoppingCart'
import { createPayfortFormManager } from '@/modules/shop/services/PayfortFormManager'
import { isFlutterWebView, notifyPaymentFailure } from '@/modules/shop/utils/flutter-communication'
import type { IApiService } from '@/services/IApiService'
import { authService } from '@/services/authService'
import { luhnCheck } from '@/modules/shop/utils/shop-utils'
import { ERROR_UNKNOWN } from '@/utils/errorMessages'
import type { CardData } from '@/modules/shop/interfaces'

// Assets
import cardsAccepted from '../assets/images/cards_accepted.png'
import protectedByPayfort from '../assets/images/protected_by_payfort.png'
import applePay from '../assets/images/apple_pay_button_pay.png'

import { appStore } from '@/stores/appStorage'
import { SiteEnum } from '@/modules/shared/interfaces/site.enum'

//
// -----------------
// DEPENDENCIES & COMPOSABLES
// -----------------
//

const apiService = inject<IApiService>('gqlApiService')!
const { error: checkoutError, payfortFormHtml, initiatePayment } = useCheckout(apiService)
const { totalItemsInCart, detailedCart, fetchCartDetails, isLoading } = useShoppingCart(apiService)
const { user, isAuthenticated, isLoading: isAuthLoading, fetchCurrentUser } = useAuth(apiService)
const route = useRoute()

//
// -----------------
// CONSTANTS
// -----------------
//

const CURRENT_YEAR_SHORT = new Date().getFullYear() % 100
const EXPIRY_YEARS = Array.from({ length: 15 }, (_, i) =>
  (CURRENT_YEAR_SHORT + i).toString().padStart(2, '0')
)

//
// -----------------
// COMPONENT STATE
// -----------------
//

/**
 * @description Controls the loading state of the submission process.
 */
const isSubmitting = ref(false)

/**
 * @description Holds the session ID from the DeviceFingerprint component.
 */
const fingerprintSessionId = ref('')

/**
 * @description Holds any error emitted by the DeviceFingerprint component.
 */
const fingerprintError = ref<Error | null>(null)

/**
 * @description Represents the payment form data.
 */
const formData = reactive({
  cardholderName: '',
  cardNumber: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: '',
  saveForFuture: false
})

/**
 * @description Controls the state of the modal dialog.
 */
const modalState = reactive({
  show: false,
  title: '',
  message: ''
})

/**
 * @description Tracks the currently selected payment method.
 */
const selectedPaymentMethod = ref<'newCard' | 'digitalWallet' | ''>('')

/**
 * @description Tracks if the checkout is being accessed from a webview with a token.
 */
const isWebviewMode = ref(false)

/**
 * @description Stores the authentication token from URL parameters.
 */
const webviewToken = ref<string>('')

const currentStep = ref<'details' | 'confirmation'>('details')

//
// -----------------
// VALIDATION (Vuelidate)
// -----------------
//

/**
 * @description Custom Vuelidate rule for Luhn algorithm check.
 */
const luhnValidator = helpers.withMessage('Invalid card number', (value: string) => {
  // Check only if the value is not empty to avoid conflict with 'required'
  if (!value) return true
  const clean = value.replace(/\s/g, '')
  return luhnCheck(clean)
})

/**
 * @description Vuelidate validation rules for the payment form.
 */
const rules = computed(() => ({
  cardholderName: {
    required: helpers.withMessage('Field is required', required)
  },
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
  cvv: {
    required: helpers.withMessage('Field is required', required),
    minLength: helpers.withMessage('CVV must be at least 3 digits', minLength(3)),
    maxLength: helpers.withMessage('CVV must be at most 4 digits', maxLength(4))
  }
}))

const v$ = useVuelidate(rules, formData)

//
// -----------------
// COMPUTED PROPERTIES
// -----------------
//

/**
 * @description Determines if the device fingerprint is ready for payment submission.
 */
const isFingerprintReady = computed(() => !!fingerprintSessionId.value && !fingerprintError.value)

/**
 * @description Formats cart items for display in the summary.
 * @returns {string} A formatted string of items, e.g., "1 T-SHIRT / 2 SOCKS".
 */
const formattedCartItems = computed(() => {
  if (!detailedCart.value) return ''
  return detailedCart.value.items
    .map(
      (item) =>
        `${item.quantity} ${
          item.variant.name?.toUpperCase() ?? item.variant.product.title.toUpperCase()
        }`
    )
    .join(' / ')
})

// Computed to block checkout
const cartRequiresMobile = computed(() => {
  if (!detailedCart.value?.items) return false
  return detailedCart.value.items.some(item => item.variant.product.doesItRequireSmsAuth)
})

const isCheckoutBlockedByMobile = computed(() => {
  if (isAuthLoading.value || isLoading.value) return false
  return cartRequiresMobile.value && !user.value?.isMobilePhoneVerified
})

//
// -----------------
// METHODS
// -----------------
//

/**
 * @description Shows a modal with a given title and message.
 * @param {string} title - The title for the modal.
 * @param {string} message - The message content for the modal.
 */
function showErrorModal(title: string, message: string) {
  modalState.title = title
  modalState.message = message
  modalState.show = true

  // If this is an error and we're in Flutter WebView, notify about failure
  if (isFlutterWebView(isWebviewMode.value) && title.toLowerCase().includes('error')) {
    notifyPaymentFailure(isWebviewMode.value)
  }
}

/**
 * @description Handles the main form submission for the selected payment method.
 */
const handleSubmit = async () => {
  if (selectedPaymentMethod.value === 'newCard') {
    const isValid = await v$.value.$validate()
    if (!isValid) return

    if (!isFingerprintReady.value) {
      showErrorModal('Security Check Not Ready', 'Please wait a moment and try again.')
      return
    }

    currentStep.value = 'confirmation'

    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else if (selectedPaymentMethod.value === 'digitalWallet') {
    showErrorModal('Not Implemented', 'Digital wallet not supported yet.')
  }
}

const handleFinalPayment = async () => {
  isSubmitting.value = true

  try {
    await initiatePayment(fingerprintSessionId.value, {
      saveCard: formData.saveForFuture
    })

    if (checkoutError.value) throw checkoutError.value

    if (payfortFormHtml.value) {
      const formManager = createPayfortFormManager(payfortFormHtml.value)
      const cardData = {
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        expiryDate: `${formData.expiryMonth}/${formData.expiryYear}`,
        cvv: formData.cvv,
        cardholderName: formData.cardholderName,
        saveForFuture: formData.saveForFuture
      } as CardData

      formManager.addCardData(cardData)
      formManager.submit()
    } else {
      showErrorModal('Payment Error', ERROR_UNKNOWN)
    }
  } catch (error: any) {
    if (isFlutterWebView(isWebviewMode.value)) {
      notifyPaymentFailure(isWebviewMode.value)
    }
    showErrorModal('Payment Error', error?.message || 'Unexpected error.')
    isSubmitting.value = false
  }
}

/**
 * @description Handles the logic for validating and submitting a new card payment.
 */
const handleNewCardPayment = async () => {
  // 1. Validate the form
  const isValid = await v$.value.$validate()
  if (!isValid) return

  // 2. Check if the device fingerprint session is ready
  if (!isFingerprintReady.value) {
    showErrorModal(
      'Security Check Not Ready',
      'The security session is not yet ready. Please wait a moment and try again.'
    )
    return
  }

  isSubmitting.value = true

  try {
    // 3. Initiate payment with the backend to get the Payfort form
    await initiatePayment(fingerprintSessionId.value)

    // Stop if the composable reported an error (e.g., network issue)
    if (checkoutError.value) throw checkoutError.value

    // 4. Use a manager to populate and submit the received Payfort form
    if (payfortFormHtml.value) {
      const formManager = createPayfortFormManager(payfortFormHtml.value)
      const cardData = {
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        expiryDate: `${formData.expiryMonth}/${formData.expiryYear}`,
        cvv: formData.cvv,
        cardholderName: formData.cardholderName,
        saveForFuture: formData.saveForFuture
      } as CardData

      formManager.addCardData(cardData)
      formManager.submit() // The user will be redirected by the form submission.
    } else {
      showErrorModal('Payment Error', ERROR_UNKNOWN)
    }
  } catch (error: any) {
    // Notify Flutter about payment failure if in webview mode
    if (isFlutterWebView(isWebviewMode.value)) {
      notifyPaymentFailure(isWebviewMode.value)
    }

    showErrorModal(
      'Payment Error',
      error?.message || 'An unexpected error occurred. Please try again.'
    )
  } finally {
    isSubmitting.value = false
  }
}

/**
 * @description Formats the card number input by adding spaces every 4 digits.
 */
const formatCardNumber = (event: Event) => {
  const input = event.target as HTMLInputElement
  // Remove all non-digits and group them by 4
  const value = input.value.replace(/\D/g, '').match(/.{1,4}/g)
  formData.cardNumber = value ? value.join(' ') : ''
}

/**
 * @description Formats the CVV input, ensuring it only contains digits.
 */
const formatCVV = (event: Event) => {
  const input = event.target as HTMLInputElement
  formData.cvv = input.value.replace(/\D/g, '').slice(0, 4)
}

/**
 * @description Handler for when mobile verification is completed.
 */
const onMobileVerified = async () => { 
  await fetchCurrentUser()  
}

//
// -----------------
// LIFECYCLE HOOKS
// -----------------
//

/**
 * @description When the component is mounted, fetch essential data.
 */
onMounted(() => {
  const store = appStore()

  const token = route.query.token as string
  const siteParam = route.query.site as string

  if (siteParam) {
    const matchedSite = Object.values(SiteEnum).find(
      (s) => s.toLowerCase() === siteParam.toLowerCase()
    )

    if (matchedSite) {
      console.log(`Webview: Switching site to ${matchedSite}`)
      store.setSite(matchedSite as SiteEnum)
    } else {
      console.warn(`Webview: Invalid site parameter received: ${siteParam}`)
    }
  }

  // Check if token is provided in URL (webview mode)
  if (token) {
    isWebviewMode.value = true
    webviewToken.value = token
    authService.setWebviewToken(token)
  }

  // Fetch the current user's data to display in the header.
  fetchCurrentUser()

  // Fetch the full, detailed cart data to ensure totals and items are correct.
  // This makes the page resilient to users arriving here directly.
  fetchCartDetails()
})

//
// -----------------
// EVENT HANDLERS (from Child Components)
// -----------------
//

/**
 * @description Handles the 'ready' event from the DeviceFingerprint component.
 * @param {string} sessionId - The session ID generated by the fingerprint service.
 */
const onFingerprintReady = (sessionId: string) => {
  fingerprintSessionId.value = sessionId
  fingerprintError.value = null
}

/**
 * @description Handles the 'error' event from the DeviceFingerprint component.
 * @param {Error} error - The error object from the fingerprint service.
 */
const onFingerprintError = (error: Error) => {
  fingerprintError.value = error
  showErrorModal(
    'Security Error',
    'Please disable your adblocker. Our anti fraud system will not work if your adblocker is running. Add this domain as an exception to you adblocker and payments will be able to run normally.'
  )
}
</script>

<template>
  <div>
    <!-- This component runs in the background to prepare the device fingerprint for Payfort -->
    <DeviceFingerprint
      session-id-input-id="fingerprint_session_id"
      @ready="onFingerprintReady"
      @error="onFingerprintError"
    />

    <div v-show="currentStep === 'details'" class="main-container">
      <div class="main-container">
        <a href="#" class="back-arrow"><i class="fas fa-chevron-left"></i></a>

        <!-- Header -->
        <h2 class="header-title">PAYMENT DETAILS</h2>
        <p v-if="isAuthLoading" class="header-subtitle">LOADING USER...</p>
        <p v-else-if="isAuthenticated" class="header-subtitle">
          LOGGED IN AS {{ user?.firstName?.toUpperCase() }} {{ user?.lastName?.toUpperCase() }}
        </p>

        <!-- Purchase Summary -->
        <div class="purchase-summary">
          <div class="summary-header">
            <h5 class="text-orange">YOU ARE BUYING:</h5>
            <router-link v-if="!isWebviewMode" to="/shop/cart" class="edit-cart-link">
              Edit Cart
            </router-link>
          </div>
          <div v-if="isLoading" class="loading-state">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span style="margin-left: 0.5rem">Loading items...</span>
          </div>
          <div v-else>
            <h5>{{ formattedCartItems }}</h5>
            <p>{{ detailedCart?.formattedTotal }}</p>
            <span class="item-count">{{ totalItemsInCart }} items</span>
          </div>
          <details>
            <summary>Do you have a discount code?</summary>
            <DiscountCodeForm />
          </details>
        </div>

        <div v-if="isCheckoutBlockedByMobile" class="mt-4">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-12 col-md-8 col-lg-6">
                <MobileVerificationForm @verified="onMobileVerified" />
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-12 col-md-8 col-lg-8">
                <!-- New Card Payment Option -->
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

                  <!-- Card Details Form (Conditional) -->
                  <div v-if="selectedPaymentMethod === 'newCard'">
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
                          <option v-for="y in EXPIRY_YEARS" :key="y" :value="y">
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
                </div>

                <!-- Digital Wallet Payment Option -->
                <p class="section-title mt-4">PAY WITH YOUR DIGITAL WALLET</p>
                <div class="digital-wallet-container">
                  <input
                    type="radio"
                    id="digitalWallet"
                    value="digitalWallet"
                    name="paymentMethod"
                    v-model="selectedPaymentMethod"
                  />
                  <label for="digitalWallet">PAY WITH</label>
                  <img :src="applePay" alt="Apple Pay" class="apple-pay-logo" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sticky Footer for Action Button -->
      <footer class="payment-footer">
        <button
          class="pay-now-btn"
          @click="handleSubmit"
          :disabled="isSubmitting || selectedPaymentMethod === ''"
        >
          <span
            v-if="isSubmitting"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span v-if="!isSubmitting">PAY NOW</span>
          <span v-else style="margin-left: 0.5rem">PROCESSING...</span>
        </button>
        <div class="footer-disclaimer">
          <span>WE ACCEPT PAYMENTS ONLINE USING VISA AND MASTERCARD CREDIT/DEBIT CARD IN AED</span>
        </div>
        <div class="payment-logos">
          <img :src="cardsAccepted" alt="Cards Accepted" />
          <img :src="protectedByPayfort" alt="Protected by Payfort" />
        </div>
      </footer>
    </div>
    <div v-if="currentStep === 'confirmation'">
      <CheckoutConfirmation
        :cart="detailedCart"
        :is-loading="isSubmitting"
        @confirm="handleFinalPayment"
        @back="currentStep = 'details'"
      />
    </div>

    <!-- Modal for showing errors or messages -->
    <BaseModal
      v-model="modalState.show"
      :title="modalState.title"
      :message="modalState.message"
      :okText="null"
      cancelText="CLOSE"
    />
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
/* Main Layout */
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

/* Header */
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

.webview-indicator {
  color: #ff8c69;
  font-weight: bold;
  font-size: 0.8rem;
}

/* Purchase Summary */
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

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #adb5bd;
  font-size: 0.9rem;
}

/* Section Title */
.section-title {
  color: #ff8c69;
  font-weight: bold;
  font-size: 0.9rem;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

/* Form Containers */
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

/* Form Inputs */
.form-group {
  margin-bottom: 0.75rem;
}

.form-control {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem 1rem;
  font-size: 0.9rem;
  font-weight: bold;
}

select.form-control {
  padding: 0.78rem 1rem;
  height: auto;
}

/* Digital Wallet */
.apple-pay-logo {
  height: 40px;
  margin-left: 0.5rem;
}

/* Footer */
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
  font-family: 'BigJohn', sans-serif;
}

.pay-now-btn:disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
}

.pay-now-btn span {
  font-family: inherit;
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

/* Utility */
.text-orange {
  color: #ff8c69;
}

.summary-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.summary-header .text-orange {
  margin: 0 auto;
}

.edit-cart-link {
  color: #fff;
  text-decoration: underline;
  font-size: 0.9rem;
  font-weight: normal;
  cursor: pointer;
}

.edit-cart-link:hover {
  color: #ff8c69;
}

/* Responsive */
@media (max-width: 576px) {
  .main-container {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
