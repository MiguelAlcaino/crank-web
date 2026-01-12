<script setup lang="ts">
import { inject } from 'vue'
import type { ApiService } from '@/services/ApiService'
import { useAfterCheckout } from '@/modules/shop/composables/useAfterCheckout'
import { useRoute, useRouter } from 'vue-router'
import { PaymentTransactionStatusEnum } from '@/gql/graphql'
import {
  isFlutterWebView,
  notifyPaymentFailure,
  notifyPaymentPending,
  notifyPaymentSuccess
} from '@/modules/shop/utils/flutter-communication'

// Local Components
import CrankCircularProgressIndicator from '@/components/CrankCircularProgressIndicator.vue'

const router = useRouter()
const route = useRoute()
const apiService = inject<ApiService>('gqlApiService')!
const {
  isLoading,
  hasError,
  errorMessage,
  purchaseStatus,
  merchantReference,
  retryCount,
  maxRetries,
  isRetrying
} = useAfterCheckout(apiService)

const goToShop = () => {
  const hasWebviewToken = !!route.query.token
  const inFlutter = isFlutterWebView(hasWebviewToken)

  // Flutter WebView handling
  if (inFlutter) {
    // SUCCESS
    if (purchaseStatus.value === PaymentTransactionStatusEnum.Successful) {
      notifyPaymentSuccess(hasWebviewToken)
      return
    }

    // ERROR
    if (
      purchaseStatus.value === PaymentTransactionStatusEnum.Rejected ||
      purchaseStatus.value === PaymentTransactionStatusEnum.Refunded ||
      hasError.value
    ) {
      notifyPaymentFailure(hasWebviewToken)
      return
    }

    // PENDING
    notifyPaymentPending(hasWebviewToken)
    return
  }

  // 2. Web handling
  if (
    purchaseStatus.value === PaymentTransactionStatusEnum.Rejected ||
    purchaseStatus.value === PaymentTransactionStatusEnum.Refunded ||
    hasError.value
  ) {
    router.push('/shop/cart')
  } else {
    router.push('/shop/products')
  }
}
</script>

<template>
  <div class="after-checkout-container">
    <!-- 1. Loading State -->
    <div v-if="isLoading" class="status-card">
      <CrankCircularProgressIndicator text="Verifying your payment..." />
      <p class="text-muted mt-3">Please wait a moment.</p>
    </div>

    <!-- 2. Verification Error State -->
    <div v-else-if="hasError" class="status-card error">
      <div class="icon-wrapper">
        <!-- Error icon (X) -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>
      <h2>Verification Error</h2>
      <p>We could not verify the status of your purchase.</p>
      <p class="error-message">{{ errorMessage }}</p>
      <button @click="goToShop" class="btn-primary">Back to Shop</button>
    </div>

    <!-- 3. Successful Purchase -->
    <div
      v-else-if="purchaseStatus === PaymentTransactionStatusEnum.Successful"
      class="status-card success"
    >
      <div class="icon-wrapper">
        <!-- Success icon (check) -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <h2>Thank you for your purchase!</h2>
      <p>Your payment has been processed successfully.</p>
      <p class="text-muted small">We have sent a confirmation email with your order details.</p>
      <p class="text-muted small">Reference: {{ merchantReference }}</p>
      <button @click="goToShop" class="btn-primary">Continue Shopping</button>
    </div>

    <!-- 4. Pending/Waiting Confirmation -->
    <div
      v-else-if="purchaseStatus === PaymentTransactionStatusEnum.WaitingConfirmation"
      class="status-card pending"
    >
      <div class="icon-wrapper">
        <!-- Pending icon (clock) -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </div>
      <h2>Payment Processing</h2>
      <p>Your payment is currently being processed and is awaiting final confirmation.</p>
      <p class="text-muted small">
        You will receive an email as soon as the transaction is complete. Please do not attempt to
        pay again.
      </p>

      <!-- Retry information -->
      <div v-if="isRetrying" class="retry-info">
        <div class="retry-indicator">
          <div class="spinner"></div>
          <span>Checking status... ({{ retryCount }}/{{ maxRetries }})</span>
        </div>
        <p class="text-muted small">We're automatically checking for updates every 2 seconds.</p>
      </div>

      <button @click="goToShop" class="btn-primary">Back to Shop</button>
    </div>

    <!-- 5. Rejected or Refunded Payment -->
    <div
      v-else-if="
        purchaseStatus === PaymentTransactionStatusEnum.Rejected ||
        purchaseStatus === PaymentTransactionStatusEnum.Refunded
      "
      class="status-card failure"
    >
      <div class="icon-wrapper">
        <!-- Alert icon (warning) -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
          ></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>
      <h2>Payment Not Completed</h2>
      <p v-if="purchaseStatus === PaymentTransactionStatusEnum.Rejected">
        Your payment was rejected by the payment provider.
      </p>
      <p v-if="purchaseStatus === PaymentTransactionStatusEnum.Refunded">
        This transaction has been refunded.
      </p>
      <p class="text-muted small">
        No charge was made to your card, or it will be reversed shortly.
      </p>
      <router-link to="/shop/cart" class="btn-primary">Back to Cart</router-link>
    </div>

    <!-- 6. Fallback for any other status -->
    <div v-else class="status-card failure">
      <div class="icon-wrapper">
        <!-- Question mark icon for unknown status -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>
      <h2>Unknown Status</h2>
      <p>
        An unknown status was returned for your transaction. Please contact support for assistance.
      </p>
      <p class="text-muted small">Reference: {{ merchantReference }}</p>
      <button @click="goToShop" class="btn-primary">Back to Shop</button>
    </div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped>
.after-checkout-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f5f7;
  font-family: 'Avenir', sans-serif;
  padding: 2rem;
}

.status-card {
  background-color: white;
  padding: 3rem 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.icon-wrapper {
  margin-bottom: 1.5rem;
}

.status-card.success .icon-wrapper {
  color: #28a745;
}
.status-card.error .icon-wrapper,
.status-card.failure .icon-wrapper {
  color: #dc3545;
}
.status-card.pending .icon-wrapper {
  color: #ffc107;
}

.retry-info {
  margin: 1.5rem 0;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #ffc107;
}

.retry-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e3e3e3;
  border-top: 2px solid #ffc107;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

h2 {
  font-family: 'BigJohn', sans-serif;
  font-size: 2rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
}

.error-message {
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  display: inline-block;
}

.btn-primary {
  background-color: #ff8c69;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 1rem 3rem;
  font-family: 'Avenir', sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1.5rem;
  text-decoration: none;
  display: inline-block;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}
</style>
