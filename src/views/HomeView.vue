<script setup lang="ts">

import TheWelcome from "../components/TheWelcome.vue";
import {onMounted} from "vue";
import {apiService} from "@/services/apiService";
import {
  SiteEnum,
  CalendarClassesParams,
  CurrentUserEnrollmentsParams,
  EnrollmentTypeEnum,
  UserInput,
  BookClassInput
} from "@/gql/graphql";

onMounted(async () => {
  /*
  let country = await apiService.getCountry("AE");
  console.log("country", country);

  let countries = await apiService.getCountries();
  console.log("countries", countries);

  let mySelf = await apiService.getMyself();
  console.log("mySelf", mySelf);

  let currentUserWorkoutStats = await apiService.getCurrentUserWorkoutStats(SiteEnum.Dubai);
  console.log("currentUserWorkoutStats", currentUserWorkoutStats);

  let params: CalendarClassesParams = {startDate: "2022-10-24", endDate: "2022-10-30"};
  let calendarClasses = await apiService.getCalendarClasses(SiteEnum.Dubai, params);
  console.log("calendarClasses", calendarClasses);

  let classInfo = await apiService.getClassInfo(SiteEnum.Dubai, "473");
  console.log("classInfo", classInfo);

  let params2: CurrentUserEnrollmentsParams = {
    startDate: "2022-10-24",
    endDate: "2022-10-30",
    enrollmentType: EnrollmentTypeEnum.All
  };
  let currentUserEnrollments = await apiService.getCurrentUserEnrollments(SiteEnum.Dubai, params2);
  console.log("currentUserEnrollments", currentUserEnrollments);

  let currentUserPurchases = await apiService.getCurrentUserPurchases(SiteEnum.Dubai);
  console.log("currentUserPurchases", currentUserPurchases);


  let customCalendarClasses = await apiService.getCustomCalendarClasses(
      SiteEnum.Dubai,
      new Date(2020, 9, 24),
      new Date(2020, 9, 30));
  console.log("customCalendarClasses", customCalendarClasses);


  let mySelf = await apiService.getMyself();
  console.log("mySelf", mySelf);

  if (mySelf) {
    const userInput: UserInput = {
      address1: mySelf.address1,
      address2: mySelf.address2,
      birthdate: mySelf.birthdate,
      city: mySelf.state?.code,
      country: mySelf.country.code,
      emergencyContactName: mySelf.emergencyContactName,
      emergencyContactPhone: mySelf.emergencyContactPhone,
      emergencyContactRelationship: mySelf.emergencyContactRelationship,
      firstName: mySelf.firstName,
      gender: mySelf.gender,
      hideMetrics: mySelf.hideMetrics ?? true,
      lastName: mySelf.lastName,
      leaderboardUsername: mySelf.leaderboardUsername,
      phone: mySelf.phone,
      state: mySelf.state?.code,
      weight: mySelf.weight,
      zipCode: mySelf.zipCode,
    };
    const user = await apiService.updateCurrentUser(userInput);
    console.log("updateCurrentUser", user);
  }
*/
  const bookClassInput: BookClassInput = {classId: "580", isWaitlistBooking: false, spotNumber: 1};
  let responseBookClassInput = await apiService.bookClass(SiteEnum.Dubai, bookClassInput);
  console.log("responseBookClassInput", responseBookClassInput);

});

</script>

<template>
  <main>
    <TheWelcome/>
  </main>
</template>
