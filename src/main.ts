import { createApp, h, provide } from 'vue'
import { createPinia } from 'pinia'
import { createVfm } from 'vue-final-modal'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'vue-final-modal/style.css'
import { authService } from '@/services/authService'
import { ApiService } from '@/services/apiService'
import { newAnonymousClient, newAuthenticatedApolloClient } from '@/services/graphqlClient'
import { useAuthenticationStore } from '@/stores/authToken'
import { Config } from '@/model/Config'

startApp()

async function startApp() {
  const app = createApp({
    setup() {
      provide('gqlApiService', new ApiService(
        newAuthenticatedApolloClient(Config.GRAPHQL_SERVICE_PATH),
        newAnonymousClient(Config.GRAPHQL_SERVICE_PATH))
      )
    },
    render: () => h(App)
  })

  app.use(createPinia()).use(router).use(createVfm())

  try {
    await authService.startRefreshTokenTimer()
  } catch (e) {
    // In case the refresh token is invalid
    useAuthenticationStore().deleteSession()
  }

  app.mount('#app')
}
