<script setup lang="ts">
import {onMounted, ref} from "vue";
import {apiService} from "@/services/apiService";
import {CurrentUserEnrollmentsParams, Enrollment, EnrollmentTypeEnum, SiteEnum} from "@/gql/graphql";
import dayjs from "dayjs";
import BookingsTable from "@/components/BookingsTable.vue";

const isLoading = ref<boolean>(false);
const userErollments = ref<Enrollment[]>([]);

const filterStartDate = ref<Date | null>(null);
const filterEndDate = ref<Date | null>(null);
const filterEnrollmentType = ref<EnrollmentTypeEnum>(EnrollmentTypeEnum.All);

onMounted(() => {

});

async function getUserErollments() {
  userErollments.value = [];

  isLoading.value = true;

  const params = {enrollmentType: filterEnrollmentType.value} as CurrentUserEnrollmentsParams;

  if (filterStartDate.value)
    params.startDate = dayjs(filterStartDate.value).format("YYYY-MM-DD");

  if (filterEndDate.value)
    params.endDate = dayjs(filterEndDate.value).format("YYYY-MM-DD");

  userErollments.value = await apiService.getCurrentUserEnrollments(SiteEnum.Dubai, params);

  isLoading.value = false;
}


</script>

<template>
  <h2>BOOKINGS</h2>
  <div>Selected: {{ filterEnrollmentType }}</div>
  <select v-model="filterEnrollmentType">
    <option :value="EnrollmentTypeEnum.All">All</option>
    <option :value="EnrollmentTypeEnum.Upcoming">Upcoming</option>
    <option :value="EnrollmentTypeEnum.Waitlist">Waitlist</option>
    <option :value="EnrollmentTypeEnum.Historical">Historical</option>
  </select>
  <button type="button" @click="getUserErollments()" :disabled="isLoading">SEARCH</button>
  <br/>
  <br/>
  <BookingsTable :enrollments="userErollments" :isLoading="isLoading"></BookingsTable>
</template>

<style scoped></style>
