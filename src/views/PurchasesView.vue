<script lang="ts">
interface Purchase {
  activationDateTime: Date
  allowanceObtained: number
  allowanceRemaining: number
  expirationDateTime: Date
  packageName: string
  paymentDateTime: Date
}
</script>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import type { ApiService } from '@/services/apiService'
import { appStore } from '@/stores/appStorage'

const apiService = inject<ApiService>('gqlApiService')!

const isLoading = ref<boolean>(false)
const purchases = ref<Purchase[]>([])

onMounted(() => {
  getCurrentUserPurchases()
})

async function getCurrentUserPurchases() {
  purchases.value = []

  isLoading.value = true

  purchases.value = (await apiService.getCurrentUserPurchases(appStore().site)) as Purchase[]

  isLoading.value = false
}
</script>

<template>
  <div class="row">
    <div class="col-12">
      <h1 class="page-title">Purchases</h1>
    </div>
  </div>
  <div class="row mt-3">
    <div class="col-12">
      <table class="table table-sm">
        <thead>
          <tr class="text-center">
            <th>PACKAGE NAME</th>
            <th>PURCHASED COUNT</th>
            <th>REMAINING COUNT</th>
            <th>PAYMENT DATE</th>
            <th>ACTIVATION DATE</th>
            <th>EXPIRATION DATE</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in purchases" :key="index">
            <td>{{ item.packageName }}</td>
            <td class="text-center">{{ item.allowanceObtained }}</td>
            <td class="text-center">{{ item.allowanceRemaining }}</td>
            <td class="text-center">
              {{ dayjs(new Date(item.paymentDateTime)).format('DD/MM/YYYY') }}
            </td>
            <td class="text-center">
              {{ dayjs(new Date(item.activationDateTime)).format('DD/MM/YYYY') }}
            </td>
            <td class="text-center">
              {{ dayjs(new Date(item.expirationDateTime)).format('DD/MM/YYYY') }}
            </td>
          </tr>
          <tr v-if="purchases?.length === 0 && !isLoading">
            <td colspan="6">
              <p>No data available in table</p>
            </td>
          </tr>
          <tr v-if="isLoading">
            <td colspan="6">loading...</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
