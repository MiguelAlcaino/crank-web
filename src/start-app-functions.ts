import { createApp, h, provide } from 'vue'
import { newAnonymousClient, newAuthenticatedApolloClient } from './services/graphqlClient'
import { ApiService } from './services/apiService'
import { createPinia } from 'pinia'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faLeftLong, faStepBackward, faStepForward } from '@fortawesome/free-solid-svg-icons'
library.add(faStepBackward, faStepForward, faLeftLong)

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import Popper from 'vue3-popper'

import VueApexCharts from 'vue3-apexcharts'

import 'bootstrap-icons/font/bootstrap-icons.css'

import router from './router'

import { appStore } from './stores/appStorage'
import { SiteEnum } from './gql/graphql'

import App from '@/App.vue'
import { authService } from './services/authService'

const defaultGqlUrl = import.meta.env.VITE_CRANK_GRAPHQL_SERVER_URL
const defaultAppDiv = '#app'
//test commit
export const startBookingCalendarApp = async function (
  site: string,
  gqlUrl: string = defaultGqlUrl,
  appDiv: string = defaultAppDiv
) {
  const apiService = new ApiService(
    newAuthenticatedApolloClient(gqlUrl),
    newAnonymousClient(gqlUrl)
  )
  const app = createApp({
    setup() {
      provide('gqlApiService', apiService)
    },
    render: () => h(App)
  }).component('font-awesome-icon', FontAwesomeIcon)

  let siteEnum: SiteEnum

  if (site === SiteEnum.Dubai.toString()) {
    siteEnum = SiteEnum.Dubai
  } else if (site === SiteEnum.AbuDhabi) {
    siteEnum = SiteEnum.AbuDhabi
  } else {
    throw Error
  }

  app
    .use(createPinia())
    .use(router)
    .component('Popper', Popper)
    .component('VueDatePicker', VueDatePicker)

  try {
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
        } else {
          appStore().setSite(siteEnum)
        }
      } else {
        appStore().setSite(siteEnum)
      }
    }
  } catch (error) {
    console.error('ERROR:', error)
  }

  await router.push('/calendar')
  app.mount(appDiv)
}

export const startBookingsApp = async function (
  gqlUrl: string = defaultGqlUrl,
  appDiv: string = defaultAppDiv
) {
  const app = createApp({
    setup() {
      provide(
        'gqlApiService',
        new ApiService(newAuthenticatedApolloClient(gqlUrl), newAnonymousClient(gqlUrl))
      )
    },
    render: () => h(App)
  }).component('font-awesome-icon', FontAwesomeIcon)

  app
    .use(createPinia())
    .use(router)
    .component('Popper', Popper)
    .component('VueDatePicker', VueDatePicker)
  await router.push('/bookings')
  app.mount(appDiv)
}

export const startRegisterApp = async function (
  gqlUrl: string = defaultGqlUrl,
  appDiv: string = defaultAppDiv
) {
  const app = createApp({
    setup() {
      provide(
        'gqlApiService',
        new ApiService(newAuthenticatedApolloClient(gqlUrl), newAnonymousClient(gqlUrl))
      )
    },
    render: () => h(App)
  }).component('font-awesome-icon', FontAwesomeIcon)

  app
    .use(createPinia())
    .use(router)
    .component('Popper', Popper)
    .component('VueDatePicker', VueDatePicker)
  await router.push('/register')
  app.mount(appDiv)
}

export const startPurchasesApp = async function (
  gqlUrl: string = defaultGqlUrl,
  appDiv: string = defaultAppDiv
) {
  const app = createApp({
    setup() {
      provide(
        'gqlApiService',
        new ApiService(newAuthenticatedApolloClient(gqlUrl), newAnonymousClient(gqlUrl))
      )
    },
    render: () => h(App)
  }).component('font-awesome-icon', FontAwesomeIcon)

  app
    .use(createPinia())
    .use(router)
    .component('Popper', Popper)
    .component('VueDatePicker', VueDatePicker)
  await router.push('/purchases')
  app.mount(appDiv)
}

export const startWorkoutStatsApp = async function (
  gqlUrl: string = defaultGqlUrl,
  appDiv: string = defaultAppDiv
) {
  const app = createApp({
    setup() {
      provide(
        'gqlApiService',
        new ApiService(newAuthenticatedApolloClient(gqlUrl), newAnonymousClient(gqlUrl))
      )
    },
    render: () => h(App)
  }).component('font-awesome-icon', FontAwesomeIcon)

  app
    .use(createPinia())
    .use(router)
    .component('Popper', Popper)
    .component('VueDatePicker', VueDatePicker)
    .use(VueApexCharts)
  await router.push('/workout-stats')
  app.mount(appDiv)
}

