<script lang="ts">
interface EnrollmentInfo {
  id: string
  enrollmentStatus?: string
  enrollmentDateTime?: string
  user?: User | null
}

interface User {
  firstName: string
  lastName: string
  email: string
}
</script>

<script setup lang="ts">
const props = defineProps<{
  enrollments: EnrollmentInfo[]
  isLoading: boolean
}>()

const emits = defineEmits<{
  (e: 'clickSpot', spotNumber: number): void
}>()
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>FIRST NAME</th>
        <th>LAST NAME</th>
        <th>SIGN IN</th>
        <th>CANCEL RESERVATION</th>
        <th>VIEW PROFILE</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in enrollments" v-bind:key="item.id" v-bind:index="index">
        <td>{{ item.user?.firstName }}</td>
        <td>{{ item.user?.lastName }}</td>
        <td>
          <button class="btn btn-primary" type="button">Check - In</button>
        </td>
        <td>
          <button class="btn btn-primary" type="button">Cancel Member's Reservation</button>
        </td>
        <td>
          <button class="btn btn-primary" type="button">View Profile</button>
        </td>
      </tr>
      <tr v-if="!isLoading && enrollments.length === 0">
        <td colspan="4" class="tableMessageNoRecords">There are no users enrolled in this class</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.tableMessageNoRecords {
  text-align: center;
}
</style>
