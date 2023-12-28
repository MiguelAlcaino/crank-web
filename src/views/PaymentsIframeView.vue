<script setup lang="ts">
import { appStore } from '@/stores/appStorage'
import { useAuthenticationStore } from '@/stores/authToken'
import { onMounted, ref } from 'vue'

onMounted(() => {
  const site = appStore().site
  const token = useAuthenticationStore().token

  iframeLink.value =
    'https://payments2.crank-fit.com/autologin?packages=1&site=' +
    site +
    '&bearer=' +
    token +
    '&from-mobile-app=1'
})

const iframeLink = ref<string | null>(null)
</script>

<template>
  <div class="embed-responsive embed-responsive-16by9">
    <iframe v-if="iframeLink" width="800" height="230" :src="iframeLink"></iframe>
  </div>
</template>

<style scoped></style>
