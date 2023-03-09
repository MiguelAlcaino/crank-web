<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useRoute} from 'vue-router'

import dayjs from 'dayjs'

import {type ClassInfo, SiteEnum} from "@/gql/graphql";
import {apiService} from "@/services/apiService";

import ReserveSpotButton from "@/components/ReserveSpotButton.vue";
import SpotMatrix from "@/components/SpotMatrix.vue";
import WaitlistButton from "@/components/WaitlistButton.vue"

const route = useRoute();

const isLoading = ref<boolean>(false);
const classInfo = ref<ClassInfo | null>(null);

interface SpotClickedEvent {
  spotNumber: number | null
}

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

  isLoading.value = false;
}

function confirmBook(event: SpotClickedEvent): void {
  console.log(event);
}

async function bookClass(classId: string, spotNumber?: number, isWaitlistBooking?: boolean) {
  var response = await apiService.bookClass(
      SiteEnum.Dubai,
      {
        classId: classId,
        spotNumber: spotNumber,
        isWaitlistBooking: isWaitlistBooking
      });

  if (response === "BookClassSuccess") {
    //TODO: BookClassSuccess action
  } else if (response === "PaymentRequiredError") {
    //TODO: PaymentRequiredError action
  } else if (response === "ClientIsAlreadyBookedError") {
    //TODO: ClientIsAlreadyBookedError action
  } else if (response === "ClientIsOutsideSchedulingWindowError") {
    //TODO: ClientIsOutsideSchedulingWindowError action
  } else if (response === "SpotAlreadyReservedError") {
    //TODO: SpotAlreadyReservedError action
  } else if (response === "BookedButInOtherSpotError") {
    //TODO: BookedButInOtherSpotError action
  } else if (response === "ClassIsFullError") {
    //TODO: ClassIsFullError action
  } else if (response === "UnknownError") {
    //TODO: UnknownError action
  }
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
        <WaitlistButton v-if="classInfo !== null && classInfo.class.waitListAvailable" :classInfo="classInfo.class"
                        @click-book-wait-list="confirmBook">
        </WaitlistButton>
        <SpotMatrix v-if="classInfo !== null && classInfo.matrix !== null" :classInfo="classInfo.class"
                    :matrix="classInfo.matrix" @click-spot="confirmBook"></SpotMatrix>
        <ReserveSpotButton v-if="classInfo !== null && classInfo.matrix === null" :classInfo="classInfo.class"
                           @click-book-class="confirmBook">
        </ReserveSpotButton>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
