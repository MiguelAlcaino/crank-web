<script setup lang="ts">
import { ref } from 'vue'

import ClassDetails from '@/components/ClassDetails.vue'
import CalendarList from '@/components/CalendarList.vue'

const classId = ref<string | null>(null)

function selectClass(id: string | null) {
  classId.value = id
}
</script>

<template>
  <div class="row">
    <div class="col-lg-3 col-md-3 col-sm-4">
      <CalendarList @select-class="selectClass"></CalendarList>
    </div>
    <div class="col-lg-9 col-md-9 col-sm-8">
      <ClassDetails :class-id="classId"></ClassDetails>
    </div>
  </div>
</template>

<style scoped></style>
