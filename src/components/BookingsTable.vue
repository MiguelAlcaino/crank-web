<script lang="ts">
enum EnrollmentTypeEnum {
  All = 'all',
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
}

interface EnrollmentInfo {
  enrollmentDateTime: Date
  enrollmentStatus: EnrollmentStatusEnum
  id: string
  spotInfo?: SpotInfo
}

interface SpotInfo {
  /** @deprecated Array of booked spots should be returned by other query to reduce complexity of creating SpotInfo instances. */
  isBooked: boolean
  spotNumber: number
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

import CancelEnrollmentButton from '@/components/CancelEnrollmentButton.vue'
import RemoveFromWaitlistButton from '@/components/RemoveFromWaitlistButton.vue'
import ClassIcon from '@/components/ClassIcon.vue'

defineProps<{
  enrollments: Enrollment[]
  enrollmentType: EnrollmentTypeEnum
  siteDateTimeNow: Date
  isLoading: boolean
}>()

const emits = defineEmits<{
  (e: 'changeSpot', classId: string): void
  (e: 'clickCancelEnrollment', enrollmentId: string, isLateCancel: boolean): void
  (e: 'clickRemoveFromWaitlist', waitlistEntryId: string): void
}>()

function clickCancelEnrollment(enrollmentId: string, isLateCancel: boolean): void {
  emits('clickCancelEnrollment', enrollmentId, isLateCancel)
}

function clickRemoveFromWaitlist(waitlistEntryId: string): void {
  emits('clickRemoveFromWaitlist', waitlistEntryId)
}
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
          <th>STATUS</th>
          <th>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(enrollment, index) in enrollments"
          :key="index"
          :class="
            enrollment.enrollmentInfo.enrollmentStatus === EnrollmentStatusEnum.LateCancelled
              ? 'table-danger'
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
            {{ dayjs(new Date(enrollment.class.start)).format('YYYY-MM-DD h:mm a') }}
          </td>
          <td class="text-center align-middle">
            <div class="row">
              <div class="col text-right">
                <b>
                  {{
                    enrollment.enrollmentInfo.spotInfo?.spotNumber === null ||
                    enrollment.enrollmentInfo.spotInfo?.spotNumber === undefined
                      ? 'N/A'
                      : enrollment.enrollmentInfo.spotInfo?.spotNumber
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
                    enrollment.enrollmentInfo.enrollmentStatus.toUpperCase() !== 'ACTIVE' ||
                    enrollment.enrollmentInfo.spotInfo?.spotNumber === null ||
                    enrollment.enrollmentInfo.spotInfo?.spotNumber === undefined
                  "
                  v-if="
                    enrollmentType !== EnrollmentTypeEnum.Historical &&
                    enrollmentType !== EnrollmentTypeEnum.Waitlist &&
                    dayjs(enrollment.class.start) > dayjs(siteDateTimeNow) &&
                    enrollment.enrollmentInfo.spotInfo?.spotNumber !== null &&
                    enrollment.enrollmentInfo.spotInfo?.spotNumber !== undefined
                  "
                >
                  CHANGE
                </button>
              </div>
            </div>
          </td>
          <td class="text-center align-middle">
            {{
              dayjs(new Date(enrollment.enrollmentInfo.enrollmentDateTime)).format(
                'YYYY-MM-DD h:mm a'
              )
            }}
          </td>
          <td class="text-center align-middle">
            {{
              enrollment.enrollmentInfo.enrollmentStatus === 'lateCancelled'
                ? 'LATE CANCELLED'
                : enrollment.enrollmentInfo.enrollmentStatus.toUpperCase()
            }}
          </td>
          <td class="text-center align-middle">
            <CancelEnrollmentButton
              v-if="
                enrollmentType === EnrollmentTypeEnum.Upcoming &&
                enrollment.enrollmentInfo.enrollmentStatus === 'active'
              "
              :disabled="isLoading"
              :siteDateTimeNow="siteDateTimeNow"
              :enrollmentStatus="enrollment.enrollmentInfo.enrollmentStatus"
              :startOfClass="new Date(enrollment.class.start)"
              :enrollmentId="enrollment.enrollmentInfo.id"
              @clickCancelEnrollment="clickCancelEnrollment"
            >
            </CancelEnrollmentButton>
            <RemoveFromWaitlistButton
              v-if="enrollmentType === EnrollmentTypeEnum.Waitlist"
              :disabled="false"
              :enrollmentId="enrollment.enrollmentInfo.id"
              @clickRemoveFromWaitlist="clickRemoveFromWaitlist"
              class="ml-1"
            >
            </RemoveFromWaitlistButton>
          </td>
        </tr>
        <tr v-if="enrollments.length === 0 && !isLoading">
          <td colspan="7">
            <p v-if="enrollmentType === EnrollmentTypeEnum.Upcoming">
              YOU HAVE NO UPCOMING BOOKINGS
            </p>
            <p v-if="enrollmentType === EnrollmentTypeEnum.Waitlist">
              YOU HAVE NO WAITLIST BOOKINGS
            </p>
            <p v-if="enrollmentType === EnrollmentTypeEnum.Historical">YOU HAVE NO OLD BOOKINGS</p>
          </td>
        </tr>
        <tr v-if="isLoading">
          <td colspan="7">loading...</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
