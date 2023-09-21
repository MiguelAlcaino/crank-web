<script lang="ts">
interface LayoutPosition {
  selected: boolean
  type: 'empty' | 'seat' | 'tv' | 'speaker' | 'fan' | 'instructor'
  spotNumber?: number | null
}

interface LayoutSize {
  rows: number
  cols: number
}
</script>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { type MenuOptions, ContextMenu, ContextMenuItem } from '@imengyu/vue3-context-menu'

import DefaultButtonComponent from '@/components/DefaultButtonComponent.vue'

onMounted(() => {
  fillLayout(layoutSize.rows, layoutSize.cols)
})

const layoutSize = reactive<LayoutSize>({ rows: 5, cols: 5 })

watch(layoutSize, (newLayoutSize, _) => {
  fillLayout(newLayoutSize.rows, newLayoutSize.cols)
})

const roomLayout = ref<Array<Array<LayoutPosition>>>([])
const optionsComponent = ref<MenuOptions>({
  iconFontClass: 'iconfont',
  customClass: 'class-a',
  zIndex: 3,
  minWidth: 230,
  x: 500,
  y: 200
})
const showMenu = ref(false)

const totalConfiguredSeats = ref(0)

function fillLayout(rows: number, cols: number) {
  const tempLayout: LayoutPosition[][] = new Array(rows)

  for (let i = 0; i < rows; i++) {
    tempLayout[i] = new Array<LayoutPosition>(cols)
  }

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    for (let colIndex = 0; colIndex < cols; colIndex++) {
      if (roomLayout.value[rowIndex] && roomLayout.value[rowIndex][colIndex]) {
        tempLayout[rowIndex][colIndex] = roomLayout.value[rowIndex][colIndex]
      } else {
        tempLayout[rowIndex][colIndex] = { selected: false, type: 'empty' }
      }
    }
  }

  roomLayout.value = tempLayout
}

function clickPosition(e: MouseEvent, row: number, col: number) {
  if (!(e.target instanceof HTMLInputElement)) {
    roomLayout.value[row][col].selected = !roomLayout.value[row][col].selected
  }
}

function onContextMenu(e: MouseEvent) {
  e.preventDefault()
  //Set the mouse position
  optionsComponent.value.x = e.x
  optionsComponent.value.y = e.y
  //Show menu
  showMenu.value = true
}

function checkUncheckAll(selected: boolean) {
  for (var i = 0; i < roomLayout.value.length; i++) {
    var row = roomLayout.value[i]
    for (var j = 0; j < row.length; j++) {
      roomLayout.value[i][j].selected = selected
    }
  }
}

function invertSelection() {
  for (var i = 0; i < roomLayout.value.length; i++) {
    var row = roomLayout.value[i]
    for (var j = 0; j < row.length; j++) {
      roomLayout.value[i][j].selected = !roomLayout.value[i][j].selected
    }
  }
}

function setSpotType(spotType: 'empty' | 'seat' | 'tv' | 'speaker' | 'fan' | 'instructor') {
  totalConfiguredSeats.value = 0

  for (var i = 0; i < roomLayout.value.length; i++) {
    var row = roomLayout.value[i]
    for (var j = 0; j < row.length; j++) {
      if (roomLayout.value[i][j].selected) {
        roomLayout.value[i][j].type = spotType
        roomLayout.value[i][j].spotNumber = null
        roomLayout.value[i][j].selected = false
      }

      if (roomLayout.value[i][j].type === 'seat') {
        totalConfiguredSeats.value++
      }
    }
  }
}

function onClickSaveLayout() {
  console.log(roomLayout.value)
}

function onClickCancel() {
  console.log(roomLayout.value)
}
</script>

