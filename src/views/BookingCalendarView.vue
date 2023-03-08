<script setup lang="ts">

import {onMounted, ref} from "vue";
import {type Class, SiteEnum} from "@/gql/graphql";
import {apiService} from "@/services/apiService";
import {DayOfTheWeek} from "@/model/DayOfTheWeek";
import {WeekCalendar} from "@/model/WeekCalendar";
import dayjs from 'dayjs'
import CalendarCard from "@/components/CalendarCard.vue";
import IconCalendarCard from "@/components/icons/IconCalendarCard.vue";
import {appStore} from "@/stores/appStorage";

const columnsNames = ref<string[]>([]);
const calendarDays = ref<WeekCalendar[]>([]);
const siteDateTimeNow = ref<Date>(new Date);
const calendarIsLoading = ref<boolean>(false);
const hasPreviousWeek = ref<boolean>(false);
const daysOfTheWeek = ref<DayOfTheWeek[]>([]);

onMounted(() => {
  getClassesOfTheWeek();
});

function goToNextWeek(): void {
  const date = dayjs(appStore().calendarStartDate);

  const firstDayOfNextWeek = date.add(1, 'weeks').startOf('week').toDate();
  const lastDayOfNextWeek = date.add(1, 'weeks').endOf('week').toDate();

  appStore().setCalendarDates(firstDayOfNextWeek, lastDayOfNextWeek);

  getClassesOfTheWeek();
}

function goToPrevWeek(): void {
  const date = dayjs(appStore().calendarStartDate);

  const firstDayOfPrevWeek = date.subtract(1, 'weeks').startOf('week').toDate();
  const lastDayOfPrevWeek = date.subtract(1, 'weeks').endOf('week').toDate();

  const actualDate = new Date();

  if (dayjs(firstDayOfPrevWeek).isBefore(dayjs(actualDate), 'day'))
    return;

  appStore().setCalendarDates(firstDayOfPrevWeek, lastDayOfPrevWeek);

  getClassesOfTheWeek();
}

async function getClassesOfTheWeek(): Promise<void> {
  calendarIsLoading.value = true;
  hasPreviousWeek.value = false;
  daysOfTheWeek.value = [];

  const firstDayWeek = appStore().calendarStartDate;
  const lastDayWeek = appStore().calendarEndDate;

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
    let rowCalendar: WeekCalendar = new WeekCalendar();
    for (let day = 0; day < 7; day++) {
      if (day === 0) {
        if (typeof daysOfTheWeek.value[day] !== "undefined" && typeof daysOfTheWeek.value[day].classes[i] !== "undefined") {
          rowCalendar.MON = daysOfTheWeek.value[day].classes[i];
        }
      } else if (day === 1) {
        if (typeof daysOfTheWeek.value[day] !== "undefined" && typeof daysOfTheWeek.value[day].classes[i] !== "undefined")
          rowCalendar.TUE = daysOfTheWeek.value[day].classes[i];
      } else if (day === 2) {
        if (typeof daysOfTheWeek.value[day] !== "undefined" && typeof daysOfTheWeek.value[day].classes[i] !== "undefined")
          rowCalendar.WED = daysOfTheWeek.value[day].classes[i];
      } else if (day === 3) {
        if (typeof daysOfTheWeek.value[day] !== "undefined" && typeof daysOfTheWeek.value[day].classes[i] !== "undefined")
          rowCalendar.THU = daysOfTheWeek.value[day].classes[i];
      } else if (day === 4) {
        if (typeof daysOfTheWeek.value[day] !== "undefined" && typeof daysOfTheWeek.value[day].classes[i] !== "undefined")
          rowCalendar.FRI = daysOfTheWeek.value[day].classes[i];
      } else if (day === 5) {
        if (typeof daysOfTheWeek.value[day] !== "undefined" && typeof daysOfTheWeek.value[day].classes[i] !== "undefined")
          rowCalendar.SAT = daysOfTheWeek.value[day].classes[i];
      } else if (day === 6) {
        if (typeof daysOfTheWeek.value[day] !== "undefined" && typeof daysOfTheWeek.value[day].classes[i] !== "undefined")
          rowCalendar.SUN = daysOfTheWeek.value[day].classes[i];
      }
    }

    calendarDays.value.push(rowCalendar);
  }
}
</script>

<template>
  <div class="container overflow-hidden">
    <!-- buttons -->
    <div class="row gy-5 p-3">
      <div class="col-6">
        <button @click="goToPrevWeek()">Prev</button>
      </div>
      <div class="col-6" style="text-align: right">
        <button @click="goToNextWeek()">Next</button>
      </div>
    </div>
    <!-- calendar -->
    <div class="row gy-5">
      <div class="col-12">
        <div v-if="calendarIsLoading">Loading....</div>
        <div v-else>
          <div class="row">
            <div class="col" v-for="(colName, key) in columnsNames" :key="key">
              <b> {{ colName }}</b>
            </div>
          </div>
          <div class="row" v-for="(colRow, key) in calendarDays" :key="key">
            <div class="col">
              <CalendarCard :classInfo="colRow.MON" :isEnrolled="false"></CalendarCard>
            </div>
            <div class="col">
              <CalendarCard :classInfo="colRow.TUE" :isEnrolled="false"></CalendarCard>
            </div>
            <div class="col">
              <CalendarCard :classInfo="colRow.WED" :isEnrolled="false"></CalendarCard>
            </div>
            <div class="col">
              <CalendarCard :classInfo="colRow.THU" :isEnrolled="false">></CalendarCard>
            </div>
            <div class="col">
              <CalendarCard :classInfo="colRow.FRI" :isEnrolled="false"></CalendarCard>
            </div>
            <div class="col">
              <CalendarCard :classInfo="colRow.SAT" :isEnrolled="false"></CalendarCard>
            </div>
            <div class="col">
              <CalendarCard :classInfo="colRow.SUN" :isEnrolled="false"></CalendarCard>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- icons -->
    <div class="row  gy-5">
      <div class="col">
        <IconCalendarCard letter="E"></IconCalendarCard>
        Enrolled
      </div>
      <div class="col">
        <IconCalendarCard letter="W"></IconCalendarCard>
        Waitlist
      </div>
      <div class="col">
        <IconCalendarCard letter="S"></IconCalendarCard>
        Substitute
      </div>
    </div>
  </div>


</template>

<style>

</style>