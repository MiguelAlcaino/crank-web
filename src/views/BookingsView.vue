<script lang="ts">
enum EnrollmentTypeEnum {
  All = 'all',
  Historical = 'historical',
  Upcoming = 'upcoming',
  Waitlist = 'waitlist'
}
</script>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import type { CurrentUserEnrollmentsParams, Enrollment } from '@/gql/graphql'
import dayjs from 'dayjs'

import BookingsTable from '@/components/BookingsTable.vue'
import DefaultButtonComponent from '@/components/DefaultButtonComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'

import type { ApiService } from '@/services/apiService'
import { appStore } from '@/stores/appStorage'
import { ERROR_UNKNOWN } from '@/utils/errorMessages'
import router from '@/router'

const upcomingEnrollments = ref<Enrollment[]>([])
const waitlistEnrollments = ref<Enrollment[]>([])
const oldEnrollments = ref<Enrollment[]>([])

const upcomingEnrollmentsIsLoading = ref<boolean>(false)
const waitlistEnrollmentsIsLoading = ref<boolean>(false)
const oldEnrollmentsIsLoading = ref<boolean>(false)

const siteDateTimeNow = ref<Date>(new Date())

const isFilteredUpcoming = ref<boolean>(false)
const isFilteredWaitlist = ref<boolean>(false)
const isFilteredHistorical = ref<boolean>(false)

const dateRangeFilterUpcoming = ref<[Date | null, Date | null] | undefined>()
const dateRangeFilterWaitlist = ref<[Date | null, Date | null] | undefined>()
const dateRangeFilterHistorical = ref<[Date | null, Date | null] | undefined>()

const errorModalData = ref<{
  message: string
  isVisible: boolean
}>({
  message: '',
  isVisible: false
})

const activeItem = ref<EnrollmentTypeEnum>(EnrollmentTypeEnum.Upcoming)

const apiService = inject<ApiService>('gqlApiService')!

onMounted(() => {
  getSiteDateTimeNow()
  getUserEnrollments(true)
})

async function getSiteDateTimeNow() {
  siteDateTimeNow.value = new Date()

  const siteSetting = await apiService.getSiteSettings(appStore().site)

  if (siteSetting) siteDateTimeNow.value = new Date(siteSetting.siteDateTimeNow)
}

async function getUserEnrollments(isOnMount: boolean = false) {
  getOldEnrollments()
  await getUpcomingEnrollments()
  await getWaitlistEnrollments()

  if (isOnMount && upcomingEnrollments.value.length === 0 && waitlistEnrollments.value.length > 0)
    setActive(EnrollmentTypeEnum.Waitlist)
}

async function getUpcomingEnrollments() {
  isFilteredUpcoming.value = false
  try {
    upcomingEnrollments.value = []

    const params = { enrollmentType: EnrollmentTypeEnum.Upcoming } as CurrentUserEnrollmentsParams

    if (dateRangeFilterUpcoming.value) {
      if (dateRangeFilterUpcoming.value[0])
        params.startDate = dayjs(dateRangeFilterUpcoming.value[0]).format('YYYY-MM-DD')

      if (dateRangeFilterUpcoming.value[1])
        params.endDate = dayjs(dateRangeFilterUpcoming.value[1]).format('YYYY-MM-DD')

      isFilteredUpcoming.value = true
    }

    upcomingEnrollmentsIsLoading.value = true

    upcomingEnrollments.value = await apiService.getCurrentUserEnrollments(appStore().site, params)
  } catch (error) {
    errorModalData.value.message = ERROR_UNKNOWN
    errorModalData.value.isVisible = true
  } finally {
    upcomingEnrollmentsIsLoading.value = false
  }
}

async function getWaitlistEnrollments() {
  isFilteredWaitlist.value = false
  try {
    waitlistEnrollments.value = []

    const params = { enrollmentType: EnrollmentTypeEnum.Waitlist } as CurrentUserEnrollmentsParams

    if (dateRangeFilterWaitlist.value) {
      if (dateRangeFilterWaitlist.value[0])
        params.startDate = dayjs(dateRangeFilterWaitlist.value[0]).format('YYYY-MM-DD')

      if (dateRangeFilterWaitlist.value[1])
        params.endDate = dayjs(dateRangeFilterWaitlist.value[1]).format('YYYY-MM-DD')

      isFilteredWaitlist.value = true
    }

    waitlistEnrollmentsIsLoading.value = true

    waitlistEnrollments.value = await apiService.getCurrentUserEnrollments(appStore().site, params)
  } catch (error) {
    errorModalData.value.message = ERROR_UNKNOWN
    errorModalData.value.isVisible = true
  } finally {
    waitlistEnrollmentsIsLoading.value = false
  }
}

