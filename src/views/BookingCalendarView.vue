<script setup lang="ts">

import {onMounted, ref} from "vue";
import moment from "moment/moment";
import {Class, SiteEnum} from "@/gql/graphql";
import {apiService} from "@/services/apiService";
import {DayOfTheWeek} from "@/model/DayOfTheWeek";


const selectedDay = ref<Date>(new Date);
const siteDateTimeNow = ref<Date>(new Date);
const calendarIsLoading = ref<boolean>(false);
const hasPreviousWeek = ref<boolean>(false);
const daysOfTheWeek = ref<DayOfTheWeek[]>([]);

onMounted(() => {
  getClassesOfTheWeek();
});

function goToNextWeek(): void {

  const date = moment(selectedDay.value);

  const firstDayOfNextWeek = date.clone().add(1, 'weeks').startOf('week').toDate();
  const lastDayOfNextWeek = date.clone().add(1, 'weeks').endOf('week').toDate();

  console.log("firstDayOfPrevWeek", firstDayOfNextWeek);
  console.log("lastDayOfPrevWeek", lastDayOfNextWeek);

  selectedDay.value = firstDayOfNextWeek;

  getClassesOfTheWeek();
}

function goToPrevWeek(): void {
  const date = moment(selectedDay.value);

  const firstDayOfPrevWeek = date.clone().subtract(1, 'weeks').startOf('week').toDate();
  const lastDayOfPrevWeek = date.clone().subtract(1, 'weeks').endOf('week').toDate();

  console.log("firstDayOfPrevWeek", firstDayOfPrevWeek);
  console.log("lastDayOfPrevWeek", lastDayOfPrevWeek);

  selectedDay.value = firstDayOfPrevWeek;

  getClassesOfTheWeek();
}

async function getClassesOfTheWeek(): Promise<void> {
  calendarIsLoading.value = true;
  hasPreviousWeek.value = false;
  daysOfTheWeek.value = [];

  let currentDate = moment(selectedDay.value);
  const firstDayWeek = currentDate.clone().startOf('week').toDate();
  const lastDayWeek = currentDate.clone().endOf('week').toDate();

  let customCalendarClasses = await apiService.getCustomCalendarClasses(SiteEnum.Dubai, firstDayWeek, lastDayWeek);

  if (customCalendarClasses != null) {
    siteDateTimeNow.value = customCalendarClasses.siteSettings.siteDateTimeNow;

    /*
        await _markClassesEnrolled(bookingCalendarData);
        await _markClassesInWaitlist(bookingCalendarData);
     */

    let dates: Date[] = [];

    for (let i = 0; i < customCalendarClasses.calendarClasses.length; i++) {
      let day: Date = new Date(customCalendarClasses.calendarClasses[i].start);

      if (!dates.find(date => moment(date).isSame(day, 'day')))
        dates.push(day);
    }

    const _actualDate = new Date();

    for (let i = 0; i < dates.length; i++) {
      let date = moment(dates[i]);

      const disabled: boolean = moment(date).isBefore(_actualDate, 'day');
      const selected: boolean = moment(date).isSame(_actualDate, 'day');

      const calendarClasses: Class[] = customCalendarClasses.calendarClasses.filter(x => moment(new Date(x.start)).isSame(date, "day"));


      //console.log(date);
      console.log("calendarClasses", calendarClasses);

      daysOfTheWeek.value.push(new DayOfTheWeek(selected, disabled, date.toDate(), calendarClasses));

      if (date.isSame(_actualDate, 'day'))
        hasPreviousWeek.value = false;
    }

    console.log(daysOfTheWeek.value);

    calendarIsLoading.value = false;
  }


}
</script>

<template>
  <button @click="goToPrevWeek()">Prev</button>
  <button @click="goToNextWeek()">Next</button>
  <div>
    Booking Calendar View
    <div v-if="calendarIsLoading">Loading....</div>
    <!--      <div v-else-if="error">Error: {{ error.message }}</div>-->
    <div v-else>


      Calendar

    </div>
  </div>
</template>

<style></style>