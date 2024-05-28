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

import { ERROR_UNKNOWN } from '@/utils/errorMessages'

import SiteSelector from '@/components/SiteSelector.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import PaginationComponent from '@/components/PaginationComponent.vue'

const apiService = inject<ApiService>('gqlApiService')!

const siteDateTimeNow = ref<Date>(new Date())
const isLoading = ref<boolean>(false)
const purchases = ref<Purchase[]>([])
const pageLimit = 50
const currentPage = ref<number>(1)
const total = ref<number>(0)
const errorModalIsVisible = ref<boolean>(false)

onMounted(() => {
  currentUserPurchasesPaginated()
})

async function currentUserPurchasesPaginated() {
  purchases.value = []

  isLoading.value = true

  try {
    await getSiteDateTimeNow()

    const paginatedPurchases = await apiService.currentUserPurchasesPaginated(appStore().site, {
      limit: pageLimit,
      page: currentPage.value
    })

    total.value = paginatedPurchases.total
    purchases.value = paginatedPurchases.purchases as Purchase[]
  } catch (error) {
    errorModalIsVisible.value = true
  } finally {
    isLoading.value = false
  }
}

async function getSiteDateTimeNow() {
  siteDateTimeNow.value = new Date()

  const siteSetting = await apiService.getSiteSettings(appStore().site)

  if (siteSetting) siteDateTimeNow.value = new Date(siteSetting.siteDateTimeNow)
}

function pageChanged(page: number) {
  currentPage.value = page
  currentUserPurchasesPaginated()
}

function afterChangingSite() {
  currentPage.value = 1
  currentUserPurchasesPaginated()
}
</script>

<template>
  <div class="row">
    <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-8">
      <SiteSelector @afterChangingSite="afterChangingSite()" :disabled="isLoading"></SiteSelector>
    </div>
  </div>
  <hr />

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
              <td colspan="7" style="text-align: center" class="text-center">
                <p>NO DATA AVAILABLE IN TABLE</p>
              </td>
            </tr>
            <tr v-if="isLoading" class="text-center align-middle">
              <td colspan="7"><p>LOADING...</p></td>
            </tr>
          </tbody>
        </table>
        <PaginationComponent
          :limit="pageLimit"
          :page="currentPage"
          :total="total"
          @page-changed="pageChanged"
        ></PaginationComponent>
      </div>
    </div>
  </div>

  <!-- Error Modal -->
  <ModalComponent
    v-if="errorModalIsVisible"
    title="Error"
    :message="ERROR_UNKNOWN"
    :cancel-text="null"
    @on-ok="errorModalIsVisible = false"
  >
  </ModalComponent>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped>
.isDisabled {
  background-color: rgb(214, 214, 214);
}

p {
  font-family: 'Avenir', sans-serif;
}
td {
  font-family: 'Avenir', sans-serif;
}
</style>
