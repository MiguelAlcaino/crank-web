<script setup lang="ts">

import {onMounted, ref} from "vue";
import {SpotPosition} from "@/model/SpotPosition";
import BookableSpotPosition from "@/components/BookableSpotPosition.vue"
import IconPositionNotBookable from "@/components/icons/IconPositionNotBookable.vue"

interface ClassPositionInterface {
  __typename: string
  x: number
  y: number
  icon: string
}

interface BookableSpotClickedEvent {
  spotNumber: number | null
  isBooked: boolean
}

interface SpotInfo {
  isBooked: boolean
  spotNumber: number
}

interface BookableSpot extends ClassPositionInterface {
  spotInfo: SpotInfo
}

interface IconPosition extends ClassPositionInterface {
}

const bookableSpotKey = 'BookableSpot';
const iconPositionKey = 'IconPosition';

const props = defineProps<{
  matrix: Array<ClassPositionInterface> | undefined
}>();

const emits = defineEmits<{
  (e: 'clickSpot', event: BookableSpotClickedEvent): void
}>();

const spotsTable = ref<Array<Array<SpotPosition>>>([]);

onMounted(() => {
  getSpotTable();
});

function getSpotTable() {
  let x = 0;

  let spotsTableRow: Array<SpotPosition> = [];

  if (props.matrix) {
    for (let i = 0; i < props.matrix.length; i++) {

      let typename: string | undefined = props.matrix[i]["__typename"];

      if (typename === bookableSpotKey) {
        let classPosition = props.matrix[i] as BookableSpot;

        if (x == classPosition.x) {
          spotsTableRow.push(new SpotPosition(bookableSpotKey, classPosition.icon, classPosition.spotInfo));
        } else {
          spotsTable.value.push(spotsTableRow);

          spotsTableRow = [];
          x = classPosition.x;

          spotsTableRow.push(new SpotPosition(bookableSpotKey, classPosition.icon, classPosition.spotInfo));
        }
      }
      if (typename === iconPositionKey) {
        let classPosition = props.matrix[i] as IconPosition;

        if (x == classPosition.x) {
          spotsTableRow.push(new SpotPosition(iconPositionKey, classPosition.icon));
        } else {
          spotsTable.value.push(spotsTableRow);

          spotsTableRow = [];
          x = classPosition.x;

          spotsTableRow.push(new SpotPosition(iconPositionKey, classPosition.icon));
        }
      }
    }
  }

  spotsTable.value.push(spotsTableRow);
}

function onClickSpotBtn(spotNumber: number) {
  emits('clickSpot', {
    spotNumber: spotNumber
  } as BookableSpotClickedEvent)
}

</script>

<template>
  <div>
    <table class="table table-borderless">
      <tbody>
      <tr v-for="(colRow, key) in spotsTable" :key="key">
        <td v-for="(spot, key) in colRow" :key="key">
          <BookableSpotPosition v-if="spot.positionType === bookableSpotKey"
                                :spotInfo="spot.spotInfo"
                                @click-spot="onClickSpotBtn">
          </BookableSpotPosition>

          <IconPositionNotBookable v-else-if="spot.positionType === iconPositionKey" :iconName="spot.positionIcon">
          </IconPositionNotBookable>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
