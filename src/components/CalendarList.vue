<script lang="ts">
// TODO: Add total number of spots and enrolled
interface Class {
  id: string
  name: string
  startWithNoTimeZone: Date
  maxCapacity: number
  totalBooked: number
  totalUnderMaintenanceSpots: number
}

interface WeekDays {
  date: Date
  classes: Class[]
}
</script>

<script setup lang="ts">
import type { ApiService } from '@/services/apiService'
import { appStore } from '@/stores/appStorage'
import { ERROR_UNKNOWN } from '@/utils/errorMessages'
import dayjs from 'dayjs'
import { inject, onMounted, ref } from 'vue'
import ModalComponent from '@/components/ModalComponent.vue'
import CrankCircularProgressIndicator from '@/components/CrankCircularProgressIndicator.vue'
import SyncAllClassesButton from '@/components/SyncAllClassesButton.vue'
import { Role } from '@/utils/userRoles'
import { authService } from '@/services/authService'

dayjs.Ls.en.weekStart = 1

const apiService = inject<ApiService>('gqlApiService')!

const isLoading = ref<boolean>(false)
const errorModalIsVisible = ref<boolean>(false)
const startDate = ref<Date>(dayjs(Date()).startOf('week').toDate())
const endDate = ref<Date>(dayjs(Date()).endOf('week').toDate())
const weekDays = ref<WeekDays[]>([])
const userCanSyncClasses = ref<boolean>(false)

const emits = defineEmits<{
  (e: 'selectClass', classId: string | null): void
}>()

onMounted(() => {
  getCalendarClasses()

  userCanSyncClasses.value = authService.userHasRole(Role.ROLE_SUPER_ADMIN)
})

defineExpose({
  getCalendarClasses
})

async function getCalendarClasses(resetSelectedClass: boolean = true): Promise<void> {
  if (resetSelectedClass) emits('selectClass', null)

  weekDays.value = []

  isLoading.value = true

  try {
    const calendarClasses = (await apiService.getCalendarClassesForList(
      appStore().site,
      startDate.value,
      endDate.value
    )) as Class[]

    let day: dayjs.Dayjs | null = null
    let weekDaysIndex = -1

    for (let index = 0; index < calendarClasses.length; index++) {
      const calendarClass = calendarClasses[index]

      if (day === null || !day.isSame(dayjs(calendarClass.startWithNoTimeZone), 'day')) {
        weekDaysIndex++
        day = dayjs(calendarClass.startWithNoTimeZone)

        weekDays.value.push({ date: calendarClass.startWithNoTimeZone, classes: [] })
      }

      weekDays.value[weekDaysIndex].classes.push({
        id: calendarClass.id,
        name: calendarClass.name,
        startWithNoTimeZone: calendarClass.startWithNoTimeZone,
        maxCapacity: calendarClass.maxCapacity,
        totalBooked: calendarClass.totalBooked,
        totalUnderMaintenanceSpots: calendarClass.totalUnderMaintenanceSpots
      })
    }
  } catch (error) {
    errorModalIsVisible.value = true
  } finally {
    isLoading.value = false
  }
}

function goToPrevWeek(): void {
  const date = dayjs(startDate.value)

  startDate.value = date.subtract(1, 'weeks').startOf('week').toDate()
  endDate.value = date.subtract(1, 'weeks').endOf('week').toDate()

  getCalendarClasses()
}

function goToNextWeek(): void {
  const date = dayjs(startDate.value)

  startDate.value = date.add(1, 'weeks').startOf('week').toDate()
  endDate.value = date.add(1, 'weeks').endOf('week').toDate()

  getCalendarClasses()
}
</script>

<template>
  <div class="ReservationClassList">
    <div id="DateRangeSection">
      <div style="display: flex; justify-content: space-between; width: 100%">
        <div id="prev">
          <a href="#" @click.prevent="goToPrevWeek()">
            <i class="bi bi-caret-left-fill"></i>
          </a>
        </div>
        <div id="dateRange" style="font-weight: 500">
          {{ dayjs(startDate).format('DD/MM/YYYY') }} to {{ dayjs(endDate).format('DD/MM/YYYY') }}
        </div>
        <div id="next">
          <a href="#" @click.prevent="goToNextWeek()">
            <i class="bi bi-caret-right-fill"></i>
          </a>
        </div>
      </div>
    </div>
    <div class="row" v-if="isLoading">
      <div class="col-12 text-center">
        <CrankCircularProgressIndicator text="Loading..."></CrankCircularProgressIndicator>
      </div>
    </div>
    <div id="ClassesSection">
      <div class="ClassDate" v-for="wd in weekDays" :key="wd.date.toISOString">
        <span class="day">{{ dayjs(wd.date).format('ddd MMM D, YYYY') }}</span>
        <div
          v-for="c in wd.classes"
          :key="c.id"
          style="cursor: pointer"
          @click="emits('selectClass', c.id)"
        >
          <div>
            <time>{{ dayjs(c.startWithNoTimeZone).format('h:mm A') }}</time>
            <desc style="display: inline-block; width: 100%; align-self: stretch">{{
              c.name
            }}</desc>
            <span>{{
              '(' + (c.totalBooked + c.totalUnderMaintenanceSpots) + '/' + c.maxCapacity + ')'
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 text-center">
        <SyncAllClassesButton
          :disabled="false"
          @after-sync-all-classes="getCalendarClasses(true)"
          v-if="userCanSyncClasses"
        ></SyncAllClassesButton>
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
.ReservationClassList {
  padding: 10px;
  background-color: #f8f8f8;
  box-shadow: 0 0 2px 0 #888;
  margin-bottom: 35px;
}

.day {
  font-weight: 700;
  display: block;
  background: gray;
  color: #fff;
  padding-left: 5px;
  font-size: 12px;
  font-weight: 500;
}

.time {
  min-width: 90px;
  display: inline-block;
}

#ClassesSection div.ClassDate > div > div {
  color: #000000;
  font-weight: bold;
}

#ClassesSection div.ClassDate > div > div > time {
  min-width: 90px;
  display: inline-block;
}

#ClassesSection div.ClassDate > div > div {
  text-overflow: ellipsis;
  display: flex;
  margin: -2px 0 -2px 0;
  font-size: 12px;
}

#ClassesSection div.ClassDate {
  margin-bottom: 10px;
}

#ClassesSection div.ClassDate > div {
  padding: 6px;
  background-color: #fff;
  border: 1px solid #bdbdbd;
}

#DateRangeSection {
  display: flex;
  padding: 8px;
  padding-left: 0;
  padding-right: 0;
}
</style>
