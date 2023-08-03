import { createApp, h, provide } from 'vue'
import { createPinia } from 'pinia'
import { createVfm } from 'vue-final-modal'
import AdminClass from '@/views/admin/AdminClass.vue'
import router from '@/router'
import '@/assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'vue-final-modal/style.css'
import { ApiService } from '@/services/apiService'
import { newAnonymousClient, newAuthenticatedApolloClient } from '@/services/graphqlClient'
import { useAuthenticationStore } from '@/stores/authToken'

startApp()

async function startApp() {
  const selection = <HTMLElement | null>document.querySelector('#vue-app-admin-class')
  let mindbodyClass = JSON.parse(selection?.dataset.mindbodyClass as string)
  let token = selection?.dataset.token as string
  let gqlUrl = selection?.dataset.gqlUrl as string
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

  app.use(createPinia()).use(router).use(createVfm())
  useAuthenticationStore().setSession(token)

  app.mount('#app')
}
