<script lang="ts">
interface LayoutPosition {
  selected: boolean
  type: PositionIconEnum
  spotNumber?: number | null
}

interface LayoutSize {
  rows: number
  cols: number
}

interface RoomLayoutInput {
  name: string
  columns: number
  rows: number
  matrix: Array<IconPositionInput>
}

interface IconPositionInput {
  x: number
  y: number
  type: PositionIconEnum
  spotNumber?: number | null
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
import { computed, inject, onMounted, reactive, ref, watch } from 'vue'
import { type MenuOptions, ContextMenu, ContextMenuItem } from '@imengyu/vue3-context-menu'

import DefaultButtonComponent from '@/components/DefaultButtonComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import { ERROR_UNIQUE_NAMES_SPOTS_LAYOUT, ERROR_UNKNOWN } from '@/utils/errorMessages'
import type { ApiService } from '@/services/apiService'
import { appStore } from '@/stores/appStorage'
import { helpers, maxLength, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import router from '@/router'

const apiService = inject<ApiService>('gqlApiService')!

onMounted(() => {
  fillLayout(layoutSize.rows, layoutSize.cols)
})

const layoutSize = reactive<LayoutSize>({ rows: 5, cols: 5 })

watch(layoutSize, (newLayoutSize, _) => {
  fillLayout(newLayoutSize.rows, newLayoutSize.cols)
})

const formData = reactive({
  name: ''
})
const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage('Name is required', required),
      maxLength: maxLength(50)
    }
  }
})
const v$ = useVuelidate(rules, formData)

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
const isSaving = ref<boolean>(false)
const errorMessage = ref<string>('')
const errorModalIsVisible = ref<Boolean>(false)
const successModalIsVisible = ref<Boolean>(false)

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
        tempLayout[rowIndex][colIndex] = { selected: false, type: PositionIconEnum.Empty }
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

function setSpotType(spotType: PositionIconEnum) {
  totalConfiguredSeats.value = 0

  for (var i = 0; i < roomLayout.value.length; i++) {
    var row = roomLayout.value[i]
    for (var j = 0; j < row.length; j++) {
      if (roomLayout.value[i][j].selected) {
        roomLayout.value[i][j].type = spotType
        roomLayout.value[i][j].spotNumber = null
        roomLayout.value[i][j].selected = false
      }

      if (roomLayout.value[i][j].type === PositionIconEnum.Spot) {
        totalConfiguredSeats.value++
      }
    }
  }
}

async function onClickSaveLayout() {
  const isValid = await v$.value.$validate()

  if (isValid) {
    if (spotNumbersAreValid(roomLayout.value)) {
      saveRomLayout()
    } else {
      errorMessage.value = ERROR_UNIQUE_NAMES_SPOTS_LAYOUT
      errorModalIsVisible.value = true
    }
  }
}

function onClickCancel() {
  console.log(roomLayout.value)
}

async function saveRomLayout() {
  isSaving.value = true

  var matrix: Array<IconPositionInput> = []

  for (var y = 0; y < roomLayout.value.length; y++) {
    var row = roomLayout.value[y]
    for (var x = 0; x < row.length; x++) {
      matrix.push({
        type: roomLayout.value[y][x].type,
        x: x,
        y: y,
        spotNumber: roomLayout.value[y][x].spotNumber
      })
    }
  }

  var roomlayoutInput: RoomLayoutInput = {
    columns: +layoutSize.cols,
    rows: +layoutSize.rows,
    name: formData.name,
    matrix: matrix
  }

  const response = await apiService.createRoomLayout(appStore().site, roomlayoutInput)
  isSaving.value = false

  if (response) {
    successModalIsVisible.value = true
  } else {
    errorMessage.value = ERROR_UNKNOWN
    errorModalIsVisible.value = true
  }
}

