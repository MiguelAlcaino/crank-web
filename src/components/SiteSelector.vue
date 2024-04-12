<script lang="ts">
enum SiteEnum {
  AbuDhabi = 'abu_dhabi',
  Dubai = 'dubai'
}
</script>

<script setup lang="ts">
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

const sites = ref<SiteEnum[]>([])

const selectedSite = ref<SiteEnum>(appStore().site)

onMounted(() => {
  getAvailableSites()
})

async function getAvailableSites() {
  sites.value = await apiService.getCurrentUserSites()
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
    <option v-for="(item, index) in sites" :key="index" :value="item">
      {{ item === SiteEnum.AbuDhabi ? 'Abu Dhabi' : item === SiteEnum.Dubai ? 'Dubai' : item }}
    </option>
  </select>
</template>

<style scoped></style>
