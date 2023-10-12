<script lang="ts">
interface User {
  firstName: string
  lastName: string
}

interface BookableSpot {
  spotNumber: number
  isBooked: boolean
}

enum SpotActionEnum {
  none,
  asignUserToSpot,
  changeMemberSpot,
  swapSpot
}
</script>

<script setup lang="ts">
const props = defineProps<{
  spotInfo: BookableSpot
  user: User | null
  enabled: boolean
  selected: boolean
  isCheckedIn?: boolean
  spotAction?: SpotActionEnum
}>()

const emits = defineEmits<{
  (e: 'clickSpot', spotNumber: number): void
}>()

function selectSpot() {
  emits('clickSpot', props.spotInfo.spotNumber)
}
</script>

<template>
  <div v-if="spotAction === SpotActionEnum.changeMemberSpot">
    <div
      v-if="spotInfo?.isBooked"
      :class="['changeMemberSpot-bookedSpot', selected ? 'selectedSpot' : '']"
    >
      {{ spotInfo.spotNumber + (isCheckedIn === true ? '✓' : '') }}
      <br />
      {{ user?.firstName }} {{ user?.lastName }}
    </div>
    <div v-else-if="enabled" :class="['changeMemberSpot-spotAvailable']" @click="selectSpot()">
      {{ spotInfo.spotNumber }}
    </div>
    <div v-else :class="['changeMemberSpot-disabledSpot']">
      {{ spotInfo.spotNumber }}
    </div>
  </div>
  <div v-else>
    <div
      v-if="spotInfo?.isBooked"
      @click="selectSpot()"
      :class="['enabledSpot', selected ? 'selectedSpot' : '']"
    >
      {{ spotInfo.spotNumber + (isCheckedIn === true ? '✓' : '') }}
      <br />
      {{ user?.firstName }} {{ user?.lastName }}
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

.changeMemberSpot-spotAvailable {
  background: #ffebcd;
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

.changeMemberSpot-disabledSpot {
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
}

.changeMemberSpot-bookedSpot {
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
}
</style>
