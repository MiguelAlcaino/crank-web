<script setup lang="ts">
interface User {
  firstName: string
  lastName: string
}

interface BookableSpot {
  spotNumber: number
  isBooked: boolean
}

const props = defineProps<{
  spotInfo: BookableSpot
  user: User | null
  enabled: boolean
  selected: boolean
}>()

const emits = defineEmits<{
  (e: 'clickSpot', spotNumber: number): void
}>()

function selectSpot() {
  emits('clickSpot', props.spotInfo.spotNumber)
}
</script>

<template>
  <div v-if="spotInfo?.isBooked" @click="selectSpot()" :class="['enabledSpot']">
    {{ spotInfo.spotNumber }}<br />
    {{ user?.firstName }}
  </div>
  <div
    v-else-if="enabled"
    :class="['enabledSpot', selected ? 'selectedSpot' : '']"
    @click="selectSpot()"
  >
    {{ spotInfo.spotNumber }}
  </div>
  <div v-else :class="['disabledSpot', selected ? 'selectedSpot' : '']" @click="selectSpot()">
    {{ spotInfo.spotNumber }}
  </div>
</template>

<style scoped>
.disabledSpot {
  background: #f37676;
  height: 60px;
  width: 60px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  border: 2px #000000 solid;
  font-weight: 400;
  font-size: 9px;
  cursor: pointer;
}

.enabledSpot {
  background: #ffffff;
  height: 60px;
  width: 60px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  border: 2px #000000 solid;
  font-weight: 400;
  font-size: 9px;
  cursor: pointer;
}

.selectedSpot {
  border: 2px dashed !important;
}
</style>
