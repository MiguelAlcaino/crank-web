<script setup lang="ts">
import {type Class,} from "@/gql/graphql";
import {onMounted, ref} from "vue";
import dayjs from 'dayjs'
import IconCalendarCard from "@/components/icons/IconCalendarCard.vue";

defineProps<{ classInfo?: Class, }>();
const emits = defineEmits<{}>();

onMounted(() => {
});

</script>

<template>
  <div v-if="classInfo !== undefined" class="border mt-1 classCard">
    <div class="row">
      <div class="col-9"><b>{{ classInfo?.name }}</b></div>
      <div class="col-3 colIcon"></div>
    </div>
    <div class="row">
      <div class="col-9"> {{ classInfo?.instructorName }}</div>
      <div class="col-3 colIcon">
        <IconCalendarCard v-if="classInfo.isSubstitute" letter="S"></IconCalendarCard>
      </div>
    </div>
    <div class="row">
      <div class="col-9">{{ dayjs(classInfo?.startWithNoTimeZone).format("h:mm a") }}</div>
      <div class="col-3 colIcon">
        <IconCalendarCard v-if="false" letter="E"></IconCalendarCard>
      </div>
    </div>
    <div class="row">
      <div class="col-9">{{ classInfo?.duration + ' .mins' }}</div>
      <div class="col-3 colIcon">
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
