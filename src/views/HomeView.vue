<script setup lang="ts">

import TheWelcome from "../components/TheWelcome.vue";
import {onMounted} from "vue";
import {apiService} from "@/services/apiService";
import {SiteEnum, CalendarClassesParams, CurrentUserEnrollmentsParams, EnrollmentTypeEnum} from "@/gql/graphql";

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
*/

  let customCalendarClasses = await apiService.getCustomCalendarClasses(
      SiteEnum.Dubai,
      new Date(2020, 9, 24),
      new Date(2020, 9, 30));
  console.log("customCalendarClasses", customCalendarClasses);

});

</script>

<template>
  <main>
    <TheWelcome/>
  </main>
</template>
