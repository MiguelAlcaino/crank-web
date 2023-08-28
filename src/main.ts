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

  app.mount('#app')
}
