import { defineStore } from "pinia";

interface AuthenticationState {
  token: string | null;
  refreshToken: string | null;
}

export const useAuthenticationStore = defineStore({
  id: "authToken",
  state: (): AuthenticationState => ({
    token: localStorage.getItem("authToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  }),
  actions: {
    setSession(token: string, refreshToken: string) {
      localStorage.setItem("authToken", token);
      this.token = token;

      localStorage.setItem("refreshToken", refreshToken);
      this.refreshToken = refreshToken;
    },
    deleteSession() {
      localStorage.removeItem("authToken");
      this.token = null;

      localStorage.removeItem("refreshToken");
      this.refreshToken = null;
    },
  },
});
