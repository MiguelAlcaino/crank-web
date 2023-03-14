<script setup lang="ts">

import {onMounted, ref} from "vue";
import BookableSpotPosition from "@/components/BookableSpotPosition.vue"
import IconPositionNotBookable from "@/components/icons/IconPositionNotBookable.vue"
import AdminBookableSpotPosition from "@/components/AdminBookableSpotPosition.vue";

interface SpotPosition {
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

interface Props{
  matrix?: Array<ClassPositionInterface>,
  showUserInSpots: boolean
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
  getSpotTable();
});

function newSpotPosition(classPosition: BookableSpot | IconPosition): SpotPosition {
  if ('spotInfo' in classPosition) {
    if ('user' in classPosition) {
      return {
        positionType: BOOKABLE_SPOT_KEY,
        positionIcon: classPosition.icon,
        spotInfo: classPosition.spotInfo,
        user: classPosition.user
      }
    }
    return {
      positionType: BOOKABLE_SPOT_KEY,
      positionIcon: classPosition.icon,
      spotInfo: classPosition.spotInfo
    }
  }
  return {
    positionType: ICON_POSITION_KEY,
    positionIcon: classPosition.icon,
  }
}

function getSpotTable() {
  let x = 0;

  let spotsTableRow: Array<SpotPosition> = [];

  if (props.matrix) {
    for (let i = 0; i < props.matrix.length; i++) {

      let typename: string | undefined = props.matrix[i]["__typename"];

      if (typename === BOOKABLE_SPOT_KEY) {
        let classPosition = props.matrix[i] as BookableSpot;

        if (x == classPosition.x) {
          spotsTableRow.push(newSpotPosition(classPosition))
        } else {
          spotsTable.value.push(spotsTableRow);

          spotsTableRow = [];
          x = classPosition.x;

          spotsTableRow.push(newSpotPosition(classPosition));
        }
      }
      if (typename === ICON_POSITION_KEY) {
        let classPosition = props.matrix[i] as IconPosition;

        if (x == classPosition.x) {
          spotsTableRow.push(newSpotPosition(classPosition));
        } else {
          spotsTable.value.push(spotsTableRow);

          spotsTableRow = [];
          x = classPosition.x;

          spotsTableRow.push(newSpotPosition(classPosition));
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
          <admin-bookable-spot-position v-if="showUserInSpots && spot.user !== undefined && spot.positionType === BOOKABLE_SPOT_KEY"
                                        spot-info=""/>
          <bookable-spot-position v-else-if="!showUserInSpots && spot.positionType === BOOKABLE_SPOT_KEY"
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

<style scoped></style>
