import { createApp, h, provide } from 'vue'
import { createPinia } from 'pinia'
import PaymentsIframeView from './views/PaymentsIframeView.vue'
import '@/assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { ApiService } from '@/services/apiService'
import { newAnonymousClient, newAuthenticatedApolloClient } from '@/services/graphqlClient'
import { useAuthenticationStore } from '@/stores/authToken'

import { appStore } from './stores/appStorage'
import { SiteEnum } from './modules/shared/interfaces/site.enum'
import { useRouter } from 'vue-router'

const router = useRouter()

startApp()

async function startApp() {
  console.log('V1.0.0')
  const selection = <HTMLElement | null>document.querySelector('#vue-app-parameters')
  const token = selection?.dataset.token as string
  const gqlUrl = selection?.dataset.gqlUrl as string
  const site = selection?.dataset.site as string

  const app = createApp({
    setup() {
      provide(
        'gqlApiService',
        new ApiService(newAuthenticatedApolloClient(gqlUrl), newAnonymousClient(gqlUrl))
      )
    },
    render: () => h(PaymentsIframeView)
  })

  app.use(createPinia()).use(router)
  useAuthenticationStore().setSession(token)

  if (site) {
    if (site === SiteEnum.Dubai) {
      appStore().setSite(SiteEnum.Dubai)
    } else if (site === SiteEnum.AbuDhabi) {
      appStore().setSite(SiteEnum.AbuDhabi)
    } else if (site === SiteEnum.TownSquare) {
      appStore().setSite(SiteEnum.TownSquare)
    } else {
      throw Error
    }
  } else {
    throw Error
  }

  app.mount('#app')
}
