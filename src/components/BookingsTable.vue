<script setup lang="ts">
import dayjs from "dayjs";

import {type Enrollment, EnrollmentTypeEnum} from "@/gql/graphql";
import CancelEnrollmentButton from "@/components/CancelEnrollmentButton.vue";
import RemoveFromWaitlistButton from "@/components/RemoveFromWaitlistButton.vue";

defineProps<{
  enrollments: Enrollment[],
  enrollmentType: EnrollmentTypeEnum;
  siteDateTimeNow: Date,
  isLoading: boolean
}>();

const emits = defineEmits<{
  (e: 'changeSpot'): void,
  (e: 'clickCancelEnrollment', enrollmentId: string, isLateCancel: boolean): void,
  (e: 'clickRemoveFromWaitlist', waitlistEntryId: string): void
}>();

function clickCancelEnrollment(enrollmentId: string, isLateCancel: boolean): void {
  emits('clickCancelEnrollment', enrollmentId, isLateCancel);
}

function clickRemoveFromWaitlist(waitlistEntryId: string): void {
  emits('clickRemoveFromWaitlist', waitlistEntryId);
}


</script>

<template>
  <table>
    <tr>
      <th>INSTRUCTOR</th>
      <th>DESCRIPTION</th>
      <th>DATE</th>
      <th>SPOT</th>
      <th>RESERVATION DATE</th>
      <th>STATUS</th>
      <th>ACTIONS</th>
    </tr>
    <tr v-for='(enrollment, index) in enrollments'>
      <td>{{ enrollment.class.instructorName }}</td>
      <td>{{ enrollment.class.name }}</td>
      <td>{{ dayjs(new Date(enrollment.class.start)).format("YYYY-MM-DD h:mm a") }}</td>
      <td>{{ enrollment.enrollmentInfo.spotInfo?.spotNumber }}</td>
      <td>{{ dayjs(new Date(enrollment.enrollmentInfo.enrollmentDateTime)).format("YYYY-MM-DD h:mm a") }}</td>
      <td>{{ enrollment.enrollmentInfo.enrollmentStatus }}</td>
      <td>
        <CancelEnrollmentButton v-if="enrollmentType === EnrollmentTypeEnum.Upcoming"
                                :disabled="isLoading"
                                :siteDateTimeNow="siteDateTimeNow"
                                :enrollmentStatus="enrollment.enrollmentInfo.enrollmentStatus"
                                :startOfClass="new Date(enrollment.class.start)"
                                :enrollmentId="enrollment.enrollmentInfo.id"
                                @clickCancelEnrollment="clickCancelEnrollment">
        </CancelEnrollmentButton>
        <RemoveFromWaitlistButton v-if="enrollmentType === EnrollmentTypeEnum.Waitlist"
                                  :disabled="false"
                                  :enrollmentId="enrollment.enrollmentInfo.id"
                                  @clickRemoveFromWaitlist="clickRemoveFromWaitlist"
        ></RemoveFromWaitlistButton>
        <button type="button"
                @click="emits('changeSpot')"
                :disabled="isLoading"
                v-if="enrollmentType === EnrollmentTypeEnum.Historical && dayjs(enrollment.class.start) > dayjs(siteDateTimeNow)">
          CHANGE SPOT
        </button>
      </td>
    </tr>
    <tr v-if="enrollments.length === 0 && !isLoading">
      <td colspan="7">
        <p v-if="enrollmentType === EnrollmentTypeEnum.Upcoming">YOU HAVE NO UPCOMING BOOKINGS</p>
        <p v-if="enrollmentType === EnrollmentTypeEnum.Waitlist">YOU HAVE NO WAITLIST BOOKINGS</p>
        <p v-if="enrollmentType === EnrollmentTypeEnum.Historical">YOU HAVE NO HISTORICAL BOOKINGS</p>
      </td>
    </tr>
    <tr v-if="isLoading">
      <td colspan="7">
        loading...
      </td>
    </tr>
  </table>
</template>

<style scoped>
table, th, td {
  border: 1px solid black;
}
</style>
