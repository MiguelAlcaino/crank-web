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

const siteDateTimeNow = ref<Date>(new Date())
const isLoading = ref<boolean>(false)
const purchases = ref<Purchase[]>([])

onMounted(() => {
  getCurrentUserPurchases()
})

async function getCurrentUserPurchases() {
  purchases.value = []

  isLoading.value = true

  await getSiteDateTimeNow()

  purchases.value = (await apiService.getCurrentUserPurchases(appStore().site)) as Purchase[]

  purchases.value = purchases.value
    .slice()
    .sort((a, b) => (a.paymentDateTime > b.paymentDateTime ? -1 : 1))

  isLoading.value = false
}

async function getSiteDateTimeNow() {
  siteDateTimeNow.value = new Date()

  const siteSetting = await apiService.getSiteSettings(appStore().site)

  if (siteSetting) siteDateTimeNow.value = new Date(siteSetting.siteDateTimeNow)
}
</script>

<template>
  <div class="row">
    <div class="col-12">
      <h1>Purchases</h1>
    </div>
  </div>
  <div class="row mt-3">
    <div class="col-12">
      <div class="table-responsive">
        <table class="table table-sm">
          <thead>
            <tr class="text-center">
              <th>PACKAGES</th>
              <th>TOTAL CREDITS</th>
              <th>BALANCE</th>
              <th>PURCHASED ON</th>
              <th>ACTIVATED ON</th>
              <th>EXPIRY DATE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in purchases"
              :key="index"
              :class="{
                isDisabled:
                  dayjs(new Date(item.expirationDateTime)).isBefore(siteDateTimeNow) ||
                  item.allowanceRemaining === 0
              }"
            >
              <td class="align-middle">
                <div class="row">
                  <div class="col-1" style="text-align: right">
                    <i class="bi bi-bag-fill" style="font-size: 1.5rem"></i>
                  </div>
                  <div class="col align-middle" style="text-align: left; padding-top: 4px">
                    {{ item.packageName.toUpperCase() }}
                  </div>
                </div>
              </td>
              <td class="text-center align-middle">{{ item.allowanceObtained }}</td>
              <td class="text-center align-middle">{{ item.allowanceRemaining }}</td>
              <td class="text-center align-middle">
                {{ dayjs(new Date(item.paymentDateTime)).format('DD/MM/YYYY') }}
              </td>
              <td class="text-center align-middle">
                {{ dayjs(new Date(item.activationDateTime)).format('DD/MM/YYYY') }}
              </td>
              <td class="text-center align-middle">
                {{ dayjs(new Date(item.expirationDateTime)).format('DD/MM/YYYY') }}
              </td>
              <td class="text-center align-middle">
                <span v-if="dayjs(new Date(item.expirationDateTime)).isBefore(siteDateTimeNow)">
                  EXPIRED
                </span>
                <span v-else-if="item.allowanceRemaining === 0"> FULLY CONSUMED </span>
                <span v-else> ACTIVE </span>
              </td>
            </tr>
            <tr v-if="purchases?.length === 0 && !isLoading">
              <td colspan="7">
                <p>No data available in table</p>
              </td>
            </tr>
            <tr v-if="isLoading" class="text-center align-middle">
              <td colspan="7">LOADING...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.isDisabled {
  background-color: rgb(214, 214, 214);
}
</style>