async function getOldEnrollments() {
  isFilteredHistorical.value = false
  try {
    oldEnrollments.value = []

    const params = { enrollmentType: EnrollmentTypeEnum.Historical } as CurrentUserEnrollmentsParams

    if (dateRangeFilterHistorical.value) {
      if (dateRangeFilterHistorical.value[0])
        params.startDate = dayjs(dateRangeFilterHistorical.value[0]).format('YYYY-MM-DD')

      if (dateRangeFilterHistorical.value[1])
        params.endDate = dayjs(dateRangeFilterHistorical.value[1]).format('YYYY-MM-DD')

      isFilteredHistorical.value = true
    }

    oldEnrollmentsIsLoading.value = true

    const _oldEnrollments = await apiService.getCurrentUserEnrollments(appStore().site, params)

    oldEnrollments.value = _oldEnrollments
      .slice()
      .sort((a, b) => (a.class.start > b.class.start ? -1 : 1))
  } catch (error) {
    errorModalData.value.message = ERROR_UNKNOWN
    errorModalData.value.isVisible = true
  } finally {
    oldEnrollmentsIsLoading.value = false
  }
}

function goToChangeSpot(classId: string) {
  router.push('/change-spot/' + classId)
}

function isActive(menuItem: EnrollmentTypeEnum) {
  return activeItem.value === menuItem
}

function setActive(menuItem: EnrollmentTypeEnum) {
  activeItem.value = menuItem
}
</script>