<template>
  <h1>New Room Layout</h1>

  <form
    action="https://stagingcrank-fit.myperformanceiq.com/admin/createRoomLayout"
    id="createLayoutForm"
    enctype="multipart/form-data"
    method="post"
    accept-charset="utf-8"
  >
    <input type="hidden" id="SeatMatrixData" name="SeatMatrixData" />
    <div class="row">
      <div class="form-group col-md-4 col-sm-12 col-xs-12">
        <label class="form-label">Room Layout Name</label>
        <div class="controls">
          <input
            type="text"
            id="RoomLayoutName"
            name="RoomLayoutName"
            required
            placeholder=""
            class="form-control"
          />
        </div>
      </div>
      <div class="form-group col-md-4 col-sm-12 col-xs-12">
        <label class="form-label">Email Type</label>
        <div class="controls">
          <select
            id="EmailType"
            name="EmailType"
            style="width: 100%"
            tabindex="-1"
            class="custom-select"
            aria-hidden="true"      
          >
            <option value="0" selected>CYCLE Emails</option>
            <option value="1">RPM Emails</option>
            <option value="2">HEART RATE Emails</option>
            <option value="4">ROWING Emails</option>
            <option value="3">No Emails</option></select
          >
        </div>
      </div>
      <hr class="col-md-12" />
    </div>

    <div class="row">
      <div class="form-group col-md-6">
        <label for="formControlRange">Rows - {{ layoutSize.rows }}</label>
        <input
          type="range"
          class="form-control-range"
          id="formControlRange"
          min="1"
          max="50"
          step="1"
          v-model="layoutSize.rows"
        />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-md-6">
        <label for="formControlRange">Columns - {{ layoutSize.cols }}</label>
        <input
          type="range"
          class="form-control-range"
          id="formControlRange"
          min="1"
          max="50"
          step="1"
          v-model="layoutSize.cols"
        />
      </div>
    </div>
  </form>

  <hr />

  <p>Maximum 100 Spots can be configured</p>
  <p>Total Spots - {{ layoutSize.rows * layoutSize.cols }}</p>
  <p>Total Configured Spots - {{ totalConfiguredSeats }}</p>

  <div class="row">
    <div class="col-md-2 col-xs-12">
      <DefaultButtonComponent
        text="Save Layout"
        @on-click="onClickSaveLayout()"
        type="button"
        :block="true"
      ></DefaultButtonComponent>
    </div>
    <div class="col-md-2 col-xs-12">
      <DefaultButtonComponent
        text="Cancel"
        @on-click="onClickCancel()"
        type="button"
        :block="true"
        variant="secondary"
      ></DefaultButtonComponent>
    </div>
  </div>

  <div class="row mt-5">
    <div class="table-responsive col-md-12">
      <table class="">
        <tbody>
          <tr
            v-for="(colRow, rowIndex) in roomLayout"
            v-bind:key="rowIndex"
            v-bind:index="rowIndex"
            class="text-center"
          >
            <td
              v-for="(spot, colIndex) in colRow"
              v-bind:key="colIndex"
              v-bind:index="colIndex"
              :class="{ highlighted: spot.selected }"
              @click="clickPosition($event, rowIndex, colIndex)"
              @contextmenu="onContextMenu($event)"
            >
              <div>
                <div v-if="spot.type === 'empty'">-</div>
                <div v-else-if="spot.type === 'seat'">
                  <input
                    type="number"
                    class="seat-number"
                    min="1"
                    max="2500"
                    :class="{ hasError: spot.spotNumber === null || spot.spotNumber === undefined }"
                    v-model="spot.spotNumber"
                  />
                  <i class="bi bi-circle" style="font-size: 1.8rem"></i>
                </div>
                <div v-else-if="spot.type === 'instructor'">
                  <input
                    type="number"
                    class="seat-number"
                    min="1"
                    max="2500"
                    :class="{ hasError: spot.spotNumber === null || spot.spotNumber === undefined }"
                    v-model="spot.spotNumber"
                  />
                  <i class="bi bi-person-fill" style="font-size: 1.8rem"></i>
                </div>
                <div v-else-if="spot.type === 'speaker'">
                  <i class="bi bi-speaker" style="font-size: 1.8rem"></i>
                </div>
                <div v-else-if="spot.type === 'fan'">
                  <i class="bi bi-fan" style="font-size: 1.8rem"></i>
                </div>
                <div v-else-if="spot.type === 'tv'">
                  <i class="bi bi-tv" style="font-size: 1.8rem"></i>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!--this is component mode of context-menu-->
  <context-menu v-model:show="showMenu" :options="optionsComponent">
    <context-menu-item label="Select All" @click="checkUncheckAll(true)">
      <template #icon>
        <i class="bi bi-check2-all"></i>
      </template>
    </context-menu-item>
    <context-menu-item label="Clear Selection" @click="checkUncheckAll(false)">
      <template #icon>
        <i class="bi bi-x-lg"></i>
      </template>
    </context-menu-item>
    <context-menu-item label="Invert Selection" @click="invertSelection()">
      <template #icon>
        <i class="bi bi-arrow-clockwise"></i>
      </template>
    </context-menu-item>
    <context-menu-sperator />
    <context-menu-item label="Create Seat" @click="setSpotType('seat')">
      <template #icon>
        <i class="bi bi-bicycle"></i>
      </template>
    </context-menu-item>
    <context-menu-item label="Create Fan Spot" @click="setSpotType('fan')">
      <template #icon>
        <i class="bi bi-fan"></i>
      </template>
    </context-menu-item>
    <context-menu-item label="Create TV Spot" @click="setSpotType('tv')">
      <template #icon>
        <i class="bi bi-tv"></i>
      </template>
    </context-menu-item>
    <context-menu-item label="Create Speaker Spot" @click="setSpotType('speaker')">
      <template #icon>
        <i class="bi bi-speaker-fill"></i>
      </template>
    </context-menu-item>
    <context-menu-item label="Create Instructor Spot" @click="setSpotType('instructor')">
      <template #icon>
        <i class="bi bi-person-fill"></i>
      </template>
    </context-menu-item>
    <context-menu-sperator />
    <context-menu-item label="Clear Seat" @click="setSpotType('empty')">
      <template #icon>
        <i class="bi bi-x-circle"></i>
      </template>
    </context-menu-item>
  </context-menu>
</template>

<style scoped>
table,
td {
  border: 1px solid black;
}

td {
  width: 70px;
  height: 70px;
  max-width: 70px;
  max-height: 70px;
  min-width: 70px;
  min-height: 70px;
}

td.highlighted {
  border: 2px dotted #f5f5f5 !important;
  background-color: #000000 !important;
  color: #fff !important;
}

.seat-number {
  color: #000 !important;
  min-width: 20px !important;
  width: 80%;
  max-width: 60px !important;
  min-height: 25px !important;
  max-height: 25px !important;
  padding: 0 !important;
  background-color: #efefef !important;
  border: 0 solid transparent;
  text-transform: uppercase;
}

.hasError {
  border: 1px solid red !important;
}
</style>
