<script setup lang="ts">
import { appStore } from '@/stores/appStorage'
import { useAuthenticationStore } from '@/stores/authToken'
import { onMounted, ref } from 'vue'
const paymentsUrl = (import.meta.env.VITE_CRANK_PAYMENTS_URL ?? '') as string | null

const iframeLink = ref<string | null>(null)

onMounted(() => {
  const site = appStore().site
  const token = useAuthenticationStore().token

  iframeLink.value =
  paymentsUrl + '/autologin?packages=1&site=' + site + '&bearer=' + token + '&from-mobile-app=1'
})
</script>

<template>
  <div class="container-fluid h-100">
    <div class="row justify-content-center vh-100">
      <div class="col-12">
        <iframe
          v-if="iframeLink"
          :src="iframeLink"
          sandbox="allow-same-origin allow-top-navigation allow-forms allow-scripts"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped>
iframe {
  border: none;
  width: 100%;
  height: 100%;
}
</style>
