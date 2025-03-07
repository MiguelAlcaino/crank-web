<script lang="ts">
enum EnrollmentTypeEnum {
  Historical = 'historical',
  Upcoming = 'upcoming',
  Waitlist = 'waitlist'
}

interface Enrollment {
  class: Class
  enrollmentInfo: EnrollmentInfo
}

interface Class {
  id: string
  instructorName: string
  name: string
  start: Date
  startWithNoTimeZone: Date
  showAsDisabled?: boolean | null
}

interface EnrollmentInfo {
  enrollmentDateTime: Date
  enrollmentDateTimeWithNoTimeZone: Date
  enrollmentStatus: EnrollmentStatusEnum
  id: string
  spotNumber?: number
  canBeTurnedIntoEnrollment?: boolean
}

enum EnrollmentStatusEnum {
  Active = 'active',
  Cancelled = 'cancelled',
  LateCancelled = 'lateCancelled',
  Unknown = 'unknown',
  Waitlisted = 'waitlisted'
}
</script>
<script setup lang="ts">
import dayjs from 'dayjs'

import ClassIcon from '@/components/ClassIcon.vue'
import CancelEnrollment from '@/components/CancelEnrollment.vue'
import LateCancelResponse from '@/components/LateCancelResponse.vue'

defineProps<{
  enrollments: Enrollment[]
  enrollmentType: EnrollmentTypeEnum
  siteDateTimeNow: Date
  isLoading: boolean
  isFiltered: boolean
}>()

const emits = defineEmits<{
  (e: 'changeSpot', classId: string): void
  (e: 'afterCancelling'): void
}>()
</script>

<template>
  <div class="table-responsive">
    <table class="table table-sm">
      <thead>
        <tr class="text-center">
          <th>DESCRIPTION</th>
          <th>INSTRUCTOR</th>
          <th>DATE</th>
          <th>SPOT</th>
          <th>RESERVATION DATE</th>
          <th v-if="enrollmentType !== EnrollmentTypeEnum.Waitlist">STATUS</th>
          <th v-if="enrollmentType !== EnrollmentTypeEnum.Historical">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(enrollment, index) in enrollments"
          :key="index"
          :class="
            enrollment.enrollmentInfo.enrollmentStatus === EnrollmentStatusEnum.LateCancelled ||
            enrollment.class.showAsDisabled === true
              ? 'lateCancelColor'
              : ''
          "
        >
          <td class="align-middle">
            <div class="row">
              <div class="col" style="text-align: right">
                <ClassIcon :class-name="enrollment.class.name"></ClassIcon>
              </div>
              <div class="col align-middle" style="text-align: left; padding-top: 4px">
                {{ enrollment.class.name.toUpperCase() }}
              </div>
            </div>
          </td>
          <td class="align-middle">{{ enrollment.class.instructorName }}</td>
          <td class="text-center align-middle">
            {{ dayjs(new Date(enrollment.class.startWithNoTimeZone)).format('YYYY-MM-DD h:mm a') }}
          </td>
          <td class="text-center align-middle">
            <div class="row">
              <div class="col text-right">
                <b>
                  {{
                    enrollment.enrollmentInfo?.spotNumber
                      ? enrollment.enrollmentInfo.spotNumber
                      : 'N/A'
                  }}
                </b>
              </div>
              <div class="col">
                <button
                  type="button"
                  class="btn btn-primary btn-sm ml-1"
                  @click="emits('changeSpot', enrollment.class.id)"
                  :disabled="
                    isLoading ||
                    enrollment.enrollmentInfo.enrollmentStatus !== EnrollmentStatusEnum.Active ||
                    enrollment.enrollmentInfo?.spotNumber === null ||
                    enrollment.enrollmentInfo?.spotNumber === undefined
                  "
                  v-if="
                    enrollment.enrollmentInfo.enrollmentStatus === EnrollmentStatusEnum.Active &&
                    enrollmentType !== EnrollmentTypeEnum.Historical &&
                    enrollmentType !== EnrollmentTypeEnum.Waitlist &&
                    dayjs(enrollment.class.start) > dayjs(siteDateTimeNow) &&
                    enrollment.enrollmentInfo?.spotNumber !== null &&
                    enrollment.enrollmentInfo?.spotNumber !== undefined &&
                    enrollment.class.showAsDisabled !== true
                  "
                >
                  CHANGE
                </button>
              </div>
            </div>
          </td>
          <td class="text-center align-middle">
            {{
              dayjs(new Date(enrollment.enrollmentInfo.enrollmentDateTimeWithNoTimeZone)).format(
                'YYYY-MM-DD h:mm a'
              )
            }}
          </td>
          <td
            class="text-center align-middle"
            v-if="enrollmentType !== EnrollmentTypeEnum.Waitlist"
          >
            {{
              enrollment.class.showAsDisabled === true
                ? 'CLASS CANCELLED'
                : enrollment.enrollmentInfo.enrollmentStatus === 'lateCancelled'
                ? 'LATE CANCELLED'
                : enrollment.enrollmentInfo.enrollmentStatus.toUpperCase()
            }}
          </td>
          <td class="align-middle" v-if="enrollmentType !== EnrollmentTypeEnum.Historical">
            <CancelEnrollment
              v-if="
                (enrollmentType === EnrollmentTypeEnum.Upcoming ||
                  enrollmentType === EnrollmentTypeEnum.Waitlist) &&
                enrollment.enrollmentInfo.canBeTurnedIntoEnrollment !== true &&
                enrollment.enrollmentInfo.enrollmentStatus !== EnrollmentStatusEnum.LateCancelled &&
                enrollment.class.showAsDisabled !== true
              "
              :enrollment-status="enrollment.enrollmentInfo.enrollmentStatus"
              :enrollment-id="enrollment.enrollmentInfo.id"
              @after-cancelling="emits('afterCancelling')"
              :site-date-time-now="siteDateTimeNow"
              :start="new Date(enrollment.class.start)"
            ></CancelEnrollment>
            <LateCancelResponse
              v-if="enrollment.enrollmentInfo.canBeTurnedIntoEnrollment === true"
              :waitlist-entry-id="enrollment.enrollmentInfo.id"
              @after-accept-reject="emits('afterCancelling')"
            >
            </LateCancelResponse>
          </td>
        </tr>
        <tr v-if="enrollments.length === 0 && !isLoading">
          <td colspan="7" class="text-center align-middle">
            <p v-if="enrollmentType === EnrollmentTypeEnum.Upcoming">
              {{
                'YOU HAVE NO UPCOMING BOOKINGS' + (isFiltered ? ' WITHIN THE FILTERED RANGE' : '')
              }}
            </p>
            <p v-if="enrollmentType === EnrollmentTypeEnum.Waitlist">
              {{
                'YOU HAVE NO WAITLIST BOOKINGS' + (isFiltered ? ' WITHIN THE FILTERED RANGE' : '')
              }}
            </p>
            <p v-if="enrollmentType === EnrollmentTypeEnum.Historical">
              {{ 'YOU HAVE NO OLD BOOKINGS' + (isFiltered ? ' WITHIN THE FILTERED RANGE' : '') }}
            </p>
          </td>
        </tr>
        <tr v-if="isLoading">
          <td colspan="7" class="text-center">
            <p>LOADING...</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped>
.lateCancelColor {
  background-color: rgb(206, 206, 206);
}

p {
  font-family: 'Avenir', sans-serif;
}

td {
  font-family: 'Avenir', sans-serif;
}
</style>
