<script lang="ts">
interface ClassStat {
  enrollment: Enrollment
  totalEnergy?: number
}

interface Enrollment {
  class: Class
  enrollmentInfo: EnrollmentInfo
}

interface Class {
  duration: number
  name: string
  start: Date
}

interface EnrollmentInfo {
  id: string
  spotNumber?: number
}
</script>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import type { ApiService } from '@/services/apiService'
import { appStore } from '@/stores/appStorage'
import router from '@/router'
import { ERROR_UNKNOWN } from '@/utils/errorMessages'
import ModalComponent from '@/components/ModalComponent.vue'

const apiService = inject<ApiService>('gqlApiService')!

const isLoading = ref<boolean>(false)
const errorModalIsVisible = ref<boolean>(false)
const classStats = ref<ClassStat[]>([])

onMounted(() => {
  getCurrentUserWorkoutStats()
})

async function getCurrentUserWorkoutStats() {
  classStats.value = []

  try {
    isLoading.value = true
    classStats.value = (await apiService.getCurrentUserWorkoutStats(appStore().site)) as ClassStat[]
  } catch (error) {
    errorModalIsVisible.value = true
  } finally {
    isLoading.value = false
  }
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
      <div class="table-responsive">
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
            <tr
              v-for="(item, index) in classStats"
              :key="index"
              @click="router.push('workout-summary/' + item.enrollment.enrollmentInfo.id)"
            >
              <td>{{ item.enrollment.class.name }}</td>
              <td class="text-center">{{ item.enrollment.enrollmentInfo.spotNumber }}</td>
              <td class="text-center">
                {{ dayjs(new Date(item.enrollment.class.start)).format('DD/MM/YYYY h:mm A') }}
              </td>
              <td class="text-center">{{ item.enrollment.class.duration }} mins.</td>
              <td class="text-center">{{ item.totalEnergy?.toFixed(1) ?? '0' }}</td>
              <td class="text-center"></td>
            </tr>
            <tr v-if="classStats?.length === 0 && !isLoading">
              <td colspan="6" class="text-center">
                <p>NO DATA AVAILABLE IN TABLE</p>
              </td>
            </tr>
            <tr v-if="isLoading">
              <td colspan="6" class="text-center"><p>LOADING...</p></td>
            </tr>
          </tbody>
        </table>
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
tr {
  cursor: pointer;
}
tr:hover {
  background-color: #dadada !important;
}

p {
  font-family: 'Avenir', sans-serif;
}
</style>
