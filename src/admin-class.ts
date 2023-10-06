import { createApp, h, provide } from 'vue'
import { createPinia } from 'pinia'
import AdminClass from '@/views/admin/AdminClass.vue'
import router from '@/router'
import '@/assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { ApiService } from '@/services/apiService'
import { newAnonymousClient, newAuthenticatedApolloClient } from '@/services/graphqlClient'
import { useAuthenticationStore } from '@/stores/authToken'
import { SiteEnum } from './gql/graphql'
import { appStore } from './stores/appStorage'
import SimpleTypeahead from 'vue3-simple-typeahead'

startApp()

async function startApp() {
  console.log('V1.0.0')
  const selection = <HTMLElement | null>document.querySelector('#vue-app-admin-class')
  const mindbodyClass = JSON.parse(selection?.dataset.mindbodyClass as string)
  const token = selection?.dataset.token as string
  const gqlUrl = selection?.dataset.gqlUrl as string
  const site = selection?.dataset.site as string

  const app = createApp({
    setup() {
      provide('mindbodyClass', mindbodyClass)
      provide(
        'gqlApiService',
        new ApiService(newAuthenticatedApolloClient(gqlUrl), newAnonymousClient(gqlUrl))
      )
    },
    render: () => h(AdminClass)
  })

  app.use(createPinia()).use(router).use(SimpleTypeahead)
  useAuthenticationStore().setSession(token)

  if (site) {
    if (site === SiteEnum.Dubai.toString()) {
      appStore().setSite(SiteEnum.Dubai)
    } else if (site === SiteEnum.AbuDhabi) {
      appStore().setSite(SiteEnum.AbuDhabi)
    } else {
      throw Error
    }
  } else {
    throw Error
  }

  app.mount('#app')
}
