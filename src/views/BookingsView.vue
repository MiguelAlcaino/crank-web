<script setup lang="ts">
import {onMounted, ref} from "vue";
import {apiService} from "@/services/apiService";
import {
  CancelEnrollmentInput,
  CurrentUserEnrollmentsParams,
  Enrollment,
  EnrollmentTypeEnum,
  RemoveCurrentUserFromWaitlistInput,
  SiteEnum
} from "@/gql/graphql";
import dayjs from "dayjs";

import BookingsTable from "@/components/BookingsTable.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import SuccessModal from "@/components/SuccessModal.vue";
import ErrorModal from "@/components/ErrorModal.vue";

const isLoading = ref<boolean>(false);
const userErollments = ref<Enrollment[]>([]);
const siteDateTimeNow = ref<Date>(new Date);
const isCancellingCurrentUserEnrollment = ref<boolean>(false);

const filterStartDate = ref<Date | null>(null);
const filterEndDate = ref<Date | null>(null);
const filterEnrollmentType = ref<EnrollmentTypeEnum>(EnrollmentTypeEnum.Upcoming);

const modalConfirmRemoveFromWaitlistisVisible = ref<boolean>(false);
const waitlistEntryIdToRemove = ref<string | null>(null);

const enrollmentIdToRemove = ref<string | null>(null);
const enrollmentIsLateCancel = ref<boolean>(false);

const successModalData = ref<{ title: string, message: string, isLoading: boolean, isVisible: boolean }>({
  title: "",
  message: "",
  isLoading: false,
  isVisible: false
});

const errorModalData = ref<{ title: string, message: string, isLoading: boolean, isVisible: boolean }>({
  title: "",
  message: "",
  isLoading: false,
  isVisible: false
});

const confirmModalData = ref<{ title: string, message: string, textConfirmButton: string, isLoading: boolean, isVisible: boolean }>({
  title: "",
  message: "",
  textConfirmButton: "",
  isLoading: false,
  isVisible: false
});


onMounted(() => {
  getSiteDateTimeNow();
  getUserErollments();
});

async function getSiteDateTimeNow() {
  siteDateTimeNow.value = new Date();

  const siteSetting = await apiService.getSiteSettings(SiteEnum.Dubai);

  if (siteSetting)
    siteDateTimeNow.value = new Date(siteSetting.siteDateTimeNow);
}

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

async function cancelCurrentUserEnrollment(enrollmentId: string, lateCancel: boolean): Promise<void> {
  isCancellingCurrentUserEnrollment.value = true;

  const input = {enrollmentId: enrollmentId, lateCancel: lateCancel} as CancelEnrollmentInput;

  const response = await apiService.cancelCurrentUserEnrollment(SiteEnum.Dubai, input);

  isCancellingCurrentUserEnrollment.value = false;

  confirmModalData.value.isVisible = false;

  switch (response) {
    case "CancelUserEnrollmentSuccess": {
      successModalData.value.title = "SUCCESS";
      successModalData.value.message = "YOUR BOOKING HAS BEEN CANCELLED";
      successModalData.value.isVisible = true;
      break;
    }
    case "LateCancellationRequiredError": {
      enrollmentIdToRemove.value = enrollmentId;
      enrollmentIsLateCancel.value = true;

      confirmModalData.value.title = "CANCEL BOOKING";
      confirmModalData.value.message = "YOU ARE OUTSIDE THE EARLY CANCELLATION WINDOW. YOU CAN ONLY MAKE A LATE CANCELLATION.";
      confirmModalData.value.textConfirmButton = "CONFIRM";
      confirmModalData.value.isVisible = true;
      break;
    }
    default: {
      errorModalData.value.message = "UPS! SORRY, WE DIDN'T SEE THAT COMING!. PLEASE TRY AGAIN OR COMMUNICATE WITH THE TEAM TO RESOLVE THIS ISSUE.";
      errorModalData.value.isVisible = true;
      break;
    }
  }

}

