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

import ClassIcon from '@/components/ClassIcon.vue'
import CancelEnrollment from '@/components/CancelEnrollment.vue'

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
          <th>STATUS</th>
          <th v-if="enrollmentType !== EnrollmentTypeEnum.Historical">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(enrollment, index) in enrollments"
          :key="index"
          :class="
            enrollment.enrollmentInfo.enrollmentStatus === EnrollmentStatusEnum.LateCancelled
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
          <td class="align-middle" v-if="enrollmentType !== EnrollmentTypeEnum.Historical">
            <CancelEnrollment
              v-if="
                enrollmentType === EnrollmentTypeEnum.Upcoming ||
                enrollmentType === EnrollmentTypeEnum.Waitlist
              "
              :enrollment-status="enrollment.enrollmentInfo.enrollmentStatus"
              :enrollment-id="enrollment.enrollmentInfo.id"
              @after-cancelling="emits('afterCancelling')"
            ></CancelEnrollment>
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
          <td colspan="7" class="text-center"><p>LOADING...</p></td>
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
