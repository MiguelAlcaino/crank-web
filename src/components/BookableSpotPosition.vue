<script setup lang="ts">
interface BookableSpot {
  spotNumber: number
  isBooked: boolean
}

const props = defineProps<{
  spotInfo?: BookableSpot | null
  isBookedByCurrentUser?: boolean | null
}>()

const emits = defineEmits<{
  (e: 'clickSpot', spotNumber: number): void
}>()

function selectSpot() {
  emits('clickSpot', props.spotInfo!.spotNumber)
}
</script>

<template>
  <div>
    <div
      v-if="spotInfo?.isBooked"
      :class="isBookedByCurrentUser ? 'bookedSpotByCurrentUser' : 'bookedSpot'"
    >
      {{ spotInfo.spotNumber }}
    </div>
    <div v-else class="enabledSpot" @click="selectSpot()">{{ spotInfo?.spotNumber }}</div>
  </div>
</template>

<style scoped>
.bookedSpot {
  background: #888;
  height: 40px;
  width: 40px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  border: 1px #888 solid;
  font-weight: 400;
  border-radius: 50%;
  font-size: 14px;
}

.bookedSpotByCurrentUser {
  background: #ff7f61;
  height: 40px;
  width: 40px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  border: 1px #ff7f61 solid;
  font-weight: 400;
  border-radius: 50%;
  font-size: 14px;
}

.enabledSpot {
  display: flex;
  height: 40px;
  width: 40px;
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
}

.enabledSpot:hover {
  background-color: black;
  color: white;
}
</style>
