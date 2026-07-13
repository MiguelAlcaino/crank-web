import { createPinia } from 'pinia'
import { createApp, h, provide } from 'vue'
import { ApiService } from './services/ApiService'
import { newAnonymousClient, newAuthenticatedApolloClient } from './services/graphqlClient'

// Icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLeftLong, faStepBackward, faStepForward } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// UI Components
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import VueApexCharts from 'vue3-apexcharts'
import Popper from 'vue3-popper'

// Router and Store
import router from './router'
import { authService } from './services/authService'
import { appStore } from './stores/appStorage'

// Types and Root Component
import { default as AppRoot } from '@/App.vue'
import { SiteEnum } from './modules/shared/interfaces/site.enum'
import { ShopApiService } from '@/modules/shop/services/ShopApiService'
import { SubscriptionsApiService } from '@/modules/subscriptions/services/SubscriptionsApiService'

// Initial configuration
library.add(faStepBackward, faStepForward, faLeftLong)
const defaultGqlUrl = import.meta.env.VITE_CRANK_GRAPHQL_SERVER_URL
const defaultAppDiv = '#app'

// --- HELPER: Application Factory ---
/**
 * Create the base instance of Vue with all common plugins
 */
const createBaseApp = (gqlUrl: string) => {
  const authClient = newAuthenticatedApolloClient(gqlUrl)
  const anonClient = newAnonymousClient(gqlUrl)

  const apiService = new ApiService(authClient, anonClient)
  const shopApiService = new ShopApiService(authClient, anonClient)
  const subscriptionsApiService = new SubscriptionsApiService(authClient)

  const app = createApp({
    setup() {
      provide('gqlApiService', apiService)
      provide('shopApiService', shopApiService)
      provide('subscriptionsApiService', subscriptionsApiService)
    },
    render: () => h(AppRoot)
  })

  // Registration of Plugins and Global Components
  app
    .use(createPinia())
    .use(router)
    .component('font-awesome-icon', FontAwesomeIcon)
    .component('Popper', Popper)
    .component('VueDatePicker', VueDatePicker)

  return { app, apiService, shopApiService, subscriptionsApiService }
}

// --- HELPER 3: Site Logic and Authentication ---
/**
 * Handles site assignment and user creation logic on the site if necessary
 */
const handleSiteContext = async (siteStr: string, apiService: ApiService) => {
  // Enum validation
  const isValidSite = Object.values(SiteEnum).includes(siteStr as SiteEnum)
  if (!isValidSite) {
    throw new Error(`Invalid Site provided: ${siteStr}`)
  }

  const siteEnum = siteStr as SiteEnum
  const store = appStore()

  try {
    if (!authService.isLoggedId()) {
      store.setSite(siteEnum)
      return
    }

    // If we are already logged in, we check site consistency.
    if (store.site === siteEnum) return

    const currentUserExistsOnSite = await apiService.currentUserDoesExistInSite(siteStr)

    if (!currentUserExistsOnSite) {
      const response = await apiService.createCurrentUserInSite(store.site, siteStr)
      const isSuccess =
        response?.__typename === 'CreateCurrentUserInSiteSuccess' ||
        response?.__typename === 'UserAlreadyExistsError'

      if (isSuccess) {
        store.setSite(siteEnum)
      } else {
        authService.logout()
      }
    } else {
      store.setSite(siteEnum)
    }
  } catch (error) {
    console.error('Error handling site context:', error)
  }
}

// ==========================================
// EXPORTED FUNCTIONS (Entry Points)
// ==========================================
export const startBookingCalendarApp = async function (
  site: string,
  gqlUrl: string = defaultGqlUrl,
  appDiv: string = defaultAppDiv
) {
  const { app, apiService } = createBaseApp(gqlUrl)
  await handleSiteContext(site, apiService)
  await router.push('/calendar')
  app.mount(appDiv)
}

export const startBookingsApp = async function (
  gqlUrl: string = defaultGqlUrl,
  appDiv: string = defaultAppDiv
) {
  const { app } = createBaseApp(gqlUrl)
  await router.push('/bookings')
  app.mount(appDiv)
}

export const startRegisterApp = async function (
  gqlUrl: string = defaultGqlUrl,
  appDiv: string = defaultAppDiv
) {
  const { app } = createBaseApp(gqlUrl)
  await router.push('/register')
  app.mount(appDiv)
}

export const startPurchasesApp = async function (
  gqlUrl: string = defaultGqlUrl,
  appDiv: string = defaultAppDiv
) {
  const { app } = createBaseApp(gqlUrl)
  await router.push('/purchases')
  app.mount(appDiv)
}

export const startWorkoutStatsApp = async function (
  gqlUrl: string = defaultGqlUrl,
  appDiv: string = defaultAppDiv
) {
  const { app } = createBaseApp(gqlUrl)
  app.use(VueApexCharts)
  await router.push('/workout-stats')
  app.mount(appDiv)
}

export const startProfileApp = async function (
  gqlUrl: string = defaultGqlUrl,
  appDiv: string = defaultAppDiv
) {
  const { app } = createBaseApp(gqlUrl)
  await router.push('/profile')
  app.mount(appDiv)
}

export const startPaymentsIframeApp = async function (
  site: string,
  gqlUrl: string = defaultGqlUrl,
  appDiv: string = defaultAppDiv
) {
  const { app, apiService } = createBaseApp(gqlUrl)
  await handleSiteContext(site, apiService)
  await router.push('/payments')
  app.mount(appDiv)
}

export const startResetPasswordApp = async function (
  gqlUrl: string = defaultGqlUrl,
  appDiv: string = defaultAppDiv
) {
  const { app } = createBaseApp(gqlUrl)

  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')

  await router.push({ path: '/reset-password', query: { token: token || undefined } })
  app.mount(appDiv)
}

export const startLoginRedirectApp = async function (
  gqlUrl: string = defaultGqlUrl,
  appDiv: string = defaultAppDiv
) {
  const { app } = createBaseApp(gqlUrl)

  const urlParams = new URLSearchParams(window.location.search)
  const site = urlParams.get('site')
  const destination = urlParams.get('destination')

  await router.push({
    name: 'login_redirect',
    query: {
      destination: destination || undefined,
      site: site || undefined
    }
  })
  app.mount(appDiv)
}

export const startSmsVerificationApp = async function (
  gqlUrl: string = defaultGqlUrl,
  appDiv: string = defaultAppDiv
) {
  const { app } = createBaseApp(gqlUrl)

  const urlParams = new URLSearchParams(window.location.search)
  const destination = urlParams.get('destination')

  await router.push({
    name: 'sms_verification',
    query: { destination: destination || undefined }
  })
  app.mount(appDiv)
}

// TODO: put site parameter in the url
export const startVueAppWithoutPath = async function (
  site: string = SiteEnum.Dubai,
  gqlUrl: string = defaultGqlUrl,
  appDiv: string = defaultAppDiv
) {
  const { app, apiService } = createBaseApp(gqlUrl)
  await handleSiteContext(site, apiService)

  app.mount(appDiv)
}
