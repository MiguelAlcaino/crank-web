import { createApp, h, provide } from "vue";
import { createPinia } from "pinia";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { DefaultApolloClient } from "@vue/apollo-composable";

import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import dayjs from "dayjs";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faUser, faTv, faFan } from "@fortawesome/free-solid-svg-icons";

library.add(faUser, faTv, faFan);

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
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
