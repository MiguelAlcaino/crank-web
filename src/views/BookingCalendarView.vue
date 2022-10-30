<script setup lang="ts">

import {onMounted, ref} from "vue";
import {type Class, Enrollment, SiteEnum} from "@/gql/graphql";
import {apiService} from "@/services/apiService";
import {DayOfTheWeek} from "@/model/DayOfTheWeek";
import dayjs from 'dayjs'
import CalendarCard from "@/components/CalendarCard.vue";

dayjs.Ls.en.weekStart = 1;

const columnsNames = ref<string[]>([]);
const calendarDays = ref<Calendar[]>([]);
const selectedDay = ref<Date>(new Date);
const siteDateTimeNow = ref<Date>(new Date);
const calendarIsLoading = ref<boolean>(false);
const hasPreviousWeek = ref<boolean>(false);
const daysOfTheWeek = ref<DayOfTheWeek[]>([]);

onMounted(() => {
  getClassesOfTheWeek();
});

function goToNextWeek(): void {

  const date = dayjs(selectedDay.value);

  const firstDayOfNextWeek = date.clone().add(1, 'weeks').startOf('week').toDate();
  const lastDayOfNextWeek = date.clone().add(1, 'weeks').endOf('week').toDate();

  /*  console.log("firstDayOfPrevWeek", firstDayOfNextWeek);
    console.log("lastDayOfPrevWeek", lastDayOfNextWeek);*/

  selectedDay.value = firstDayOfNextWeek;

  getClassesOfTheWeek();
}

function goToPrevWeek(): void {
  const date = dayjs(selectedDay.value);

  const firstDayOfPrevWeek = date.clone().subtract(1, 'weeks').startOf('week').toDate();
  const lastDayOfPrevWeek = date.clone().subtract(1, 'weeks').endOf('week').toDate();

  /*  console.log("firstDayOfPrevWeek", firstDayOfPrevWeek);
    console.log("lastDayOfPrevWeek", lastDayOfPrevWeek);*/

  selectedDay.value = firstDayOfPrevWeek;

  getClassesOfTheWeek();
}

async function getClassesOfTheWeek(): Promise<void> {
  calendarIsLoading.value = true;
  hasPreviousWeek.value = false;
  daysOfTheWeek.value = [];

  let currentDate = dayjs(selectedDay.value);
  const firstDayWeek = currentDate.clone().startOf('week').toDate();
  const lastDayWeek = currentDate.clone().endOf('week').toDate();

  let customCalendarClasses = await apiService.getCustomCalendarClasses(SiteEnum.Dubai, firstDayWeek, lastDayWeek);

  if (customCalendarClasses != null) {
    siteDateTimeNow.value = customCalendarClasses.siteSettings.siteDateTimeNow;

    /*
        await _markClassesEnrolled(bookingCalendarData);
        await _markClassesInWaitlist(bookingCalendarData);
     */

    columnsNames.value = [];

    let dates: Date[] = [];
    let day = dayjs(firstDayWeek);
    for (let i = 0; i < 7; i++) {
      dates.push(day.toDate());

      columnsNames.value.push(day.format("ddd DD.MM").toUpperCase());
      day = day.add(1, 'day');
    }


    const _actualDate = new Date();


    for (let i = 0; i < dates.length; i++) {
      let date = dayjs(dates[i]);

      const disabled: boolean = date.isBefore(_actualDate, 'day');
      const selected: boolean = date.isSame(_actualDate, 'day');

      const calendarClasses: Class[] = customCalendarClasses.calendarClasses.filter(x => dayjs(new Date(x.start)).isSame(date, "day"));

      daysOfTheWeek.value.push(new DayOfTheWeek(selected, disabled, date.toDate(), calendarClasses));

      if (date.isSame(_actualDate, 'day'))
        hasPreviousWeek.value = false;
    }

    getPivot();

    calendarIsLoading.value = false;
  }
}

