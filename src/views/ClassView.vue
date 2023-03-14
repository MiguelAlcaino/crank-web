<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute } from 'vue-router'

import dayjs from 'dayjs'

import { type ClassInfo, SiteEnum } from "@/gql/graphql";
import { apiService } from "@/services/apiService";

import ConfirmModal from '@/components/ConfirmModal.vue';
import SuccessModal from "@/components/SuccessModal.vue";
import ErrorModal from "@/components/ErrorModal.vue";

import ReserveSpotButton from "@/components/ReserveSpotButton.vue";
import SpotMatrix from "@/components/SpotMatrix.vue";
import WaitlistButton from "@/components/WaitlistButton.vue"



const route = useRoute();

const classId = ref<string>("");
const spotNumber = ref<number | null>(null);
const isWaitlistBooking = ref<boolean | null>(null);

const isLoading = ref<boolean>(false);
const showSuccessModal = ref<boolean>(false);
const showErrorModal = ref<boolean>(false);
const showModal = ref<boolean>(false);
const classInfo = ref<ClassInfo | null>(null);

const confirmModalData = ref<{ title: string, message: string, isLoading: boolean }>({ title: "", message: "", isLoading: false });
const errorModalData = ref<{ title: string, message: string, isLoading: boolean }>({ title: "", message: "", isLoading: false });

interface SpotClickedEvent {
  spotNumber: number | null
}

onMounted(() => {
  classId.value = route.params.id as string;
  getClassInfo();
});

watch(
  () => route.params.id,
  Id => {
    getClassInfo();
  }
);

async function getClassInfo() {

  isLoading.value = true;

  const classId = route.params.id as string;
  classInfo.value = await apiService.getClassInfo(SiteEnum.Dubai, classId);

  isLoading.value = false;
}

function confirmBookSpot(event: SpotClickedEvent): void {
  spotNumber.value = event.spotNumber;
  isWaitlistBooking.value = null;

  confirmModalData.value.isLoading = false;
  confirmModalData.value.title = "BOOK YOUR SPOT";
  confirmModalData.value.message = "WOULD YOU LIKE TO BOOK SPOT " + event.spotNumber + "?";

  showModal.value = true;
}

function confirmWaitList(): void {
  spotNumber.value = null;
  isWaitlistBooking.value = true;

  confirmModalData.value.isLoading = false;
  confirmModalData.value.title = "ENROLL ON THE WAITLIST";
  confirmModalData.value.message = "WOULD YOU LIKE TO BOOK THIS CLASS?";

  showModal.value = true;
}

function confirmBookClass(): void {
  spotNumber.value = null;
  isWaitlistBooking.value = null;

  confirmModalData.value.isLoading = false;
  confirmModalData.value.title = "BOOK THIS CLASS";
  confirmModalData.value.message = "WOULD YOU LIKE TO BOOK THIS CLASS?";

  showModal.value = true;
}

function acceptSuccessModal() {
  showSuccessModal.value = false;
}

async function bookClass(classId: string, spotNumber: number | null, isWaitlistBooking: boolean | null) {

  confirmModalData.value.isLoading = true;

  // var response = await apiService.bookClass(
  //   SiteEnum.Dubai,
  //   {
  //     classId: classId,
  //     spotNumber: spotNumber,
  //     isWaitlistBooking: isWaitlistBooking
  //   });

  confirmModalData.value.isLoading = false;
  showModal.value = false;

  var response = "UnknownError";

  if (response === "BookClassSuccess") {
    showSuccessModal.value = true;
    //TODO: BookClassSuccess action
  } else {
    if (response === "PaymentRequiredError") {
      errorModalData.value.message = "YOU DO NOT HAVE SUFFICIENT CREDITS IN YOUR ACCOUNT.";

      //TODO: PaymentRequiredError action
    } else if (response === "ClientIsAlreadyBookedError") {
      //TODO: ClientIsAlreadyBookedError action
      errorModalData.value.message = "YOU ALREADY BOOKED IN THIS CLASS.";

    } else if (response === "ClientIsOutsideSchedulingWindowError") {
      //TODO: ClientIsOutsideSchedulingWindowError action
      errorModalData.value.message = "THE CLASS IS OUTSIDE THE SCHEDULING WINDOW.";

    } else if (response === "SpotAlreadyReservedError") {
      //TODO: SpotAlreadyReservedError action
      errorModalData.value.message = "THE SPOT HAS BEEN BOOKED BY ANOTHER USER.";

    } else if (response === "BookedButInOtherSpotError") {
      //TODO: BookedButInOtherSpotError action
      errorModalData.value.message = "BOOKED BUT IN OTHER SPOT ERROR.";

    } else if (response === "ClassIsFullError") {
      //TODO: ClassIsFullError action
      errorModalData.value.message = "THE CLASS IS FULL.";

    } else if (response === "UnknownError") {
      //TODO: UnknownError action
      errorModalData.value.message = "UPS! SORRY, WE DIDN'T SEE THAT COMIMG!. PLASE TRY AGAIN OR COMMUNICATE WITH THE TEAM TO RESOLVE THIS ISSUE.";
    }

    showErrorModal.value = true;
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
        <WaitlistButton v-if="classInfo !== null && classInfo.class.waitListAvailable"
          @click-book-wait-list="confirmWaitList">
        </WaitlistButton>
        <SpotMatrix v-if="classInfo !== null && classInfo.matrix !== null" :matrix="classInfo.matrix"
          @click-spot="confirmBookSpot"></SpotMatrix>
        <ReserveSpotButton v-if="classInfo !== null && classInfo.matrix === null" @click-book-class="confirmBookClass">
        </ReserveSpotButton>
      </div>
    </div>
  </div>

  <ConfirmModal v-model="showModal" :title="confirmModalData.title" :isLoading="confirmModalData.isLoading"
    @cancel="showModal = false" @confirm="bookClass(classId, spotNumber, isWaitlistBooking)" :click-to-close="false">
    <p>{{ confirmModalData.message }}</p>
  </ConfirmModal>

  <SuccessModal title="SUCCESS" message="YOUR BOOKING IS COMPLETE" :clickToClose="false" @accept="acceptSuccessModal"
    v-model="showSuccessModal">
  </SuccessModal>

  <ErrorModal :is-loading="false" :message="errorModalData.message" :click-to-close="false" v-model="showErrorModal"
    @action="showErrorModal = false" @cancel="showErrorModal = false"></ErrorModal>
</template>

<style scoped></style>
