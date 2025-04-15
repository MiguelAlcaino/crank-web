<script setup lang="ts">
import type { Site } from '@/modules/shared/interfaces/site'
import type { SiteEnum } from '@/modules/shared/interfaces/site.enum'
import type { ApiService } from '@/services/apiService'
import { appStore } from '@/stores/appStorage'
import { inject, onMounted, ref } from 'vue'

const apiService = inject<ApiService>('gqlApiService')!

defineProps<{
  disabled?: boolean | undefined
}>()

const emits = defineEmits<{
  (e: 'afterChangingSite'): void
}>()

const sites = ref<Site[]>([])

const selectedSite = ref<SiteEnum>(appStore().site)

onMounted(() => {
  getAvailableSites()
})

async function getAvailableSites() {
  sites.value = await apiService.getCurrentUserSitesWithNames()
}

function onChangeSite() {
  appStore().setSite(selectedSite.value)
  emits('afterChangingSite')
}
</script>

<template>
  <select
    class="custom-select"
    v-model="selectedSite"
    @change="onChangeSite()"
    id="selectSite"
    required
    :disabled="disabled"
    v-if="sites.length > 1"
  >
    <option v-for="(item, index) in sites" :key="index" :value="item.code">
      {{ item.name }}
    </option>
  </select>
</template>

<style scoped></style>
