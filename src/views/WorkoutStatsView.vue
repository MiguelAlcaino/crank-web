<script lang="ts">
interface ChartPoint {
  power?: number
  rpm?: number
  time?: number
}

interface ClassStat {
  adjustedChartPoints: Array<ChartPoint>
  averagePower?: number
  averageRpm?: number
  calories?: number
  chartPoints: Array<ChartPoint>
  classId: string
  className?: string
  distance?: number
  distanceUnit?: string
  /** Class duration in minutes */
  duration?: number
  highPower?: number
  highRpm?: number
  instructorName?: string
  spotNumber?: number
  startDateTime: Date
  totalEnergy?: number
}
</script>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import type { ApiService } from '@/services/apiService'
import { appStore } from '@/stores/appStorage'

const apiService = inject<ApiService>('gqlApiService')!

const isLoading = ref<boolean>(false)
const classStats = ref<ClassStat[]>([])

onMounted(() => {
  getCurrentUserWorkoutStats()
})

async function getCurrentUserWorkoutStats() {
  classStats.value = []

  isLoading.value = true

  classStats.value = (await apiService.getCurrentUserWorkoutStats(appStore().site)) as ClassStat[]

  isLoading.value = false
}
</script>

<template>
  <div class="row">
    <div class="col-12">
      <h1>WORKOUT STATS</h1>
    </div>
  </div>
  <div class="row mt-3">
    <div class="col-12">
      <table class="table table-sm">
        <thead>
          <tr class="text-center">
            <th>DESCRIPTION</th>
            <th>SPOT</th>
            <th>DATE</th>
            <th>DURATION</th>
            <th>TOTAL ENERGY</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in classStats" :key="index">
            <td>{{ item.className }}</td>
            <td class="text-center">{{ item.spotNumber }}</td>
            <td class="text-center">
              {{ dayjs(new Date(item.startDateTime)).format('DD/MM/YYYY h:mm A') }}
            </td>
            <td class="text-center">{{ item.duration }} mins.</td>
            <td class="text-center">{{ item.totalEnergy }}</td>
            <td class="text-center"></td>
          </tr>
          <tr v-if="classStats?.length === 0 && !isLoading">
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
