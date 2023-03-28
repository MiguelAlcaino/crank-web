<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useRoute} from 'vue-router'

import dayjs from 'dayjs'

import {
  type ClassInfo,
  EnrollmentTypeEnum,
  SiteEnum
} from "@/gql/graphql";
import {apiService} from "@/services/apiService";

import ConfirmModal from '@/components/ConfirmModal.vue';
import SuccessModal from "@/components/SuccessModal.vue";
import ErrorModal from "@/components/ErrorModal.vue";

import ReserveSpotButton from "@/components/ReserveSpotButton.vue";
import SpotMatrix from "@/components/SpotMatrix.vue";
import WaitlistButton from "@/components/WaitlistButton.vue"
import router from "@/router";
import PaymentErrorModal from "@/components/PaymentErrorModal.vue";


const route = useRoute();

const classId = ref<string>("");
const spotNumber = ref<number | null>(null);
const isWaitlistBooking = ref<boolean | null>(null);

const isLoading = ref<boolean>(false);
const showSuccessModal = ref<boolean>(false);
const showErrorModal = ref<boolean>(false);
const showModal = ref<boolean>(false);
const classInfo = ref<ClassInfo | null>(null);
const enrollmentEnabled = ref<boolean>(true);

const confirmModalData = ref<{ title: string, message: string, isLoading: boolean }>({
  title: "",
  message: "",
  isLoading: false
});
const errorModalData = ref<{ title: string, message: string, isLoading: boolean }>({
  title: "",
  message: "",
  isLoading: false
});

const successModalData = ref<{ title: string, message: string, isLoading: boolean }>({
  title: "",
  message: "",
  isLoading: false
});

const paymentErrorModal = ref<boolean>(false);

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
  const _classInfo = await apiService.getClassInfo(SiteEnum.Dubai, classId);

  if (_classInfo) {
    const userEnrollments = await apiService.getCurrentUserEnrollments(SiteEnum.Dubai,
        {
          enrollmentType: EnrollmentTypeEnum.All,
          startDate: dayjs(new Date(_classInfo.class.start)).format("YYYY-MM-DD"),
          endDate: dayjs(new Date(_classInfo.class.start)).format("YYYY-MM-DD")
        });

    for (let i = 0; i < userEnrollments.length; i++) {
      if (userEnrollments[i].class.id === classId) {
        enrollmentEnabled.value = false;
        break;
      }
    }
  }

  classInfo.value = _classInfo;

  isLoading.value = false;
}

function confirmBookSpot(event: SpotClickedEvent): void {
  spotNumber.value = event.spotNumber;
  isWaitlistBooking.value = false;

  confirmModalData.value.isLoading = false;
  confirmModalData.value.title = "BOOK YOUR SPOT";
  confirmModalData.value.message = "WOULD YOU LIKE TO BOOK SPOT " + event.spotNumber + "?";

  showModal.value = true;
}

function clickBookWaitList(): void {
  spotNumber.value = null;
  isWaitlistBooking.value = true;

  confirmModalData.value.isLoading = false;
  confirmModalData.value.title = "ENROLL ON THE WAITLIST";
  confirmModalData.value.message = "WOULD YOU LIKE TO ENROLL ON THE WAITLIST?";

  showModal.value = true;
}

function confirmBookClass(): void {
  spotNumber.value = null;
  isWaitlistBooking.value = false;

  confirmModalData.value.isLoading = false;
  confirmModalData.value.title = "BOOK THIS CLASS";
  confirmModalData.value.message = "WOULD YOU LIKE TO BOOK THIS CLASS?";

  showModal.value = true;
}

function acceptSuccessModal() {
  showSuccessModal.value = false;
  router.replace({name: "calendar"});
}

function goToThePackagesScreen() {
  //TODO: go to the packages screen
}

