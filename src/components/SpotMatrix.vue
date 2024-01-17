<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import BookableSpotPosition from '@/components/BookableSpotPosition.vue'
import IconPositionNotBookable from '@/components/icons/IconPositionNotBookable.vue'

interface SpotPosition {
  x: number
  y: number
  positionType: string
  positionIcon: string
  spotNumber?: number
}

interface BookableSpotClickedEvent {
  spotNumber: number | null
}

interface BookableSpot {
  x: number
  y: number
  icon: string
  spotNumber: number
}

interface IconPosition  {
  x: number
  y: number
  icon: string
}

interface ClassPosition {
  x: number
  y: number
  icon: string
  spotNumber?: number
}

const BOOKABLE_SPOT_KEY = 'BookableSpot'
const ICON_POSITION_KEY = 'IconPosition'

const props = defineProps<{
  matrix?: Array<BookableSpot | IconPosition>
  selectedSpotNumber?: number | null
  spotNumberBookedByCurrentUser?: number | null
  usedSpots: number[]
}>()

const emits = defineEmits<{
  (e: 'clickSpot', event: BookableSpotClickedEvent): void
}>()

const spotsTable = ref<Array<Array<SpotPosition>>>([])

onMounted(() => {
  if (props.matrix) {
    spotsTable.value = getMatrixOfSpotPositions(props.matrix)
  }
})

watch(
  () => props.matrix,
  (matrix) => {
    spotsTable.value = getMatrixOfSpotPositions(matrix!)
  }
)

function newSpotPosition(classPosition: ClassPosition): SpotPosition {
  if (classPosition.icon === 'spot') {
   const bookableSpot = classPosition as BookableSpot
    return {
      x: bookableSpot.x,
      y: bookableSpot.y,
      positionType: BOOKABLE_SPOT_KEY,
      positionIcon: bookableSpot.icon,
      spotNumber: bookableSpot.spotNumber,   
    }
  }
  return {
    x: classPosition.x,
    y: classPosition.y,
    positionType: ICON_POSITION_KEY,
    positionIcon: classPosition.icon
  }
}

function getMatrixOfSpotPositions(matrix: Array<BookableSpot | IconPosition>): SpotPosition[][] {
  let rows: Array<Array<SpotPosition>> = []
  let classPosition: BookableSpot | IconPosition

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      classPosition = matrix[j]
      if (matrix[j].y === i) {
        if (rows[classPosition.y] === undefined) {
          rows.push([])
        }

        rows[i].push(newSpotPosition(classPosition))
      }
    }
  }

  let sortedRows: Array<Array<SpotPosition>> = []
  for (let i = 0; i < rows.length; i++) {
    sortedRows.push(
      rows[i].sort((n1: SpotPosition, n2: SpotPosition) => {
        if (n1.x > n2.x) {
          return 1
        }

        if (n1.x < n2.x) {
          return -1
        }

        return 0
      })
    )
  }

  return sortedRows
}

function onClickSpotBtn(spotNumber: number) {
  emits('clickSpot', {
    spotNumber: spotNumber
  } as BookableSpotClickedEvent)
}
</script>

<template>
  <div>
    <table class="table table-sm table-borderless" style="margin: 0 auto; margin-bottom: 35px">
      <tbody>
        <tr v-for="(colRow, rowKey) in spotsTable" :key="rowKey" class="text-center">
          <td class="class-position" v-for="(spot, columnKey) in colRow" :key="columnKey">
            <bookable-spot-position
              v-if="spot.positionType === BOOKABLE_SPOT_KEY"
              :spotNumber="spot.spotNumber!"
              :is-used="usedSpots.some(x=> x === spot.spotNumber)"
              @click-spot="onClickSpotBtn"
              :is-booked-by-current-user="
                props.spotNumberBookedByCurrentUser === spot.spotNumber
              "
            />
            <icon-position-not-bookable
              v-else-if="spot.positionType === ICON_POSITION_KEY"
              :iconName="spot.positionIcon"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped>
td.class-position {
  padding: 5px;
}
.table {
  width: 15%;
}
</style>
