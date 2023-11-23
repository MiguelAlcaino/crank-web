<script lang="ts">
interface ClassStat {
  enrollment: Enrollment
  distance?: number
  calories?: number
  totalEnergy?: number
  averagePower?: number
  highPower?: number
  averageRpm?: number
  highRpm?: number
  adjustedChartPoints: ChartPoint[]
}

interface Enrollment {
  class: Class
  enrollmentInfo: EnrollmentInfo
}

interface EnrollmentInfo {
  id?: string
  spotNumber?: number
}

interface Class {
  id: string
  name: string
  start: Date
  duration: number
  instructorName: string
}

interface ChartPoint {
  power?: number
  rpm?: number
  time?: number
}
</script>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import type { ApiService } from '@/services/apiService'
import { useRoute } from 'vue-router'

import { secondsToMMSS } from '@/utils/utility-functions'
import WorkoutSummaryChart from '@/components/WorkoutSummaryChart.vue'
import StatIconWidget from '@/components/StatIconWidget.vue'
import SpotIconWidget from '@/components/SpotIconWidget.vue'
import RankWidget from '@/components/RankWidget.vue'
import StatSlashWidget from '@/components/StatSlashWidget.vue'
import { ERROR_UNKNOWN } from '@/utils/errorMessages'
import ModalComponent from '@/components/ModalComponent.vue'

const route = useRoute()

const apiService = inject<ApiService>('gqlApiService')!

const isLoading = ref<boolean>(false)
const classStat = ref<ClassStat | null>(null)
const enrollmentId = ref<string | null>(null)
const errorModalIsVisible = ref<boolean>(false)

onMounted(() => {
  enrollmentId.value = route.params.id as string
  currentUserSingleWorkoutStat()
})

async function currentUserSingleWorkoutStat() {
  classStat.value = null

  try {
    isLoading.value = true

    classStat.value = (await apiService.currentUserSingleWorkoutStat(
      enrollmentId.value!
    )) as ClassStat
  } catch (error) {
    errorModalIsVisible.value = true
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="row">
    <div class="col-12 text-center">
      <h1>WORKOUT SUMMARY</h1>
    </div>
  </div>
  <div class="row mt-3">
    <div class="col-12">
      <div class="col-12 text-center">
        <h4>{{ classStat?.enrollment.class.name }}</h4>
        <br />
        <p>
          <b>TIME: </b>
          <span>{{ dayjs(classStat?.enrollment.class.start).format('h:mm a') }}</span> |
          <b>DURATION: </b>
          <span>{{ classStat?.enrollment.class.duration }}</span> mins.
        </p>
        <p><b>INSTRUCTOR: </b> {{ classStat?.enrollment.class.instructorName }}</p>
      </div>
    </div>
  </div>
  <div class="row mt-3">
    <div class="col-12 text-center">
      <WorkoutSummaryChart :chart-points="classStat?.adjustedChartPoints"></WorkoutSummaryChart>
    </div>
  </div>
  <div class="row mt-3">
    <div class="col-sm-6">
      <StatIconWidget
        icon="duration"
        :value="secondsToMMSS(classStat?.enrollment.class.duration)"
        title="DURATION"
      ></StatIconWidget>
    </div>
    <div class="col-sm-6">
      <StatIconWidget
        icon="distance"
        :value="(classStat?.distance?.toFixed(1) ?? '0') + 'KM'"
        title="DISTANCE"
      ></StatIconWidget>
    </div>
    <div class="col-sm-6">
      <StatIconWidget
        icon="calories"
        :value="classStat?.calories?.toFixed(1) ?? '0'"
        title="CALORIES"
      ></StatIconWidget>
    </div>
    <div class="col-sm-6">
      <StatIconWidget
        icon="total_energy"
        :value="classStat?.totalEnergy?.toFixed(1) ?? '0'"
        title="TOTAL ENERGY"
      ></StatIconWidget>
    </div>
    <div class="col-sm-6">
      <SpotIconWidget
        :class-name="classStat?.enrollment.class.name"
        :spot-number="classStat?.enrollment.enrollmentInfo.spotNumber"
      ></SpotIconWidget>
    </div>
    <div class="col-sm-6">
      <RankWidget :class-id="classStat?.enrollment.class.id"></RankWidget>
    </div>
    <div class="col-sm-6">
      <StatSlashWidget
        title="POWER"
        :avg-value="classStat?.averagePower ?? 0"
        :high-value="classStat?.highPower ?? 0"
      ></StatSlashWidget>
    </div>
    <div class="col-sm-6">
      <StatSlashWidget
        title="RPM"
        :avg-value="classStat?.averageRpm ?? 0"
        :high-value="classStat?.highRpm ?? 0"
      ></StatSlashWidget>
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

<style scoped lang="css">
p {
  font-family: 'BigJohn', sans-serif;
}
h4 {
  color: #737373;
}
</style>
