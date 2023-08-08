import { createApp, h, provide } from 'vue'
import { createPinia } from 'pinia'
import { createVfm } from 'vue-final-modal'
import App from './App.vue'
import router from './router'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faStepBackward, faStepForward } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faStepBackward, faStepForward)

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'vue-final-modal/style.css'
import './assets/main.css'

import { authService } from '@/services/authService'
import { ApiService } from '@/services/apiService'
import { newAnonymousClient, newAuthenticatedApolloClient } from '@/services/graphqlClient'
import { useAuthenticationStore } from '@/stores/authToken'
import { Config } from '@/model/Config'

startApp()

async function startApp() {
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

  app.use(createPinia()).use(router).use(createVfm())

  try {
    await authService.startRefreshTokenTimer()
  } catch (e) {
    // In case the refresh token is invalid
    useAuthenticationStore().deleteSession()
  }

  app.mount('#app')
}