function getPivot() {
  calendarDays.value = [];

  let maxClasses = 0;

  for (let i = 0; i < daysOfTheWeek.value.length; i++) {
    if (maxClasses < daysOfTheWeek.value[i].classes.length) {
      maxClasses = daysOfTheWeek.value[i].classes.length;
    }
  }

  for (let i = 0; i < maxClasses; i++) {
    let rowCalendar: Calendar = new Calendar();
    for (let dia = 0; dia < 7; dia++) {
      if (dia === 0) {
        if (typeof daysOfTheWeek.value[dia] !== "undefined" && typeof daysOfTheWeek.value[dia].classes[i] !== "undefined") {
          rowCalendar.MON = daysOfTheWeek.value[dia].classes[i];
        }
      } else if (dia === 1) {
        if (typeof daysOfTheWeek.value[dia] !== "undefined" && typeof daysOfTheWeek.value[dia].classes[i] !== "undefined")
          rowCalendar.TUE = daysOfTheWeek.value[dia].classes[i];
      } else if (dia === 2) {
        if (typeof daysOfTheWeek.value[dia] !== "undefined" && typeof daysOfTheWeek.value[dia].classes[i] !== "undefined")
          rowCalendar.WED = daysOfTheWeek.value[dia].classes[i];
      } else if (dia === 3) {
        if (typeof daysOfTheWeek.value[dia] !== "undefined" && typeof daysOfTheWeek.value[dia].classes[i] !== "undefined")
          rowCalendar.THU = daysOfTheWeek.value[dia].classes[i];
      } else if (dia === 4) {
        if (typeof daysOfTheWeek.value[dia] !== "undefined" && typeof daysOfTheWeek.value[dia].classes[i] !== "undefined")
          rowCalendar.FRI = daysOfTheWeek.value[dia].classes[i];
      } else if (dia === 5) {
        if (typeof daysOfTheWeek.value[dia] !== "undefined" && typeof daysOfTheWeek.value[dia].classes[i] !== "undefined")
          rowCalendar.SAT = daysOfTheWeek.value[dia].classes[i];
      } else if (dia === 6) {
        if (typeof daysOfTheWeek.value[dia] !== "undefined" && typeof daysOfTheWeek.value[dia].classes[i] !== "undefined")
          rowCalendar.SUN = daysOfTheWeek.value[dia].classes[i];
      }
    }

    calendarDays.value.push(rowCalendar);
  }
}

class Calendar {
  MON?: Class;
  TUE?: Class;
  WED?: Class;
  THU?: Class;
  FRI?: Class;
  SAT?: Class;
  SUN?: Class;
}
</script>

<template>
  <div class="row">
    <div class="col-6">
      <button @click="goToPrevWeek()">Prev</button>
    </div>
    <div class="col-6" style="text-align: right">
      <button @click="goToNextWeek()">Next</button>
    </div>
  </div>
  <div class="row">
    <div class="col-12">
      <div v-if="calendarIsLoading">Loading....</div>
      <div v-else>
        <div class="row" >
          <div class="col" v-for="(colName, key) in columnsNames" :key="key">
            <b> {{ colName }}</b>
          </div>
        </div>
        <div class="row" v-for="(colRow, key) in calendarDays" :key="key">
          <div class="col">
            <CalendarCard :classInfo="colRow.MON"></CalendarCard>
          </div>
          <div class="col">
            <CalendarCard :classInfo="colRow.TUE"></CalendarCard>
          </div>
          <div class="col">
            <CalendarCard :classInfo="colRow.WED"></CalendarCard>
          </div>
          <div class="col">
            <CalendarCard :classInfo="colRow.THU"></CalendarCard>
          </div>
          <div class="col">
            <CalendarCard :classInfo="colRow.FRI"></CalendarCard>
          </div>
          <div class="col">
            <CalendarCard :classInfo="colRow.SAT"></CalendarCard>
          </div>
          <div class="col">
            <CalendarCard :classInfo="colRow.SUN"></CalendarCard>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style>

</style>