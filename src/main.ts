import { createApp, h, provide } from "vue";
import { createPinia } from "pinia";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { DefaultApolloClient } from "@vue/apollo-composable";

import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import dayjs from "dayjs";

import "bootstrap-icons/font/bootstrap-icons.css";

dayjs.Ls.en.weekStart = 1;

const apolloClient = new ApolloClient({
  uri: "https://payments2.crank-fit.com/api/graphql/",
  cache: new InMemoryCache(),
});

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App),
});

app.use(createPinia());
app.use(router);
app.config.globalProperties.$dayjs = dayjs;

app.mount("#app");
