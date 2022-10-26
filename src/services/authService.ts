import axios from "axios";
import { useAuthenticationStore } from "@/stores/authToken";
import { IncorrectCredentialsLoginError } from "@/model/Exception";
import router from "@/router";

export const authService = {
  isLoggedId(): boolean {
    return useAuthenticationStore().token !== null;
  },
  async login(email: string, password: string, site: string) {
    try {
      const response = await axios.post("/api/login_check?site=" + site, {
        username: email,
        password: password,
      });

      if (response.data.token) {
        useAuthenticationStore().setSession(
          response.data.token,
          response.data.refresh_token
        );
      }
    } catch (error) {
      console.log(error);
      throw new IncorrectCredentialsLoginError();
    }
  },
  async logout() {
    useAuthenticationStore().deleteSession();
    await router.push({ name: "login" });
  },
};
