<script lang="ts">
interface BookableSpotClickedEvent {
  spotNumber: number | null
}

interface ClassPosition {
  x: number
  y: number
  icon: PositionIconEnum
  spotNumber?: number
}

enum PositionIconEnum {
  Empty = 'empty',
  Fan = 'fan',
  Instructor = 'instructor',
  Speaker = 'speaker',
  Spot = 'spot',
  Tv = 'tv'
}
</script>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import BookableSpotPosition from '@/components/BookableSpotPosition.vue'
import IconPositionNotBookable from '@/components/icons/IconPositionNotBookable.vue'

const props = defineProps<{
  matrix?: ClassPosition[]
  selectedSpotNumber?: number | null
  spotNumberBookedByCurrentUser?: number | null
  usedSpots?: number[] | null
}>()

const emits = defineEmits<{
  (e: 'clickSpot', event: BookableSpotClickedEvent): void
}>()

const spotsTable = ref<Array<Array<ClassPosition>>>([])

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

function getMatrixOfSpotPositions(matrix: Array<ClassPosition>): ClassPosition[][] {
  let rows: Array<Array<ClassPosition>> = []
  let classPosition: ClassPosition

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      classPosition = matrix[j]
      if (matrix[j].y === i) {
        if (rows[classPosition.y] === undefined) {
          rows.push([])
        }

        rows[i].push(classPosition)
      }
    }
  }

  let sortedRows: Array<Array<ClassPosition>> = []
  for (let i = 0; i < rows.length; i++) {
    sortedRows.push(
      rows[i].sort((n1: ClassPosition, n2: ClassPosition) => {
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
              v-if="spot.icon === PositionIconEnum.Spot"
              :spotNumber="spot.spotNumber!"
              :is-used="usedSpots?.some((x) => x === spot.spotNumber) ?? false"
              @click-spot="onClickSpotBtn"
              :is-booked-by-current-user="props.spotNumberBookedByCurrentUser === spot.spotNumber"
            />
            <icon-position-not-bookable v-else :icon="spot.icon" />
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
