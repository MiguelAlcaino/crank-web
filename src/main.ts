import { createApp, h, provide } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

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

import 'vue3-simple-typeahead/dist/vue3-simple-typeahead.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/main.css'

import { authService } from '@/services/authService'
import { ApiService } from '@/services/apiService'
import { newAnonymousClient, newAuthenticatedApolloClient } from '@/services/graphqlClient'
import { useAuthenticationStore } from '@/stores/authToken'
import { Config } from '@/model/Config'

import SimpleTypeahead from 'vue3-simple-typeahead'
import { appStore } from './stores/appStorage'
import { SiteEnum } from './gql/graphql'

startApp()

async function startApp() {
  const selection = <HTMLElement | null>document.querySelector('#app-parameters')
  const view = selection?.dataset.view as string
  const site = selection?.dataset.site as string
  const app = createApp({
    setup() {
      provide(
        'gqlApiService',
        new ApiService(
          newAuthenticatedApolloClient(Config.GRAPHQL_SERVICE_URL),
          newAnonymousClient(Config.GRAPHQL_SERVICE_URL)
        )
      )
    },
    render: () => h(App)
  }).component('font-awesome-icon', FontAwesomeIcon)

  app
    .use(createPinia())
    .use(router)
    .use(SimpleTypeahead)
    .component('Popper', Popper)
    .component('VueDatePicker', VueDatePicker)

  try {
    await authService.startRefreshTokenTimer()
  } catch (e) {
    // In case the refresh token is invalid
    useAuthenticationStore().deleteSession()
  }

  if (site !== null && site !== undefined && site !== appStore().site.toString()) {
    if (authService.isLoggedId()) {
      const apiService = new ApiService(
        newAuthenticatedApolloClient(Config.GRAPHQL_SERVICE_URL),
        newAnonymousClient(Config.GRAPHQL_SERVICE_URL)
      )

      const currentUserExistsOnSite = (await apiService.currentUserDoesExistInSite(site)) as boolean

      if (currentUserExistsOnSite !== null && currentUserExistsOnSite === true) {
        if (site === SiteEnum.Dubai.toString()) {
          appStore().setSite(SiteEnum.Dubai)
        } else if (site === SiteEnum.AbuDhabi.toString()) {
          appStore().setSite(SiteEnum.AbuDhabi)
        }
      } else {
        const response = await apiService.createCurrentUserInSite(appStore().site, site)

        if (
          response !== null &&
          (response.__typename === 'CreateCurrentUserInSiteSuccess' ||
            response.__typename === 'UserAlreadyExistsError')
        ) {
          if (site === SiteEnum.Dubai.toString()) {
            appStore().setSite(SiteEnum.Dubai)
          } else if (site === SiteEnum.AbuDhabi.toString()) {
            appStore().setSite(SiteEnum.AbuDhabi)
          }
        } else {
          authService.logout()
        }
      }
    }
  }

  /**
   * 1. Check if user is logged in
   * 1.2 If not logged in, nothing
   * 1.3 If logged in, check is user exists with currentUser.doesExistInSite(<site>): bool
   *  1.3.1 If user does not exist, use mutation createCurrentUserInSite(fromSite: <Site from storage>, toSite: <site>)
   *    1.3.1.1 if success, change the site in the app state (storage)
   *    1.3.1.2 If there's an error, logout (this should not evet happen)
   *  1.3.2 If user exists, change the site in the app state (storage)
   */

  if (view == 'calendar') {
    await router.push('/calendar')
  } else if (view == 'profile') {
    await router.push('/profile')
  }

  app.mount('#app')
}
