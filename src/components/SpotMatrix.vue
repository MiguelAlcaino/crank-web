<script setup lang="ts">

import { onMounted, ref } from "vue";
import BookableSpotPosition from "@/components/BookableSpotPosition.vue"
import IconPositionNotBookable from "@/components/icons/IconPositionNotBookable.vue"

interface SpotPosition {
  positionType: string
  positionIcon: string
  spotInfo?: SpotInfo
}

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

const BOOKABLE_SPOT_KEY = 'BookableSpot';
const ICON_POSITION_KEY = 'IconPosition';

const props = defineProps<{
  matrix?: Array<ClassPositionInterface> | undefined
}>();

const emits = defineEmits<{
  (e: 'clickSpot', event: BookableSpotClickedEvent): void
}>();

const spotsTable = ref<Array<Array<SpotPosition>>>([]);

onMounted(() => {
  getSpotTable();
});

function newSpotPosition(positionType: string, positionIcon: string, spotInfo?: SpotInfo): SpotPosition {
  return { positionType: positionType, positionIcon: positionIcon, spotInfo: spotInfo }
}

function getSpotTable() {
  let y = 0;

  let spotsTableRow: Array<SpotPosition> = [];

  if (props.matrix) {
    for (let i = 0; i < props.matrix.length; i++) {

      let typename: string | undefined = props.matrix[i]["__typename"];

      if (typename === BOOKABLE_SPOT_KEY) {
        let classPosition = props.matrix[i] as BookableSpot;

        if (y == classPosition.y) {
          spotsTableRow.push(newSpotPosition(BOOKABLE_SPOT_KEY, classPosition.icon, classPosition.spotInfo))
        } else {
          spotsTable.value.push(spotsTableRow);

          spotsTableRow = [];
          y = classPosition.y;

          spotsTableRow.push(newSpotPosition(BOOKABLE_SPOT_KEY, classPosition.icon, classPosition.spotInfo));
        }
      }
      if (typename === ICON_POSITION_KEY) {
        let classPosition = props.matrix[i] as IconPosition;

        if (y == classPosition.y) {
          spotsTableRow.push(newSpotPosition(ICON_POSITION_KEY, classPosition.icon));
        } else {
          spotsTable.value.push(spotsTableRow);

          spotsTableRow = [];
          y = classPosition.y;

          spotsTableRow.push(newSpotPosition(ICON_POSITION_KEY, classPosition.icon));
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
    <table>
      <tbody>
        <tr v-for="(colRow, key) in spotsTable" :key="key">
          <td v-for="(spot, key) in colRow" :key="key">
            <BookableSpotPosition v-if="spot.positionType === BOOKABLE_SPOT_KEY" :spotInfo="spot.spotInfo"
              @click-spot="onClickSpotBtn">
            </BookableSpotPosition>

            <IconPositionNotBookable v-else-if="spot.positionType === ICON_POSITION_KEY" :iconName="spot.positionIcon">
            </IconPositionNotBookable>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
td {
  text-align: center;
}
</style>
