<script setup lang="ts">
import { useVfm } from 'vue-final-modal';
import type { SpotInfo } from "@/gql/graphql";
import { ModalsContainer, useModal } from 'vue-final-modal'

import ModalConfirm from './ModalConfirm.vue';

const { open, close } = useModal({
  component: ModalConfirm,
  attrs: {
    title: 'BOOK THIS CLASS',
    onConfirm() {
      console.log("onConfirm")
      close();
    },
    onCancel() {
      console.log("onCancel")
      close();
    }
  },
  slots: {
    default: '<p>WOULD YOU LIKE TO BOOK THIS CLASS?</p>',
  },
})


const props = defineProps<{
  spotInfo?: SpotInfo | null
}>();

function selectSpot(spotNumber?: number) {
  console.log(spotNumber);
  open();
}
</script>

<template>
  <div>
    <div v-if="spotInfo?.isBooked" class="disabledSpot">{{ spotInfo.spotNumber }}</div>
    <div v-else class="enabledSpot" @click="selectSpot(spotInfo?.spotNumber)">{{ spotInfo?.spotNumber }}</div>
  </div>
</template>

<style scoped>
.disabledSpot {
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
</style>
