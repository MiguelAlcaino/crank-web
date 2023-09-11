<script setup lang="ts">
import dayjs from 'dayjs'

import { type Enrollment, EnrollmentTypeEnum } from '@/gql/graphql'
import CancelEnrollmentButton from '@/components/CancelEnrollmentButton.vue'
import RemoveFromWaitlistButton from '@/components/RemoveFromWaitlistButton.vue'

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
  <table class="table table-sm">
    <thead>
      <tr class="text-center">
        <th>INSTRUCTOR</th>
        <th>DESCRIPTION</th>
        <th>DATE</th>
        <th>SPOT</th>
        <th>RESERVATION DATE</th>
        <th>STATUS</th>
        <th>ACTIONS</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(enrollment, index) in enrollments" :key="index">
        <td>{{ enrollment.class.instructorName }}</td>
        <td>{{ enrollment.class.name }}</td>
        <td class="text-center">
          {{ dayjs(new Date(enrollment.class.start)).format('YYYY-MM-DD h:mm a') }}
        </td>
        <td class="text-center">{{ enrollment.enrollmentInfo.spotInfo?.spotNumber }}</td>
        <td class="text-center">
          {{
            dayjs(new Date(enrollment.enrollmentInfo.enrollmentDateTime)).format(
              'YYYY-MM-DD h:mm a'
            )
          }}
        </td>
        <td class="text-center">
          {{
            enrollment.enrollmentInfo.enrollmentStatus === 'lateCancelled'
              ? 'LATE CANCELLED'
              : enrollment.enrollmentInfo.enrollmentStatus.toUpperCase()
          }}
        </td>
        <td>
          <CancelEnrollmentButton
            v-if="enrollmentType === EnrollmentTypeEnum.Upcoming"
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
          <button
            type="button"
            class="btn btn-primary ml-1"
            @click="emits('changeSpot', enrollment.class.id)"
            :disabled="
              isLoading || enrollment.enrollmentInfo.enrollmentStatus.toUpperCase() !== 'ACTIVE'
            "
            v-if="
              enrollmentType !== EnrollmentTypeEnum.Historical &&
              enrollmentType !== EnrollmentTypeEnum.Waitlist &&
              dayjs(enrollment.class.start) > dayjs(siteDateTimeNow)
            "
          >
            CHANGE SPOT
          </button>
        </td>
      </tr>
      <tr v-if="enrollments.length === 0 && !isLoading">
        <td colspan="7">
          <p v-if="enrollmentType === EnrollmentTypeEnum.Upcoming">YOU HAVE NO UPCOMING BOOKINGS</p>
          <p v-if="enrollmentType === EnrollmentTypeEnum.Waitlist">YOU HAVE NO WAITLIST BOOKINGS</p>
          <p v-if="enrollmentType === EnrollmentTypeEnum.Historical">YOU HAVE NO OLD BOOKINGS</p>
        </td>
      </tr>
      <tr v-if="isLoading">
        <td colspan="7">loading...</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped></style>
