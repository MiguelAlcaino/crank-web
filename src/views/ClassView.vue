<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute } from 'vue-router'

import dayjs from 'dayjs'

import { type ClassInfo, SiteEnum } from "@/gql/graphql";
import { apiService } from "@/services/apiService";

import ReserveSpotButton from "@/components/ReserveSpotButton.vue";
import SpotMatrix from "@/components/SpotMatrix.vue";
import WaitlistButton from "@/components/WaitlistButton.vue"

const route = useRoute();

const isLoading = ref<boolean>(false);
const classInfo = ref<ClassInfo | null>(null);

onMounted(() => {
  getClassInfo();
});

watch(
  () => route.params.id,
  newId => {
    getClassInfo();
  }
);

async function getClassInfo() {
  isLoading.value = true;

  const classId = route.params.id as string;
  classInfo.value = await apiService.getClassInfo(SiteEnum.Dubai, classId);

  console.log(classInfo.value);

  isLoading.value = false;
}
</script>

<template>
  <h2>RESERVE A SPOT</h2>

  <div class="container">
    <div class="row">
      <div class="col-12 text-center">
        <h4>{{ classInfo?.class.name }}</h4>
        <p><span v-html="classInfo?.class.description"></span></p>
        <p><b>Instructor: </b> {{ classInfo?.class.instructorName }}</p>
        <p><b>Date: </b> <span>{{ dayjs(classInfo?.class.startWithNoTimeZone).format("DD/MM/YYYY") }}</span></p>
        <p><b>Time: </b> <span>{{ dayjs(classInfo?.class.startWithNoTimeZone).format("h:mm a") }}</span> |
          <b>Duration: </b>
          <span>{{ classInfo?.class.duration }}</span> mins.
        </p>
      </div>
    </div>
    <hr>
    <div class="row">
      <div class="col-12 text-center">
        <WaitlistButton v-if="classInfo !== null && classInfo.class.waitListAvailable" :classInfo="classInfo.class"></WaitlistButton>
        <SpotMatrix v-if="classInfo !== null && classInfo.matrix !== null" :matrix="classInfo.matrix"></SpotMatrix>
        <ReserveSpotButton v-if="classInfo !== null && classInfo.matrix === null" :classInfo="classInfo.class">
        </ReserveSpotButton>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
