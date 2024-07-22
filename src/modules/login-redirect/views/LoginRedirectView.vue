<script setup lang="ts">
import { useRoute } from 'vue-router'

import { inject, onMounted, ref } from 'vue'
import { authService } from '@/services/authService'
import { useAuthenticationStore } from '@/stores/authToken'
import { appStore } from '@/stores/appStorage'

import CrankCircularProgressIndicator from '@/components/CrankCircularProgressIndicator.vue'
import router from '@/router'

import { ApiService } from '@/services/apiService'
import { SiteEnum } from '../interfaces/site.enum'
const apiService = inject<ApiService>('gqlApiService')!

const isLoading = ref<boolean>(false)
const defaultUrl = '/' //'https://www.crank-fit.com/'

onMounted(() => {
  const route = useRoute()

  let site = (route.query.site ?? null) as string
  let destination = (route.query.destination ?? null) as string

  checkLoginSiteAndRedirect(site, destination)
})

async function checkLoginSiteAndRedirect(site: string, destination: string) {
  if (!destination || !site) {
    window.location.replace(defaultUrl)
  }

  let siteEnum: SiteEnum

  if (site === SiteEnum.Dubai.toString()) {
    siteEnum = SiteEnum.Dubai
  } else if (site === SiteEnum.AbuDhabi) {
    siteEnum = SiteEnum.AbuDhabi
  } else {
    throw Error
  }

  if (authService.isLoggedId()) {
    const currentUserExistsOnSite = await apiService.currentUserDoesExistInSite(site)

    if (currentUserExistsOnSite) {
      const token = useAuthenticationStore().token

      var url = `${destination}?site=${site}&bearer=${token}`
      window.location.replace(url)
    } else {
      const response = await apiService.createCurrentUserInSite(appStore().site, site)

      if (
        response !== null &&
        (response.__typename === 'CreateCurrentUserInSiteSuccess' ||
          response.__typename === 'UserAlreadyExistsError')
      ) {
        appStore().setSite(siteEnum)
      } else {
        authService.logout()
      }
    }
  } else {
    await router.push({ name: 'login', query: { redirect: destination, site: site, addAuth: 1 } })
  }
}
</script>

<template>
  <div>
    <CrankCircularProgressIndicator
      v-if="isLoading"
      text="Loading..."
    ></CrankCircularProgressIndicator>
  </div>
</template>