<template>
  <div class="row form-inline">
    <div class="col-md-6">
      <h1>Bookings</h1>
    </div>
    <div
      v-if="activeItem === EnrollmentTypeEnum.Upcoming"
      class="col-md-5 col-sm-6 text-right justify-content-end"
    >
      <VueDatePicker
        v-model="dateRangeFilterUpcoming"
        range
        :enable-time-picker="false"
        placeholder="Date Range"
        :min-date="new Date()"
      />
    </div>
    <div v-if="activeItem === EnrollmentTypeEnum.Upcoming" class="col-1">
      <DefaultButtonComponent
        @on-click="getUpcomingEnrollments()"
        :is-loading="upcomingEnrollmentsIsLoading"
        text="Go"
        type="button"
        class="input-group-append"
      ></DefaultButtonComponent>
    </div>
    <div
      v-if="activeItem === EnrollmentTypeEnum.Waitlist"
      class="col-md-5 col-sm-6 text-right justify-content-end"
    >
      <VueDatePicker
        v-model="dateRangeFilterWaitlist"
        range
        :enable-time-picker="false"
        placeholder="Date Range"
        :min-date="new Date()"
      />
    </div>
    <div v-if="activeItem === EnrollmentTypeEnum.Waitlist" class="col-1">
      <DefaultButtonComponent
        @on-click="getWaitlistEnrollments()"
        :is-loading="waitlistEnrollmentsIsLoading"
        text="Go"
        type="button"
        class="input-group-append"
      ></DefaultButtonComponent>
    </div>
    <div
      v-if="activeItem === EnrollmentTypeEnum.Historical"
      class="col-md-5 col-sm-6 text-right justify-content-end"
    >
      <VueDatePicker
        v-model="dateRangeFilterHistorical"
        range
        :enable-time-picker="false"
        placeholder="Date Range"
        :max-date="new Date()"
      />
    </div>
    <div v-if="activeItem === EnrollmentTypeEnum.Historical" class="col-1">
      <DefaultButtonComponent
        @on-click="getOldEnrollments()"
        :is-loading="oldEnrollmentsIsLoading"
        text="Go"
        type="button"
        class="input-group-append"
      ></DefaultButtonComponent>
    </div>
  </div>
  <br />
  <br />

  <ul class="nav nav-tabs nav-justified">
    <li class="nav-item">
      <a
        class="nav-link"
        @click.prevent="setActive(EnrollmentTypeEnum.Upcoming)"
        :class="{ active: isActive(EnrollmentTypeEnum.Upcoming) }"
        href="#upcoming"
        >UPCOMING</a
      >
    </li>
    <li class="nav-item">
      <a
        class="nav-link"
        @click.prevent="setActive(EnrollmentTypeEnum.Waitlist)"
        :class="{ active: isActive(EnrollmentTypeEnum.Waitlist) }"
        href="#waitlist"
        >WAITLIST</a
      >
    </li>
    <li class="nav-item">
      <a
        class="nav-link"
        @click.prevent="setActive(EnrollmentTypeEnum.Historical)"
        :class="{ active: isActive(EnrollmentTypeEnum.Historical) }"
        href="#old"
        >OLD</a
      >
    </li>
  </ul>
  <div class="tab-content py-3" id="myTabContent">
    <div
      class="tab-pane fade"
      :class="{ 'active show': isActive(EnrollmentTypeEnum.Upcoming) }"
      id="upcoming"
    >
      <BookingsTable
        :enrollments="upcomingEnrollments"
        :isLoading="upcomingEnrollmentsIsLoading"
        :enrollmentType="EnrollmentTypeEnum.Upcoming"
        :siteDateTimeNow="siteDateTimeNow"
        @change-spot="goToChangeSpot"
        :is-filtered="isFilteredUpcoming"
        @after-cancelling="getUpcomingEnrollments()"
      >
      </BookingsTable>
    </div>
    <div
      class="tab-pane fade"
      :class="{ 'active show': isActive(EnrollmentTypeEnum.Waitlist) }"
      id="waitlist"
    >
      <BookingsTable
        :enrollments="waitlistEnrollments"
        :isLoading="waitlistEnrollmentsIsLoading"
        :enrollmentType="EnrollmentTypeEnum.Waitlist"
        :siteDateTimeNow="siteDateTimeNow"
        @change-spot="goToChangeSpot"
        :is-filtered="isFilteredWaitlist"
        @after-cancelling="getWaitlistEnrollments()"
      >
      </BookingsTable>
    </div>
    <div
      class="tab-pane fade"
      :class="{ 'active show': isActive(EnrollmentTypeEnum.Historical) }"
      id="old"
    >
      <BookingsTable
        :enrollments="oldEnrollments"
        :isLoading="oldEnrollmentsIsLoading"
        :enrollmentType="EnrollmentTypeEnum.Historical"
        :siteDateTimeNow="siteDateTimeNow"
        :is-filtered="isFilteredHistorical"
      >
      </BookingsTable>
    </div>
  </div>

  <!-- ERROR modal -->
  <ModalComponent
    :ok-loading="false"
    title="ERROR"
    :message="errorModalData.message"
    :closable="false"
    :cancel-text="null"
    v-if="errorModalData.isVisible"
    @on-ok="errorModalData.isVisible = false"
  >
  </ModalComponent>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped>
a {
  color: #000000;
  font-family: 'Avenir', sans-serif;
}

a:hover {
  color: #757575;
  text-decoration: none;
  background-color: #eee;
}
</style>

<style lang="css">
/* Datepicker Theming */
.dp__theme_light {
  --dp-background-color: #ffffff !important;
  --dp-text-color: #212121 !important;
  --dp-hover-color: #f3f3f3 !important;
  --dp-hover-text-color: #212121 !important;
  --dp-hover-icon-color: #959595 !important;
  --dp-primary-color: #ff7f61 !important;
  --dp-primary-text-color: #f8f5f5 !important;
  --dp-secondary-color: #c0c4cc !important;
  --dp-border-color: #ddd !important;
  --dp-menu-border-color: #ddd !important;
  --dp-border-color-hover: #aaaeb7 !important;
  --dp-disabled-color: #f6f6f6 !important;
  --dp-scroll-bar-background: #f3f3f3 !important;
  --dp-scroll-bar-color: #959595 !important;
  --dp-success-color: #000000 !important;
  --dp-success-color-disabled: #a3d9b1 !important;
  --dp-icon-color: #959595 !important;
  --dp-danger-color: #ff6f60 !important;
  --dp-highlight-color: rgba(255, 127, 97, 0.1) !important;
}

.dp__range_end,
.dp__range_start,
.dp__active_date {
  background: var(--dp-danger-color) !important;
  color: var(--dp-primary-text-color) !important;
}
.dp__action_select {
  background: #000000 !important;
  color: var(--dp-primary-text-color) !important;
}
</style>
