<script lang="ts">
interface ColumnName {
  dayName: string
  dateNumber: string
  isCurrentDate: boolean
}
</script>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { EnrollmentStatusEnum, type Class, SiteEnum } from '@/gql/graphql'
import { DayOfTheWeek } from '@/model/DayOfTheWeek'
import { WeekCalendar } from '@/model/WeekCalendar'
import dayjs from 'dayjs'

import CalendarCard from '@/components/CalendarCard.vue'
import IconCalendarCard from '@/components/icons/IconCalendarCard.vue'
import { appStore } from '@/stores/appStorage'
import type { ApiService } from '@/services/apiService'
import { authService } from '@/services/authService'

const columnsNames = ref<ColumnName[]>([])
const calendarDays = ref<WeekCalendar[]>([])
const siteDateTimeNow = ref<Date>(new Date())
const calendarIsLoading = ref<boolean>(false)
const hasPreviousWeek = ref<boolean>(false)
const daysOfTheWeek = ref<DayOfTheWeek[]>([])
const apiService = inject<ApiService>('gqlApiService')!

const enrollmentClassIds = ref<string[]>([])

dayjs.Ls.en.weekStart = 1

onMounted(() => {
  getClassesOfTheWeek()
})

function getClassesOfTheWeek() {
  if (authService.isLoggedId()) {
    getCustomCalendarClasses()
  } else {
    getCalendarClasses()
  }
}

function goToNextWeek(): void {
  const date = dayjs(appStore().calendarStartDate)

  const firstDayOfNextWeek = date.add(1, 'weeks').startOf('week').toDate()
  const lastDayOfNextWeek = date.add(1, 'weeks').endOf('week').toDate()

  appStore().setCalendarDates(firstDayOfNextWeek, lastDayOfNextWeek)

  getClassesOfTheWeek()
}

function goToPrevWeek(): void {
  const date = dayjs(appStore().calendarStartDate)

  const firstDayOfPrevWeek = date.subtract(1, 'weeks').startOf('week').toDate()
  const lastDayOfPrevWeek = date.subtract(1, 'weeks').endOf('week').toDate()

  const actualDate = new Date()

  if (dayjs(lastDayOfPrevWeek).isBefore(dayjs(actualDate), 'day')) return

  appStore().setCalendarDates(firstDayOfPrevWeek, lastDayOfPrevWeek)

  getClassesOfTheWeek()
}

async function getCustomCalendarClasses(): Promise<void> {
  calendarIsLoading.value = true
  hasPreviousWeek.value = false
  daysOfTheWeek.value = []
  enrollmentClassIds.value = []

  const firstDayWeek = appStore().calendarStartDate
  const lastDayWeek = appStore().calendarEndDate

  let customCalendarClasses = await apiService.getCustomCalendarClasses(
    appStore().site,
    firstDayWeek,
    lastDayWeek
  )

  if (customCalendarClasses != null) {
    siteDateTimeNow.value = customCalendarClasses.siteSettings.siteDateTimeNow

    for (let index = 0; index < customCalendarClasses.enrollmentsUpcoming.length; index++) {
      const enrollment = customCalendarClasses.enrollmentsUpcoming[index]
      if (
        enrollment?.class &&
        enrollment.enrollmentInfo?.enrollmentStatus === EnrollmentStatusEnum.Active
      ) {
        enrollmentClassIds.value.push(enrollment?.class.id)
      }
    }

    columnsNames.value = []

    let dates: Date[] = []
    let day = dayjs(firstDayWeek)
    for (let i = 0; i < 7; i++) {
      dates.push(day.toDate())

      columnsNames.value.push({
        dayName: day.format('ddd').toUpperCase(),
        dateNumber: day.format('DD.MM').toUpperCase(),
        isCurrentDate: day.isSame(Date(), 'day')
      })

      day = day.add(1, 'day')
    }

    const _actualDate = new Date()

    for (let i = 0; i < dates.length; i++) {
      let date = dayjs(dates[i])

      const disabled: boolean = date.isBefore(_actualDate, 'day')
      const selected: boolean = date.isSame(_actualDate, 'day')

      const calendarClasses: Class[] = customCalendarClasses.calendarClasses.filter((x) =>
        dayjs(new Date(x.start)).isSame(date, 'day')
      )

      daysOfTheWeek.value.push(new DayOfTheWeek(selected, disabled, date.toDate(), calendarClasses))

      if (date.isSame(_actualDate, 'day')) hasPreviousWeek.value = false
    }

    getPivot()

    calendarIsLoading.value = false
  }
}

