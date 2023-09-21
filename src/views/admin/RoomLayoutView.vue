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

function clickPosition(row: number, col: number) {
  roomLayout.value[row][col].selected = !roomLayout.value[row][col].selected
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
  for (var i = 0; i < roomLayout.value.length; i++) {
    var row = roomLayout.value[i]
    for (var j = 0; j < row.length; j++) {
      if (roomLayout.value[i][j].selected) {
        roomLayout.value[i][j].type = spotType
        roomLayout.value[i][j].spotNumber = null
        roomLayout.value[i][j].selected = false
      }
    }
  }
}
</script>

<template>
  <h1>New Room Layout</h1>

  <hr />
  <form>
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

  <p>Maximum 100 Spots can be configured</p>
  <p>Total Spots - {{ layoutSize.rows * layoutSize.cols }}</p>
  <p>Total Configured Spots - 0</p>

  <div class="row">
    <div class="col-md-2 col-xs-12">
      <button
        id="submitData"
        value="Save Layout"
        class="btn btn-primary btn-cons btn-block waves-effect waves-light"
      >
        Save Layout
      </button>
    </div>
    <div class="col-md-2 col-xs-12">
      <a
        href="https://stagingcrank-fit.myperformanceiq.com/admin/roomLayouts"
        type="button"
        class="btn btn-white btn-cons btn-block waves-effect waves-light"
      >
        Cancel</a
      >
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
              @click="clickPosition(rowIndex, colIndex)"
              @contextmenu="onContextMenu($event)"
            >
              <div>
                <div v-if="spot.type === 'empty'">-</div>
                <div v-else-if="spot.type === 'seat'">seat</div>
                <div v-else-if="spot.type === 'instructor'">
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
  background-color: #8b0000 !important;
  color: #fff !important;
}
</style>