function spotNumbersAreValid(roomLayout: Array<Array<LayoutPosition>>): boolean {
  let sportNumbers: number[] = []

  for (var i = 0; i < roomLayout.length; i++) {
    var row = roomLayout[i]

    for (var j = 0; j < row.length; j++) {
      if (roomLayout[i][j].type === PositionIconEnum.Spot) {
        if (roomLayout[i][j].spotNumber !== null && roomLayout[i][j].spotNumber !== undefined) {
          if (!sportNumbers.includes(roomLayout[i][j].spotNumber!)) {
            sportNumbers.push(roomLayout[i][j].spotNumber!)
          } else {
            return false
          }
        } else {
          return false
        }
      }
    }
  }

  if (sportNumbers.length === 0) return false

  return true
}
</script>

<template>
  <h1>New Room Layout</h1>

  <form autocomplete="off">
    <div class="row">
      <div class="form-group col-md-4 col-sm-12 col-xs-12">
        <label for="roomLayoutName" class="input-label">Room Layout Name *</label>
        <div class="controls">
          <input
            type="text"
            id="roomLayoutName"
            name="roomLayoutName"
            required
            class="form-control"
            v-model="formData.name"
          />
          <small
            v-for="error in v$.name.$errors"
            :key="error.$uid"
            class="form-text"
            style="color: red"
          >
            {{ error.$message }}
          </small>
        </div>
      </div>
      <hr />
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
                <div v-if="spot.type === PositionIconEnum.Empty">-</div>
                <div v-else-if="spot.type === PositionIconEnum.Spot">
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
                <div v-else-if="spot.type === PositionIconEnum.Instructor">
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
                <div v-else-if="spot.type === PositionIconEnum.Speaker">
                  <i class="bi bi-speaker" style="font-size: 1.8rem"></i>
                </div>
                <div v-else-if="spot.type === PositionIconEnum.Fan">
                  <i class="bi bi-fan" style="font-size: 1.8rem"></i>
                </div>
                <div v-else-if="spot.type === PositionIconEnum.Tv">
                  <i class="bi bi-tv" style="font-size: 1.8rem"></i>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!--context menu-->
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
    <context-menu-item label="Create Seat" @click="setSpotType(PositionIconEnum.Spot)">
      <template #icon>
        <i class="bi bi-bicycle"></i>
      </template>
    </context-menu-item>
    <context-menu-item label="Create Fan Spot" @click="setSpotType(PositionIconEnum.Fan)">
      <template #icon>
        <i class="bi bi-fan"></i>
      </template>
    </context-menu-item>
    <context-menu-item label="Create TV Spot" @click="setSpotType(PositionIconEnum.Tv)">
      <template #icon>
        <i class="bi bi-tv"></i>
      </template>
    </context-menu-item>
    <context-menu-item label="Create Speaker Spot" @click="setSpotType(PositionIconEnum.Speaker)">
      <template #icon>
        <i class="bi bi-speaker-fill"></i>
      </template>
    </context-menu-item>
    <context-menu-item
      label="Create Instructor Spot"
      @click="setSpotType(PositionIconEnum.Instructor)"
    >
      <template #icon>
        <i class="bi bi-person-fill"></i>
      </template>
    </context-menu-item>
    <context-menu-sperator />
    <context-menu-item label="Clear Seat" @click="setSpotType(PositionIconEnum.Empty)">
      <template #icon>
        <i class="bi bi-x-circle"></i>
      </template>
    </context-menu-item>
  </context-menu>

  <!-- Success modal -->
  <ModalComponent
    :ok-loading="false"
    title="SUCCESS"
    message="Saved successfully"
    :closable="false"
    :cancel-text="null"
    v-if="successModalIsVisible"
    @on-ok="router.push('/admin/room-layout/list')"
  >
  </ModalComponent>

  <!-- ERROR modal -->
  <ModalComponent
    :ok-loading="false"
    title="Error"
    :message="errorMessage"
    :closable="false"
    :cancel-text="null"
    v-if="errorModalIsVisible"
    @on-ok="errorModalIsVisible = false"
  >
  </ModalComponent>
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
  background-color: #ff7f61 !important;
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
