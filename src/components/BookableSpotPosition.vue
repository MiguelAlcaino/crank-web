<script setup lang="ts">
import { PositionIconEnum } from '@/modules/shared/interfaces/position-icon.enum'

const props = defineProps<{
  isBookedByCurrentUser?: boolean | null
  spotNumber: number
  isUsed: boolean
  icon: PositionIconEnum
  showIcon: boolean
}>()

const emits = defineEmits<{
  (e: 'clickSpot', spotNumber: number): void
}>()

function selectSpot() {
  emits('clickSpot', props.spotNumber)
}
</script>

<template>
  <div>
    <div v-if="isUsed" :class="isBookedByCurrentUser ? 'bookedSpotByCurrentUser' : 'bookedSpot'">
      <div class="spot-container">
        <span>{{ spotNumber }}</span>
        <img
          v-if="showIcon && icon === PositionIconEnum.BenchSpot"
          src="../assets/icons/bench_icon.png"
          alt=""
          height="18"
        />
        <i
          v-if="showIcon && icon === PositionIconEnum.BikeSpot"
          class="bi bi-bicycle"
          style="font-size: 1.5rem"
        ></i>
      </div>
    </div>
    <div v-else class="enabledSpot" @click="selectSpot()">
      <div class="spot-container">
        <span>{{ spotNumber }}</span>
        <img
          v-if="showIcon && icon === PositionIconEnum.BenchSpot"
          src="../assets/icons/bench_icon.png"
          alt=""
          height="18"
        />
        <i
          v-if="showIcon && icon === PositionIconEnum.BikeSpot"
          class="bi bi-bicycle"
          style="font-size: 1.5rem"
        ></i>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped>
.bookedSpot {
  background: #888;
  height: 50px;
  width: 50px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  border: 1px #888 solid;
  font-weight: 400;
  border-radius: 50%;
  font-size: 14px;
  font-family: 'Avenir', sans-serif;
}

.bookedSpotByCurrentUser {
  background: #ff7f61;
  height: 50px;
  width: 50px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  border: 1px #ff7f61 solid;
  font-weight: 400;
  border-radius: 50%;
  font-size: 14px;
  font-family: 'Avenir', sans-serif;
}

.enabledSpot {
  display: flex;
  height: 50px;
  width: 50px;
  margin: 0 auto;
  background-color: #fff;
  text-align: center;
  border-radius: 50%;
  border: 1px #333 solid;
  color: #000;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  font-weight: 400;
  font-size: 14px;
  font-family: 'Avenir', sans-serif;
}

.enabledSpot:hover {
  background-color: #444444;
  color: white;
  font-family: 'Avenir', sans-serif;
}

.spot-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
