<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

import { inject, onMounted, ref } from 'vue'
import { authService } from '@/services/authService'
import { useAuthenticationStore } from '@/stores/authToken'
import { appStore } from '@/stores/appStorage'

import CrankCircularProgressIndicator from '@/components/CrankCircularProgressIndicator.vue'

import type { ApiService } from '@/services/apiService'
import { SiteEnum } from '../../shared/interfaces/site.enum'

const apiService = inject<ApiService>('gqlApiService')!

const isLoading = ref<boolean>(false)
const defaultUrl = 'https://www.crank-fit.com/'
const router = useRouter()

onMounted(() => {
  const route = useRoute()

  let site = (route.query.site ?? null) as string
  let destination = (route.query.destination ?? null) as string

  checkLoginSiteAndRedirect(site, destination)
})

async function checkLoginSiteAndRedirect(site: string, destination: string) {
  isLoading.value = true

  try {
    if (!destination || !site) {
      window.location.replace(defaultUrl)
      return
    }

    let siteEnum: SiteEnum

    if (site === SiteEnum.Dubai) {
      siteEnum = SiteEnum.Dubai
    } else if (site === SiteEnum.AbuDhabi) {
      siteEnum = SiteEnum.AbuDhabi
    } else if (site === SiteEnum.TownSquare) {
      siteEnum = SiteEnum.TownSquare
    } else {
      throw Error
    }

    if (authService.isLoggedId()) {
      let currentUserExistsOnSite = false

      if (appStore().site === siteEnum) {
        currentUserExistsOnSite = true
      } else {
        currentUserExistsOnSite = await apiService.currentUserDoesExistInSite(site)
      }

      if (currentUserExistsOnSite) {
        appStore().setSite(siteEnum)

        const token = useAuthenticationStore().token

        const url = `${destination}&bearer=${token}`
        window.location.replace(url)
      } else {
        const response = await apiService.createCurrentUserInSite(appStore().site, site)

        if (
          response !== null &&
          (response.__typename === 'CreateCurrentUserInSiteSuccess' ||
            response.__typename === 'UserAlreadyExistsError')
        ) {
          appStore().setSite(siteEnum)

          const token = useAuthenticationStore().token
          const url = `${destination}&bearer=${token}`
          window.location.replace(url)
        } else {
          authService.logout()
        }
      }
    } else {
      await router.push({ name: 'login', query: { redirect: destination, site: site, addAuth: 1 } })
    }
  } catch (error) {
    window.location.replace(defaultUrl)
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

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped></style>
