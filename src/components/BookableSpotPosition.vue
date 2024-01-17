<script setup lang="ts">
const props = defineProps<{
  isBookedByCurrentUser?: boolean | null
  spotNumber: number
  isUsed: boolean
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
      {{ spotNumber }}
    </div>
    <div v-else class="enabledSpot" @click="selectSpot()">{{ spotNumber }}</div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

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
  font-family: 'Avenir', sans-serif;
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
  font-family: 'Avenir', sans-serif;
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
  font-family: 'Avenir', sans-serif;
}

.enabledSpot:hover {
  background-color: black;
  color: white;
  font-family: 'Avenir', sans-serif;
}
</style>
