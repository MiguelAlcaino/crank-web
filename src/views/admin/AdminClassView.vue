<script setup lang="ts">
import { ref } from 'vue'

import ClassDetails from '@/components/ClassDetails.vue'
import CalendarList from '@/components/CalendarList.vue'

const classId = ref<string | null>(null)
const calendarList = ref<InstanceType<typeof CalendarList> | null>(null)

function selectClass(id: string | null) {
  classId.value = id
}

function availableSpotsChanged() {
  calendarList.value?.getCalendarClasses(false)
}
</script>

<template>
  <div class="row">
    <div class="col-lg-3 col-md-3 col-sm-4">
      <CalendarList @select-class="selectClass" ref="calendarList"></CalendarList>
    </div>
    <div class="col-lg-9 col-md-9 col-sm-8">
      <ClassDetails
        :class-id="classId"
        @available-spots-changed="availableSpotsChanged"
      ></ClassDetails>
    </div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