async function getCalendarClasses(): Promise<void> {
  calendarIsLoading.value = true
  hasPreviousWeek.value = false
  daysOfTheWeek.value = []
  enrollmentClassIds.value = []

  const firstDayWeek = appStore().calendarStartDate
  const lastDayWeek = appStore().calendarEndDate

  const calendarClasses = await apiService.getCalendarClasses(
    appStore().site,
    firstDayWeek,
    lastDayWeek
  )

  const siteSettings = await apiService.getSiteSettings(appStore().site)

  if (calendarClasses != null) {
    siteDateTimeNow.value = siteSettings?.siteDateTimeNow ?? Date()

    columnsNames.value = []

    let dates: Date[] = []
    let day = dayjs(firstDayWeek)
    for (let i = 0; i < 7; i++) {
      dates.push(day.toDate())

      columnsNames.value.push({
        dayName: day.format('ddd').toUpperCase(),
        dateNumber: day.format('DD.MM').toUpperCase(),
        isCurrentDate: day.isSame(Date(), 'day')
      })

      day = day.add(1, 'day')
    }

    const _actualDate = new Date()

    for (let i = 0; i < dates.length; i++) {
      let date = dayjs(dates[i])

      const disabled: boolean = date.isBefore(_actualDate, 'day')
      const selected: boolean = date.isSame(_actualDate, 'day')

      const calendarClassesTemp: Class[] = calendarClasses.filter((x) =>
        dayjs(new Date(x.start)).isSame(date, 'day')
      )

      daysOfTheWeek.value.push(
        new DayOfTheWeek(selected, disabled, date.toDate(), calendarClassesTemp)
      )

      if (date.isSame(_actualDate, 'day')) hasPreviousWeek.value = false
    }

    getPivot()

    calendarIsLoading.value = false
  }
}

function getPivot() {
  calendarDays.value = []

  let maxClasses = 0

  for (let i = 0; i < daysOfTheWeek.value.length; i++) {
    if (maxClasses < daysOfTheWeek.value[i].classes.length) {
      maxClasses = daysOfTheWeek.value[i].classes.length
    }
  }

  for (let i = 0; i < maxClasses; i++) {
    let rowCalendar: WeekCalendar = new WeekCalendar()
    for (let day = 0; day < 7; day++) {
      if (day === 0) {
        if (
          typeof daysOfTheWeek.value[day] !== 'undefined' &&
          typeof daysOfTheWeek.value[day].classes[i] !== 'undefined'
        ) {
          rowCalendar.MON = daysOfTheWeek.value[day].classes[i]
        }
      } else if (day === 1) {
        if (
          typeof daysOfTheWeek.value[day] !== 'undefined' &&
          typeof daysOfTheWeek.value[day].classes[i] !== 'undefined'
        )
          rowCalendar.TUE = daysOfTheWeek.value[day].classes[i]
      } else if (day === 2) {
        if (
          typeof daysOfTheWeek.value[day] !== 'undefined' &&
          typeof daysOfTheWeek.value[day].classes[i] !== 'undefined'
        )
          rowCalendar.WED = daysOfTheWeek.value[day].classes[i]
      } else if (day === 3) {
        if (
          typeof daysOfTheWeek.value[day] !== 'undefined' &&
          typeof daysOfTheWeek.value[day].classes[i] !== 'undefined'
        )
          rowCalendar.THU = daysOfTheWeek.value[day].classes[i]
      } else if (day === 4) {
        if (
          typeof daysOfTheWeek.value[day] !== 'undefined' &&
          typeof daysOfTheWeek.value[day].classes[i] !== 'undefined'
        )
          rowCalendar.FRI = daysOfTheWeek.value[day].classes[i]
      } else if (day === 5) {
        if (
          typeof daysOfTheWeek.value[day] !== 'undefined' &&
          typeof daysOfTheWeek.value[day].classes[i] !== 'undefined'
        )
          rowCalendar.SAT = daysOfTheWeek.value[day].classes[i]
      } else if (day === 6) {
        if (
          typeof daysOfTheWeek.value[day] !== 'undefined' &&
          typeof daysOfTheWeek.value[day].classes[i] !== 'undefined'
        )
          rowCalendar.SUN = daysOfTheWeek.value[day].classes[i]
      }
    }

    calendarDays.value.push(rowCalendar)
  }
}
</script>