export const startProfileApp = async function (
  gqlUrl: string = defaultGqlUrl,
  appDiv: string = defaultAppDiv
) {
  const app = createApp({
    setup() {
      provide(
        'gqlApiService',
        new ApiService(newAuthenticatedApolloClient(gqlUrl), newAnonymousClient(gqlUrl))
      )
    },
    render: () => h(App)
  }).component('font-awesome-icon', FontAwesomeIcon)

  app
    .use(createPinia())
    .use(router)
    .component('Popper', Popper)
    .component('VueDatePicker', VueDatePicker)
  await router.push('/profile')
  app.mount(appDiv)
}

export const startPaymentsIframeApp = async function (
  site: string,
  gqlUrl: string = defaultGqlUrl,
  appDiv: string = defaultAppDiv
) {
  const apiService = new ApiService(
    newAuthenticatedApolloClient(gqlUrl),
    newAnonymousClient(gqlUrl)
  )
  const app = createApp({
    setup() {
      provide('gqlApiService', apiService)
    },
    render: () => h(App)
  })

  let siteEnum: SiteEnum

  if (site === SiteEnum.Dubai.toString()) {
    siteEnum = SiteEnum.Dubai
  } else if (site === SiteEnum.AbuDhabi) {
    siteEnum = SiteEnum.AbuDhabi
  } else {
    throw Error
  }

  app.use(createPinia()).use(router)

  try {
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
        } else {
          appStore().setSite(siteEnum)
        }
      } else {
        appStore().setSite(siteEnum)
      }
    }
  } catch (error) {
    console.error('ERROR:', error)
  }

  await router.push('/payments')
  app.mount(appDiv)
}

export const startResetPasswordApp = async function (
  gqlUrl: string = defaultGqlUrl,
  appDiv: string = defaultAppDiv
) {
  const app = createApp({
    setup() {
      provide(
        'gqlApiService',
        new ApiService(newAuthenticatedApolloClient(gqlUrl), newAnonymousClient(gqlUrl))
      )
    },
    render: () => h(App)
  }).component('font-awesome-icon', FontAwesomeIcon)

  app
    .use(createPinia())
    .use(router)
    .component('Popper', Popper)
    .component('VueDatePicker', VueDatePicker)

  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const token = urlParams.get('token')

  await router.push('/reset-password?token=' + token)
  app.mount(appDiv)
}

export const startLoginRedirectApp = async function (
  gqlUrl: string = defaultGqlUrl,
  appDiv: string = defaultAppDiv
) {
  const app = createApp({
    setup() {
      provide(
        'gqlApiService',
        new ApiService(newAuthenticatedApolloClient(gqlUrl), newAnonymousClient(gqlUrl))
      )
    },
    render: () => h(App)
  }).component('font-awesome-icon', FontAwesomeIcon)

  app
    .use(createPinia())
    .use(router)
    .component('Popper', Popper)
    .component('VueDatePicker', VueDatePicker)

  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const site = urlParams.get('site')
  const destination = urlParams.get('destination')

  await router.push({ name: 'login_redirect', query: { destination: destination, site: site } })
  app.mount(appDiv)
}

// TODO: put site parameter in the url
export const startVueAppWithoutPath = async function (
  site: string = SiteEnum.Dubai.toString(),
  gqlUrl: string = defaultGqlUrl,
  appDiv: string = defaultAppDiv
) {
  const apiService = new ApiService(
    newAuthenticatedApolloClient(gqlUrl),
    newAnonymousClient(gqlUrl)
  )
  const app = createApp({
    setup() {
      provide('gqlApiService', apiService)
    },
    render: () => h(App)
  }).component('font-awesome-icon', FontAwesomeIcon)

  let siteEnum: SiteEnum

  if (site === SiteEnum.Dubai.toString()) {
    siteEnum = SiteEnum.Dubai
  } else if (site === SiteEnum.AbuDhabi) {
    siteEnum = SiteEnum.AbuDhabi
  } else {
    throw Error
  }

  app
    .use(createPinia())
    .use(router)
    .component('Popper', Popper)
    .component('VueDatePicker', VueDatePicker)

  try {
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
        } else {
          appStore().setSite(siteEnum)
        }
      } else {
        appStore().setSite(siteEnum)
      }
    }
  } catch (error) {
    console.error('ERROR:', error)
  }

  app.mount(appDiv)
}
