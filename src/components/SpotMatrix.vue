<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import BookableSpotPosition from '@/components/BookableSpotPosition.vue'
import IconPositionNotBookable from '@/components/icons/IconPositionNotBookable.vue'
import AdminBookableSpotPosition from '@/components/AdminBookableSpotPosition.vue'

interface SpotPosition {
  x: number
  y: number
  positionType: string
  positionIcon: string
  spotInfo?: SpotInfo
  user?: User | null
  enabled?: boolean
}

interface ClassPositionInterface {
  __typename?: string
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
  enabled: boolean
}

interface IconPosition extends ClassPositionInterface {}

interface EnrollmentInfo {
  user: User
  enrollmentDateTime: Date
  enrollmentStatus: EnrollmentStatusEnum
  id: string
  spotInfo?: SpotInfo
}

enum EnrollmentStatusEnum {
  Active = 'active',
  Cancelled = 'cancelled',
  LateCancelled = 'lateCancelled',
  Unknown = 'unknown',
  Waitlisted = 'waitlisted'
}

interface Props {
  matrix?: Array<BookableSpot | IconPosition>
  showUserInSpots?: boolean
  selectedSpotNumber?: number | null
  enrollments?: EnrollmentInfo[]
}

const BOOKABLE_SPOT_KEY = 'BookableSpot'
const ICON_POSITION_KEY = 'IconPosition'

const props = withDefaults(defineProps<Props>(), {
  showUserInSpots: false
})

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

function newSpotPosition(
  classPosition: BookableSpot | IconPosition,
  user: User | null | undefined
): SpotPosition {
  if ('spotInfo' in classPosition) {
    return {
      x: classPosition.x,
      y: classPosition.y,
      positionType: BOOKABLE_SPOT_KEY,
      positionIcon: classPosition.icon,
      spotInfo: classPosition.spotInfo,
      user: user,
      enabled: classPosition.enabled
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
  let classPosition: ClassPositionInterface
  let user: User | null | undefined

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      classPosition = matrix[j]
      if (matrix[j].y === i) {
        if (rows[classPosition.y] === undefined) {
          rows.push([])
        }

        user = null
        if ('spotInfo' in classPosition) {
          let spotInfo = classPosition.spotInfo as SpotInfo
          if (spotInfo.spotNumber && props.enrollments) {
            for (let index = 0; index < props.enrollments.length; index++) {
              const enrollment = props.enrollments[index]
              if (enrollment.spotInfo?.spotNumber === spotInfo.spotNumber) {
                user = enrollment.user
                break
              }
            }
          }
        }

        rows[i].push(newSpotPosition(classPosition, user))
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

function isSpotForAdmin(spot: SpotPosition): boolean {
  return (
    props.showUserInSpots &&
    spot.spotInfo !== undefined &&
    spot.user !== undefined &&
    spot.positionType === BOOKABLE_SPOT_KEY
  )
}

function onClickSpotAdmin(spotNumber: number) {
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
          <td class="class-position" v-for="(spot, columnKey) in colRow" :key="columnKey">
            <admin-bookable-spot-position
              v-if="isSpotForAdmin(spot)"
              :spot-info="spot.spotInfo!"
              :user="spot.user!"
              :enabled="spot.enabled!"
              @click-spot="onClickSpotAdmin"
              :selected="props.selectedSpotNumber === spot?.spotInfo?.spotNumber"
            />
            <bookable-spot-position
              v-else-if="!showUserInSpots && spot.positionType === BOOKABLE_SPOT_KEY"
              :spotInfo="spot.spotInfo"
              @click-spot="onClickSpotBtn"
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

<style scoped>
td.class-position {
  padding: 5px;
}
</style>