<template>
  <!-- buttons -->
  <div class="row gy-5 p-3">
    <div class="col-6">
      <button class="btn btn-primary" @click="goToPrevWeek()">
        <font-awesome-icon icon="fa fa-step-backward" />&nbsp;&nbsp;&nbsp;Prev
      </button>
    </div>
    <div class="col-6" style="text-align: right">
      <button class="btn btn-primary" @click="goToNextWeek()">
        Next&nbsp;&nbsp;&nbsp;<font-awesome-icon icon="fa fa-step-forward" />
      </button>
    </div>
  </div>
  <!-- calendar -->
  <div class="row">
    <div class="col-12">
      <div class="d-flex justify-content-center" v-if="calendarIsLoading">
        <div class="spinner-border" role="status"></div>
        &nbsp;&nbsp;Loading...
      </div>
      <div v-else>
        <table class="table table-borderless CalendarWeekTable">
          <thead>
            <tr>
              <th
                class="text-center"
                v-for="(colName, key) in columnsNames"
                :key="key"
                :class="colName.isCurrentDate ? 'today' : ''"
              >
                {{ colName.dayName }}<br />
                {{ colName.dateNumber }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(colRow, key) in calendarDays" :key="key">
              <td style="border-left: 0px !important">
                <CalendarCard
                  :classInfo="colRow.MON"
                  :isEnrolled="
                    colRow.MON != null && enrollmentClassIds.indexOf(colRow.MON?.id) !== -1
                  "
                  :disabled="dayjs(colRow.MON?.startWithNoTimeZone).isBefore(siteDateTimeNow)"
                ></CalendarCard>
              </td>
              <td>
                <CalendarCard
                  :classInfo="colRow.TUE"
                  :isEnrolled="
                    colRow.TUE != null && enrollmentClassIds.indexOf(colRow.TUE?.id) !== -1
                  "
                  :disabled="dayjs(colRow.TUE?.startWithNoTimeZone).isBefore(siteDateTimeNow)"
                ></CalendarCard>
              </td>
              <td>
                <CalendarCard
                  :classInfo="colRow.WED"
                  :isEnrolled="
                    colRow.WED != null && enrollmentClassIds.indexOf(colRow.WED?.id) !== -1
                  "
                  :disabled="dayjs(colRow.WED?.startWithNoTimeZone).isBefore(siteDateTimeNow)"
                ></CalendarCard>
              </td>
              <td>
                <CalendarCard
                  :classInfo="colRow.THU"
                  :isEnrolled="
                    colRow.THU != null && enrollmentClassIds.indexOf(colRow.THU?.id) !== -1
                  "
                  :disabled="dayjs(colRow.THU?.startWithNoTimeZone).isBefore(siteDateTimeNow)"
                  >></CalendarCard
                >
              </td>
              <td>
                <CalendarCard
                  :classInfo="colRow.FRI"
                  :isEnrolled="
                    colRow.FRI != null && enrollmentClassIds.indexOf(colRow.FRI?.id) !== -1
                  "
                  :disabled="dayjs(colRow.FRI?.startWithNoTimeZone).isBefore(siteDateTimeNow)"
                ></CalendarCard>
              </td>
              <td>
                <CalendarCard
                  :classInfo="colRow.SAT"
                  :isEnrolled="
                    colRow.SAT != null && enrollmentClassIds.indexOf(colRow.SAT?.id) !== -1
                  "
                  :disabled="dayjs(colRow.SAT?.startWithNoTimeZone).isBefore(siteDateTimeNow)"
                ></CalendarCard>
              </td>
              <td>
                <CalendarCard
                  :classInfo="colRow.SUN"
                  :isEnrolled="
                    colRow.SUN != null && enrollmentClassIds.indexOf(colRow.SUN?.id) !== -1
                  "
                  :disabled="dayjs(colRow.SUN?.startWithNoTimeZone).isBefore(siteDateTimeNow)"
                ></CalendarCard>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- icons -->
  <div class="row gy-5 mt-5">
    <div class="offset-3"></div>
    <div class="col-md-2"><IconCalendarCard letter="E"></IconCalendarCard>Enrolled</div>
    <div class="col-md-2"><IconCalendarCard letter="W"></IconCalendarCard>Waitlist</div>
    <div class="col-md-2"><IconCalendarCard letter="S"></IconCalendarCard>Substitute</div>
    <div class="offset-3"></div>
  </div>
</template>

<style>
.CalendarWeekTable > tbody > tr > td > div {
  border-bottom: 1px solid black !important;
}

.CalendarWeekTable > thead > tr {
  border-bottom: 1px solid black !important;
  border-top: 1px solid black !important;
}

.CalendarWeekTable > thead > tr > td {
  padding-top: 2px !important;
  padding-bottom: 2px !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  border-top: 0 !important;
  border-left: 1px black !important;
}

.CalendarWeekTable > tbody > tr > td {
  border-left: 1px solid #000000 !important;
}

.CalendarWeekTable > thead > tr > th.today {
  background-color: #000000 !important;
  color: white;
}

.CalendarWeekTable > thead {
  border-top: 1px solid #000000 !important;
  border-bottom: 1px solid #000000 !important;
  padding-top: 5px !important;
  padding-bottom: 5px !important;
}

thead {
  display: table-header-group;
  vertical-align: middle;
  border-color: inherit;
}
</style>
