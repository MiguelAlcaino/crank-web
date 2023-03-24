<script setup lang="ts">
import dayjs from "dayjs";

import {Enrollment} from "@/gql/graphql";

defineProps<{
  enrollments: Enrollment[],
  isLoading: boolean
}>();

const emits = defineEmits<{
  (e: 'cancel'): void
  (e: 'changeSpot'): void
}>();

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
        <button type="button" @click="emits('cancel')" :disabled="isLoading">EARLY CANCEL</button>
        <button type="button" @click="emits('changeSpot')" :disabled="isLoading">CHANGE SPOT</button>
      </td>
    </tr>
    <tr v-if="enrollments.length === 0 && !isLoading">
      <td colspan="7">
        empty
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
