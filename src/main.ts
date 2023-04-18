import {createApp, h, provide} from "vue";
import {createPinia} from "pinia";
import {createVfm} from "vue-final-modal";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import dayjs from "dayjs";
import "bootstrap-icons/font/bootstrap-icons.css";
import "vue-final-modal/style.css";
import {authService} from "@/services/authService";
import {ApiService} from "@/services/apiService";
import {apiClient, authApiClient} from "@/services/graphqlClient";
import {useAuthenticationStore} from "@/stores/authToken";

startApp();

async function startApp() {
    const app = createApp({
        setup() {
            provide('gqlApiService', new ApiService(authApiClient, apiClient))
        },
        render: () => h(App),
    });

    app
        .use(createPinia())
        .use(router)
        .use(createVfm());

    try {
        await authService.startRefreshTokenTimer()
    } catch (e) {
        // In case the refresh token is invalid
        useAuthenticationStore().deleteSession();
    }

    app.mount("#app");
}
