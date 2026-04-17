<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import dayjs from 'dayjs'
import BaseModal from '@/modules/shop/components/BaseModal.vue'
import { useSubscriptions } from '../composables/useSubscriptions'

const {
  subscriptions,
  isLoading,
  hasError,
  isCancelling,
  cancelErrorMessage,
  cancelSubscription,
  fetchSubscriptions
} = useSubscriptions()

const confirmingId = ref<string | null>(null)

const showConfirmModal = computed({
  get: () => confirmingId.value !== null,
  set: (val) => {
    if (!val) confirmingId.value = null
  }
})

const errorModal = reactive({ show: false, title: '', message: '' })

onMounted(fetchSubscriptions)

function formatAmount(cents: number): string {
  return (cents / 100).toFixed(2)
}

function formatDate(date: string | null | undefined): string {
  if (!date) return '—'
  return dayjs(date).format('DD/MM/YYYY')
}

function billingLabel(
  cancelledAt: string | null | undefined,
  nextBillingAt: string | null | undefined
): string {
  if (cancelledAt) return `Cancels at ${formatDate(nextBillingAt)}`
  return `Next billing on ${formatDate(nextBillingAt)}`
}

function isActive(status: string): boolean {
  return status.toLowerCase() === 'active'
}

async function confirmCancel() {
  if (!confirmingId.value) return
  const id = confirmingId.value
  confirmingId.value = null

  const success = await cancelSubscription(id)
  if (!success) {
    errorModal.title = 'Could not cancel subscription'
    errorModal.message = cancelErrorMessage.value ?? ''
    errorModal.show = true
  }
}
</script>

<template>
  <div class="row">
    <div class="col-12">
      <h1>Subscriptions</h1>
    </div>
  </div>

  <div class="row mt-3">
    <div class="col-12">
      <div class="table-responsive">
        <table class="table table-sm">
          <thead>
            <tr class="text-center">
              <th>STATUS</th>
              <th>AMOUNT</th>
              <th>INTERVAL</th>
              <th>CARD</th>
              <th>STARTED ON</th>
              <th>BILLING</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sub in subscriptions" :key="sub.id" class="text-center align-middle">
              <td>
                <span
                  class="badge"
                  :style="
                    isActive(sub.status)
                      ? { backgroundColor: '#FF8A73', color: '#FFFFFF' }
                      : { backgroundColor: '#8A8A8A', color: '#FFFFFF' }
                  "
                >
                  {{ sub.status.toLowerCase() }}
                </span>
              </td>
              <td>AED {{ formatAmount(sub.amountCents) }}</td>
              <td>{{ sub.billingInterval }}</td>
              <td>
                {{ sub.creditCardLastFourDigits ? `•••• ${sub.creditCardLastFourDigits}` : '—' }}
              </td>
              <td>{{ formatDate(sub.createdAt) }}</td>
              <td>{{ billingLabel(sub.cancelledAt, sub.nextBillingAt) }}</td>
              <td>
                <button
                  v-if="isActive(sub.status)"
                  class="btn btn-sm btn-outline-danger"
                  @click="confirmingId = sub.id"
                >
                  Cancel subscription
                </button>
              </td>
            </tr>
            <tr v-if="subscriptions.length === 0 && !isLoading && !hasError">
              <td colspan="7" class="text-center">
                <p>YOU HAVE NO ACTIVE SUBSCRIPTIONS</p>
              </td>
            </tr>
            <tr v-if="isLoading">
              <td colspan="7" class="text-center"><p>LOADING...</p></td>
            </tr>
            <tr v-if="hasError && !isLoading">
              <td colspan="7" class="text-center text-danger">
                <p>AN ERROR OCCURRED. PLEASE TRY AGAIN.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Confirmation modal -->
  <BaseModal
    v-model="showConfirmModal"
    title="Cancel subscription"
    message="Your subscription will get cancelled at the end of the current period. Are you sure?"
    cancelText="No, keep it"
    okText="Yes, cancel"
    :okLoading="isCancelling"
    :closable="!isCancelling"
    @ok="confirmCancel"
    @cancel="confirmingId = null"
  />

  <!-- Error modal -->
  <BaseModal
    v-model="errorModal.show"
    :title="errorModal.title"
    :message="errorModal.message"
    :okText="null"
    cancelText="CLOSE"
  />
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped>
p,
td {
  font-family: 'Avenir', sans-serif;
}
</style>
