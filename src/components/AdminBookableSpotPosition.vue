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
  user: User
}>()

const emits = defineEmits<{
  (e: 'clickSpot', spotNumber: BookableSpot): void
}>()

function selectSpot() {
  emits('clickSpot', props.spotInfo)
}
</script>

<template>
  <div v-if="spotInfo?.isBooked" class="disabledSpot">
    {{ spotInfo.spotNumber }}<br />
    {{ user.firstName }}
  </div>
  <div v-else class="enabledSpot" @click="selectSpot()">{{ spotInfo.spotNumber }}</div>
</template>

<style scoped>
.disabledSpot {
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

.enabledSpot {
  display: flex;
  height: 40px;
  width: 40px;
  margin: 0 auto;
  background-color: #fff;
  text-align: center;
  border-radius: 50%;
  border: 1px #000000 solid;
  color: #000;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  font-weight: 400;
  font-size: 14px;
}
</style>
