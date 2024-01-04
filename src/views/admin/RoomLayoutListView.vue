<script lang="ts">
interface RoomLayout {
  id: string
  name: string
  columns: number
  rows: number
}
</script>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'

import DefaultButtonComponent from '@/components/DefaultButtonComponent.vue'
import type { ApiService } from '@/services/apiService'
import { appStore } from '@/stores/appStorage'
import router from '@/router'

const apiService = inject<ApiService>('gqlApiService')!

onMounted(() => {
  getRoomLayouts()
})

const isLoading = ref(false)
const roomLayouts = ref<RoomLayout[]>([])

async function getRoomLayouts() {
  isLoading.value = true

  roomLayouts.value = (await apiService.roomLayouts(appStore().site)) as RoomLayout[]

  isLoading.value = false
}

function onClickDeleteLayout(roomLayout: RoomLayout) {
  console.log('DELETE', roomLayout)
}
</script>

<template>
  <h1>Room Layouts</h1>

  <div class="row">
    <div class="col-12 text-right">
      <DefaultButtonComponent
        text="New Rom Layout"
        @on-click="router.push('/admin/room-layout/create')"
        type="button"
      ></DefaultButtonComponent>
    </div>
  </div>
  <br />
  <div class="row">
    <div class="col-12">
      <table class="table">
        <thead>
          <tr>
            <th class="text-center">ROOM NAME</th>
            <th class="text-center">EDIT</th>
            <th class="text-center">DELETE</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in roomLayouts" v-bind:key="item.id" v-bind:index="index">
            <td>{{ item.name }}</td>
            <td class="text-center">
              <button
                type="button"
                class="btn btn-link btn-sm"
                @click="router.push('/admin/room-layout/edit/' + item.id)"
              >
                <i class="bi bi-pencil-fill"></i>
              </button>
            </td>
            <td class="text-center">
              <button type="button" class="btn btn-link btn-sm" @click="onClickDeleteLayout(item)">
                <i class="bi bi-trash3-fill"></i>
              </button>
            </td>
          </tr>
          <tr v-if="!isLoading && roomLayouts?.length === 0">
            <td colspan="3" class="text-center"><p>NO DATA AVAILABLE IN TABLE</p></td>
          </tr>
          <tr v-if="isLoading">
            <td colspan="3" class="text-center">loading...</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
