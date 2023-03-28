<script setup lang="ts">

import {onMounted, ref} from "vue";
import BookableSpotPosition from "@/components/BookableSpotPosition.vue"
import IconPositionNotBookable from "@/components/icons/IconPositionNotBookable.vue"

interface SpotPosition {
  x: number
  y: number
  positionType: string
  positionIcon: string
  spotInfo?: SpotInfo
  user?: User
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

interface User {
  firstName: string
  lastName: string
}

interface BookableSpot extends ClassPositionInterface {
  spotInfo: SpotInfo
  user?: User
}

interface IconPosition extends ClassPositionInterface {
}

interface Props {
  matrix?: Array<ClassPositionInterface>,
  showUserInSpots?: boolean
}

const BOOKABLE_SPOT_KEY = 'BookableSpot';
const ICON_POSITION_KEY = 'IconPosition';

const props = withDefaults(defineProps<Props>(), {
  showUserInSpots: false
});

const emits = defineEmits<{
  (e: 'clickSpot', event: BookableSpotClickedEvent): void
}>();

const spotsTable = ref<Array<Array<SpotPosition>>>([]);

onMounted(() => {
  if (props.matrix) {
    spotsTable.value = getMatrixOfSpotPositions(props.matrix);
  }
});

function newSpotPosition(classPosition: BookableSpot | IconPosition): SpotPosition {
  if ('spotInfo' in classPosition) {
    if ('user' in classPosition) {
      return {
        x: classPosition.x,
        y: classPosition.y,
        positionType: BOOKABLE_SPOT_KEY,
        positionIcon: classPosition.icon,
        spotInfo: classPosition.spotInfo,
        user: classPosition.user
      }
    }
    return {
      x: classPosition.x,
      y: classPosition.y,
      positionType: BOOKABLE_SPOT_KEY,
      positionIcon: classPosition.icon,
      spotInfo: classPosition.spotInfo
    }
  }
  return {
    x: classPosition.x,
    y: classPosition.y,
    positionType: ICON_POSITION_KEY,
    positionIcon: classPosition.icon,
  }
}

function getMatrixOfSpotPositions(matrix: Array<BookableSpot | IconPosition>): SpotPosition[][] {
  let rows: Array<Array<SpotPosition>> = [];
  let classPosition: ClassPositionInterface;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      classPosition = matrix[j];
      if (matrix[j].y === i) {
        if (rows[classPosition.y] === undefined) {
          rows.push([]);
        }
        rows[i].push(newSpotPosition(classPosition));
      }
    }
  }

  let sortedRows: Array<Array<SpotPosition>> = [];
  for (let i = 0; i < rows.length; i++) {
    sortedRows.push(rows[i].sort((n1: SpotPosition, n2: SpotPosition) => {
      if (n1.x > n2.x) {
        return 1;
      }

      if (n1.x < n2.x) {
        return -1;
      }

      return 0;
    }))
  }

  return sortedRows;
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
      <tr v-for="(colRow, rowKey) in spotsTable" :key="rowKey">
        <td v-for="(spot, columnKey) in colRow" :key="columnKey">
          <bookable-spot-position v-if="spot.positionType === BOOKABLE_SPOT_KEY"
                                  :spotInfo="spot.spotInfo"
                                  @click-spot="onClickSpotBtn"/>
          <icon-position-not-bookable v-else-if="spot.positionType === ICON_POSITION_KEY"
                                      :iconName="spot.positionIcon"/>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
</style>
