<script setup lang="ts">
import { useRoute } from 'vue-router'

import { onMounted } from 'vue'
import { useAuthenticationStore } from '@/stores/authToken'

onMounted(() => {
  const route = useRoute()
  const token = useAuthenticationStore().token

  let destination = route.query.destination ?? ''

  if (destination) {
    var url = destination + '?bearer=' + token
    window.location.replace(url)
  } else {
    window.location.replace('https://www.crank-fit.com/')
  }
})
</script>

<template>
  <div></div>
</template>