async function removeCurrentUserFromWaitlist(waitlistEntryId: string): Promise<void> {
  const input = {waitlistEntryId: waitlistEntryId} as RemoveCurrentUserFromWaitlistInput;

  isCancellingCurrentUserEnrollment.value = true;

  const response = await apiService.removeCurrentUserFromWaitlist(SiteEnum.Dubai, input);

  isCancellingCurrentUserEnrollment.value = false;

  modalConfirmRemoveFromWaitlistisVisible.value = false;

  switch (response["__typename"]) {
    case "RemoveFromWaitlistResult": {
      successModalData.value.title = "SUCCESS";
      successModalData.value.message = "HAS BEEN SUCCESSFULLY REMOVED FROM WAITLIST";
      successModalData.value.isVisible = true;
      break;
    }
    case "WaitlistEntryNotFoundError": {
      errorModalData.value.message = "UPS! SORRY, WE DIDN'T SEE THAT COMING!. PLEASE TRY AGAIN OR COMMUNICATE WITH THE TEAM TO RESOLVE THIS ISSUE.";
      errorModalData.value.isVisible = true;
      break;
    }
    default: {
      errorModalData.value.message = "UPS! SORRY, WE DIDN'T SEE THAT COMING!. PLEASE TRY AGAIN OR COMMUNICATE WITH THE TEAM TO RESOLVE THIS ISSUE.";
      errorModalData.value.isVisible = true;
      break;
    }
  }
}

function clickRemoveFromWaitlist(waitlistEntryId: string): void {
  waitlistEntryIdToRemove.value = waitlistEntryId;
  modalConfirmRemoveFromWaitlistisVisible.value = true;
}

function clickCancelEnrollment(enrollmentId: string, lateCancel: boolean): void {
  enrollmentIdToRemove.value = enrollmentId;
  enrollmentIsLateCancel.value = lateCancel;

  confirmModalData.value.title = "CANCEL BOOKING";
  confirmModalData.value.message = "ARE YOU SURE YOU WANT TO CANCEL YOUR BOOKING?";
  confirmModalData.value.textConfirmButton = "OK";

  if (lateCancel) {
    confirmModalData.value.message += " YOU WILL STILL BE CHARGED A CREDIT FOR THIS CLASS"
  }

  confirmModalData.value.isLoading = false;
  confirmModalData.value.isVisible = true;
}

async function acceptSuccessModal() {
  await getUserErollments();
  successModalData.value.isVisible = false;
}

</script>

<template>
  <h2>BOOKINGS</h2>
  <select v-model="filterEnrollmentType" @change="getUserErollments()" :disabled="isLoading">
    <option :value="EnrollmentTypeEnum.Upcoming">UPCOMING</option>
    <option :value="EnrollmentTypeEnum.Waitlist">WAITLIST</option>
    <option :value="EnrollmentTypeEnum.Historical">HISTORICAL</option>
  </select>
  <br/>
  <br/>

  <BookingsTable :enrollments="userErollments" :isLoading="isLoading"
                 :enrollmentType="filterEnrollmentType" :siteDateTimeNow="siteDateTimeNow"
                 @clickCancelEnrollment="clickCancelEnrollment"
                 @clickRemoveFromWaitlist="clickRemoveFromWaitlist">
  </BookingsTable>

  <!-- CONFIRM REMOVE FROM WAITLIST modal -->
  <ConfirmModal title="REMOVE FROM WAITLIST"
                message="ARE YOU SURE YOU WANT TO BE REMOVED FROM THE WAITLIST?"
                textCancelBtn="CANCEL"
                textConfirmButton="OK"
                :isLoading="isCancellingCurrentUserEnrollment"
                :clickToClose="true"
                v-model="modalConfirmRemoveFromWaitlistisVisible"
                @cancel="modalConfirmRemoveFromWaitlistisVisible = false"
                @confirm="removeCurrentUserFromWaitlist(waitlistEntryIdToRemove)"
  ></ConfirmModal>

  <!-- CONFIRM CANCEL BOOKING modal -->
  <ConfirmModal :title="confirmModalData.title"
                :message="confirmModalData.message"
                textCancelBtn="CANCEL"
                :textConfirmButton="confirmModalData.textConfirmButton"
                :isLoading="isCancellingCurrentUserEnrollment"
                :clickToClose="true"
                v-model="confirmModalData.isVisible"
                @cancel="modalConfirmRemoveFromWaitlistisVisible = false"
                @confirm="cancelCurrentUserEnrollment(enrollmentIdToRemove, enrollmentIsLateCancel)"
  ></ConfirmModal>

  <!-- SUCCESS modal -->
  <SuccessModal :title="successModalData.title"
                :message="successModalData.message"
                :clickToClose="false"
                @accept="acceptSuccessModal"
                v-model="successModalData.isVisible">
  </SuccessModal>

  <!-- ERROR modal -->
  <ErrorModal :isLoading="false"
              :message="errorModalData.message"
              :clickToClose="false"
              v-model="errorModalData.isVisible"
              @close="errorModalData.isVisible = false">
  </ErrorModal>
</template>

<style scoped></style>
