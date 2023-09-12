<script lang="ts">
interface ClassInfo {
  id: string
  name: string
  description: string
  instructorName: string
  isSubstitute: boolean
  duration: number
  waitListAvailable: boolean
  startWithNoTimeZone: Date
}
</script>

<script setup lang="ts">
import dayjs from 'dayjs'
import IconCalendarCard from '@/components/icons/IconCalendarCard.vue'
import router from '@/router'

const props = defineProps<{
  classInfo?: ClassInfo
  isEnrolled?: boolean
  disabled?: boolean
}>()

async function selectClass() {
  if (props.disabled) return

  await router.push('/class/' + props.classInfo!.id)
}
</script>

<template>
  <div
    v-if="classInfo !== undefined"
    :class="[disabled ? 'disabledCard' : 'classCard']"
    class="p-1"
    v-on:click="selectClass()"
  >
    <Popper :hover="true" :arrow="true" class="light-popover">
      <div class="row">
        <div class="col-8">
          <b class="className">{{ classInfo?.name }}</b>
        </div>
        <div class="col-4 colIcon"></div>
      </div>
      <template #content>
        <div class="popover-header">
          <b class="className">{{ classInfo?.name }}</b>
        </div>
        <div v-html="classInfo?.description" class="popover-body"></div>
      </template>
    </Popper>
    <div class="row">
      <div class="col-8">{{ classInfo?.instructorName }}</div>
      <div class="col-4 colIcon">
        <IconCalendarCard v-if="classInfo?.isSubstitute" letter="S"></IconCalendarCard>
      </div>
    </div>
    <div class="row">
      <div class="col-8">{{ dayjs(classInfo?.startWithNoTimeZone).format('h:mm a') }}</div>
      <div class="col-4 colIcon">
        <IconCalendarCard v-if="isEnrolled" letter="E"></IconCalendarCard>
      </div>
    </div>
    <div class="row">
      <div class="col-8">{{ classInfo?.duration + ' mins.' }}</div>
      <div class="col-4 colIcon">
        <IconCalendarCard v-if="classInfo?.waitListAvailable" letter="W"></IconCalendarCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.disabledCard {
  background-color: #f5f5f5 !important;
  cursor: not-allowed;
}
.classCard {
  cursor: pointer;
  min-height: 100px;
}

.classCard:hover {
  background-color: #dadada !important;
  cursor: pointer;
}

.colIcon {
  text-align: right;
}

.className {
  text-transform: uppercase;
}

.light-popover {
  --popper-theme-background-color: #ffffff;
  --popper-theme-background-color-hover: #ffffff;
  --popper-theme-text-color: #333333;
  --popper-theme-border-width: 1px;
  --popper-theme-border-style: solid;
  --popper-theme-border-color: #eeeeee;
  --popper-theme-border-radius: 6px;
  --popper-theme-padding: 0px;
  --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0);
}

.popover-header {
  background-color: #eeeeee;
  padding: 8px;
}

.popover-body {
  max-width: 240px !important;
  padding: 10px;
}
</style>