async function bookClass(classId: string, spotNumber: number | null, isWaitlistBooking: boolean) {

  confirmModalData.value.isLoading = true;

  const response = await apiService.bookClass(
      SiteEnum.Dubai,
      {
        classId: classId,
        spotNumber: spotNumber,
        isWaitlistBooking: isWaitlistBooking
      });

  confirmModalData.value.isLoading = false;
  showModal.value = false;

  if (response === "BookClassSuccess") {
    successModalData.value.title = "SUCCESS";
    successModalData.value.message = "YOUR BOOKING IS COMPLETE";
    showSuccessModal.value = true;
  } else if (response === "AddedToWaitlistSuccess") {
    successModalData.value.title = "SUCCESS";
    successModalData.value.message = "YOU HAVE ADDED TO THE WAITLIST OF CLASS. YOU WILL BE NOTIFIED IF YOU ARE ADDED TO THE CLASS.";
    showSuccessModal.value = true;
  } else {
    if (response === "PaymentRequiredError") {
      paymentErrorModal.value = true;
    } else if (response === "ClientIsAlreadyBookedError") {
      errorModalData.value.message = "YOU ALREADY BOOKED IN THIS CLASS.";
      showErrorModal.value = true;
      enrollmentEnabled.value = false;
    } else if (response === "ClientIsAlreadyOnWaitlistError") {
      errorModalData.value.message = "YOU ALREADY BOOKED IN THIS WAITLIST.";
      showErrorModal.value = true;
      enrollmentEnabled.value = false;
    } else if (response === "WaitlistFullError") {
      errorModalData.value.message = "THE WAITING LIST IS FULL.";
      showErrorModal.value = true;
      enrollmentEnabled.value = false;
    } else if (response === "ClientIsOutsideSchedulingWindowError") {
      errorModalData.value.message = "THE CLASS IS OUTSIDE THE SCHEDULING WINDOW.";
      showErrorModal.value = true;
      enrollmentEnabled.value = false;
    } else if (response === "SpotAlreadyReservedError") {
      errorModalData.value.message = "THE SPOT HAS BEEN BOOKED BY ANOTHER USER.";
      showErrorModal.value = true;
      await getClassInfo();
    } else if (response === "BookedButInOtherSpotError") {
      //TODO: BookedButInOtherSpotError action
      errorModalData.value.message = "BOOKED BUT IN OTHER SPOT ERROR.";
      showErrorModal.value = true;
    } else if (response === "ClassIsFullError") {
      errorModalData.value.message = "THE CLASS IS FULL.";
      showErrorModal.value = true;
      enrollmentEnabled.value = false;
    } else if (response === "UnknownError") {
      errorModalData.value.message = "UPS! SORRY, WE DIDN'T SEE THAT COMING!. PLEASE TRY AGAIN OR COMMUNICATE WITH THE TEAM TO RESOLVE THIS ISSUE.";
      showErrorModal.value = true;
    } else {
      errorModalData.value.message = "UPS! SORRY, WE DIDN'T SEE THAT COMING!. PLEASE TRY AGAIN OR COMMUNICATE WITH THE TEAM TO RESOLVE THIS ISSUE.";
      showErrorModal.value = true;
    }
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
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12">
          <WaitlistButton v-if="classInfo !== null && classInfo.class.waitListAvailable"
                          @clickBookWaitList="clickBookWaitList" :enrollmentEnabled="enrollmentEnabled">
          </WaitlistButton>
          <SpotMatrix v-if="classInfo !== null && classInfo.matrix !== null && !classInfo.class.waitListAvailable"
                      :matrix="classInfo.matrix"
                      @click-spot="confirmBookSpot"></SpotMatrix>
          <ReserveSpotButton
              v-if="classInfo !== null && classInfo.matrix === null && !classInfo.class.waitListAvailable"
              @click-book-class="confirmBookClass" :enrollmentEnabled="enrollmentEnabled">
          </ReserveSpotButton>
        </div>
      </div>
    </div>
  </div>

  <ConfirmModal v-model="showModal"
                :title="confirmModalData.title"
                :message="confirmModalData.message"
                :isLoading="confirmModalData.isLoading"
                @cancel="showModal = false"
                @confirm="bookClass(classId, spotNumber, isWaitlistBooking)"
                :clickToClose="false">
  </ConfirmModal>

  <SuccessModal :title="successModalData.title"
                :message="successModalData.message"
                :clickToClose="false"
                @accept="acceptSuccessModal"
                v-model="showSuccessModal">
  </SuccessModal>

  <ErrorModal :is-loading="false"
              :message="errorModalData.message"
              :clickToClose="false"
              v-model="showErrorModal"
              @close="showErrorModal = false"></ErrorModal>

  <PaymentErrorModal v-model="paymentErrorModal"
                     @close="paymentErrorModal = false"
                     @buy="goToThePackagesScreen">
  </PaymentErrorModal>
</template>

<style scoped></style>
