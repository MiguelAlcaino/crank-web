import { createApp, h, provide } from 'vue'
import { newAnonymousClient, newAuthenticatedApolloClient } from './services/graphqlClient'
import { ApiService } from './services/apiService'
import { createPinia } from 'pinia'

import Popper from 'vue3-popper'

import router from './router'

import { appStore } from './stores/appStorage'
import BookingCalendarView from './views/BookingCalendarView.vue'
import ClassView from './views/ClassView.vue'
import ChangeSpotView from './views/ChangeSpotView.vue'
import BookingsView from './views/BookingsView.vue'
import RegisterView from './views/RegisterView.vue'
import PurchasesView from './views/PurchasesView.vue'
import WorkoutStatsView from './views/WorkoutStatsView.vue'
import ProfileView from './views/ProfileView.vue'
import { SiteEnum } from './gql/graphql'
import App from '@/App.vue'

const defaultGqlUrl = 'https://payments2.crank-fit.com/api/graphql/'
const defaultAppDiv = '#app'

export const startBookingCalendarApp = async function (
  site: string,
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
  })

  let siteEnum: SiteEnum

  if (site === SiteEnum.Dubai.toString()) {
    siteEnum = SiteEnum.Dubai
  } else if (site === SiteEnum.AbuDhabi) {
    siteEnum = SiteEnum.AbuDhabi
  } else {
    throw Error
  }

  app.use(createPinia()).use(router).component('Popper', Popper)
  appStore().setSite(siteEnum)
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
    render: () => h(BookingsView)
  })

  app.use(createPinia()).use(router)

  app.mount(appDiv)
}

export const startClassApp = async function (
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
    render: () => h(ClassView)
  })

  app.use(createPinia()).use(router)

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
    render: () => h(RegisterView)
  })

  app.use(createPinia()).use(router)

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
    render: () => h(PurchasesView)
  })

  app.use(createPinia()).use(router)

  app.mount(appDiv)
}

export const startChangeSpotApp = async function (
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
    render: () => h(ChangeSpotView)
  })

  app.use(createPinia()).use(router)

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
    render: () => h(WorkoutStatsView)
  })

  app.use(createPinia()).use(router)

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
    render: () => h(ProfileView)
  })

  app.use(createPinia()).use(router)

  app.mount(appDiv)
}
