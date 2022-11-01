<script setup lang="ts">
import {type Class,} from "@/gql/graphql";
import dayjs from 'dayjs'
import IconCalendarCard from "@/components/icons/IconCalendarCard.vue";
import router from "@/router";

const props = defineProps<{
  classInfo?: Class,
  isEnrolled?: boolean,
}>();
const emits = defineEmits<{}>();

async function selectClass() {
  await router.push('/class/' + props.classInfo!.id);
}

</script>

<template>
  <div v-if="classInfo !== undefined" class="border mt-1 classCard" v-on:click="selectClass()">
    <div class="row">
      <div class="col-8"><b>{{ classInfo?.name }}</b></div>
      <div class="col-4 colIcon"></div>
    </div>
    <div class="row">
      <div class="col-8"> {{ classInfo?.instructorName }}</div>
      <div class="col-4 colIcon">
        <IconCalendarCard v-if="classInfo.isSubstitute" letter="S"></IconCalendarCard>
      </div>
    </div>
    <div class="row">
      <div class="col-8">{{ dayjs(classInfo?.startWithNoTimeZone).format("h:mm a") }}</div>
      <div class="col-4 colIcon">
        <IconCalendarCard v-if="isEnrolled" letter="E"></IconCalendarCard>
      </div>
    </div>
    <div class="row">
      <div class="col-8">{{ classInfo?.duration + ' .mins' }}</div>
      <div class="col-4 colIcon">
        <IconCalendarCard v-if="classInfo.waitListAvailable" letter="W"></IconCalendarCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.classCard {
  cursor: pointer;
  min-height: 100px;
}

.colIcon {
  text-align: right;
}
</style>
