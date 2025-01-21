import { createApp, h, provide } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import VueApexCharts from 'vue3-apexcharts'

import Popper from 'vue3-popper'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faLeftLong, faStepBackward, faStepForward } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faStepBackward, faStepForward, faLeftLong)

//import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
//import './assets/main.css'

import { authService } from '@/services/authService'
import { ApiService } from '@/services/apiService'
import { newAnonymousClient, newAuthenticatedApolloClient } from '@/services/graphqlClient'
import { useAuthenticationStore } from '@/stores/authToken'

import { appStore } from './stores/appStorage'

import { hackSquarespaceMenu } from '@/utils/hack-squarespace-menu'
import { SiteEnum } from './modules/shared/interfaces/site.enum'

startApp()

async function startApp() {
  const selection = <HTMLElement | null>document.querySelector('#app-parameters')
  const view = selection?.dataset.view as string
  const site = selection?.dataset.site as string
  const apiService = new ApiService(
    newAuthenticatedApolloClient(import.meta.env.VITE_CRANK_GRAPHQL_SERVER_URL),
    newAnonymousClient(import.meta.env.VITE_CRANK_GRAPHQL_SERVER_URL)
  )

  const app = createApp({
    setup() {
      provide('gqlApiService', apiService)
    },
    render: () => h(App)
  }).component('font-awesome-icon', FontAwesomeIcon)

  app
    .use(createPinia())
    .use(router)
    .use(VueApexCharts)
    .component('Popper', Popper)
    .component('VueDatePicker', VueDatePicker)

  try {
    await authService.startRefreshTokenTimer()
  } catch (e) {
    // In case the refresh token is invalid
    useAuthenticationStore().deleteSession()
  }

  if (site) {
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

    if (!authService.isLoggedId()) {
      appStore().setSite(siteEnum)
    } else {
      if (appStore().site !== siteEnum) {
        const currentUserExistsOnSite = (await apiService.currentUserDoesExistInSite(
          site
        )) as boolean

        if (!currentUserExistsOnSite) {
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
      }
    }
  }

  if (view == 'calendar') {
    await router.push('/calendar')
  } else if (view == 'profile') {
    await router.push('/profile')
  } else if (view == 'reset-password') {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    await router.push('/reset-password?token=' + token)
  } else if (view == 'payments') {
    await router.push('/payments')
  } else if (view == 'bookings') {
    await router.push('/bookings')
  } else if (view == 'purchases') {
    await router.push('/purchases')
  } else if (view == 'workout-stats') {
    await router.push('/workout-stats')
  } else if (view == 'logout') {
    authService.logout()
  }

  // Hack the squarespace top menu
  hackSquarespaceMenu()

  app.mount('#app')
}
