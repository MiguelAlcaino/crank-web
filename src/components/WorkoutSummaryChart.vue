<script lang="ts">
interface ChartPoint {
  power?: number
  rpm?: number
  time?: number
}

interface Serie {
  name: string
  data: number[]
}

interface Props {
  chartPoints?: ChartPoint[]
}
</script>

<script setup lang="ts">
import { ref, watch } from 'vue'

import { secondsToMMSS } from '@/utils/utility-functions'

const props = withDefaults(defineProps<Props>(), {
  chartPoints: () => []
})

watch(
  () => props.chartPoints,
  (chartPoints) => {
    updateChart(chartPoints)
  }
)

const chartOptions = ref({
  chart: {
    id: 'class-stats',
    height: '400px',
    toolbar: {
      show: false
    }
  },
  xaxis: {
    categories: ['']
  },
  colors: ['#FF7F61', '#5DDBD3'],
  title: { text: 'CLASS STATS' }
})
const series = ref([
  {
    name: 'RPM',
    data: [0]
  },
  {
    name: 'POWER',
    data: [0]
  }
])

function updateChart(chartPoints?: ChartPoint[]) {
  let tempCategories: string[] = []
  let tempSeries: Serie[] = []

  let rpmSerie: Serie = { name: 'RPM', data: [] }
  let powerSerie: Serie = { name: 'POWER', data: [] }

  if (chartPoints) {
    for (let i = 0; i < chartPoints.length; i++) {
      const chartPoint = chartPoints[i] as ChartPoint

      tempCategories.push(secondsToMMSS(chartPoint.time!))
      rpmSerie.data.push(chartPoint.rpm!)
      powerSerie.data.push(chartPoint.power!)
    }
  }

  tempSeries.push(rpmSerie)
  tempSeries.push(powerSerie)

  chartOptions.value = {
    ...chartOptions.value,
    xaxis: {
      categories: tempCategories
    }
  }

  series.value = tempSeries
}
</script>

<template>
  <apexchart
    type="line"
    :options="chartOptions"
    :series="series"
    width="100%"
    height="600"
  ></apexchart>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
