<script lang="ts">
interface SpotLayout {
  spotNumber?: number | null
  selected: boolean
}

interface LayoutSize {
  rows: number
  cols: number
}
</script>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'

onMounted(() => {
  fillLayout(layoutSize.rows, layoutSize.cols)
})

const layoutSize = reactive<LayoutSize>({ rows: 5, cols: 5 })

watch(layoutSize, (newLayoutSize, _) => {
  fillLayout(newLayoutSize.rows, newLayoutSize.cols)
})

const layout = ref<Array<Array<SpotLayout>>>([])

function fillLayout(rows: number, cols: number) {
  const tempLayout: SpotLayout[][] = new Array(rows)

  for (let i = 0; i < rows; i++) {
    tempLayout[i] = new Array<SpotLayout>(cols)
  }

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    for (let colIndex = 0; colIndex < cols; colIndex++) {
      if (layout.value[rowIndex] && layout.value[rowIndex][colIndex]) {
        tempLayout[rowIndex][colIndex] = layout.value[rowIndex][colIndex]
      } else {
        tempLayout[rowIndex][colIndex] = { selected: false }
      }
    }
  }

  layout.value = tempLayout
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

  <div class="row margin-top-25">
    <div id="Seats" class="table-responsive col-md-12">
      <table id="SeatsTable" class="table">
        <tbody>
          <tr v-for="(colRow, rowIndex) in layout" v-bind:key="rowIndex" v-bind:index="rowIndex">
            <td v-for="(spot, colIndex) in colRow" v-bind:key="colIndex" v-bind:index="colIndex">
              {{ spot }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
#Seats {
  padding-top: 10px !important;
}
#SeatsTable.table > tbody > tr > td:last-child {
  border-right: 1px solid #000 !important;
}
#SeatsTable.table > tbody > tr > td {
  min-width: 50px !important;
  width: 70px !important;
  max-width: 70px !important;
  height: 70px !important;
  text-align: center !important;
  align-content: center !important;
  vertical-align: middle !important;
  border-left: 1px solid #000;
  padding: 0 !important;
  border-top-color: #000 !important;
}

#SeatsTable tbody td.highlighted {
  border: 2px dotted #f5f5f5 !important;
  background-color: #8b0000 !important;
  color: #fff !important;
}
</style>
