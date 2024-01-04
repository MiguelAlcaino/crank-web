<script setup lang="ts">
import DefaultButtonComponent from '@/components/DefaultButtonComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import type { ApiService } from '@/services/apiService'
import { appStore } from '@/stores/appStorage'
import { ERROR_UNKNOWN } from '@/utils/errorMessages'
import { inject, ref } from 'vue'

const props = defineProps<{
  disabled: boolean
}>()

const emits = defineEmits<{
  (e: 'afterSyncAllClasses'): void
}>()

const apiService = inject<ApiService>('gqlApiService')!
const isSyncing = ref(false)
const errorModalIsVisible = ref(false)

async function syncAllClasses() {
  isSyncing.value = true

  try {
    await apiService.syncAllClasses(appStore().site)
    emits('afterSyncAllClasses')
  } catch (error) {
    errorModalIsVisible.value = true
  } finally {
    isSyncing.value = false
  }
}
</script>

<template>
  <DefaultButtonComponent
    text="SYNC ALL CLASSES"
    type="button"
    :is-loading="isSyncing"
    @on-click="syncAllClasses"
    :disabled="props.disabled"
  ></DefaultButtonComponent>

  <!-- ERROR modal -->
  <ModalComponent
    title="ERROR"
    :message="ERROR_UNKNOWN"
    :closable="false"
    v-if="errorModalIsVisible"
    @on-ok="errorModalIsVisible = false"
    :cancel-text="null"
  >
  </ModalComponent>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
