import axios from "axios";
import {useAuthenticationStore} from "@/stores/authToken";
import {IncorrectCredentialsLoginError} from "@/model/Exception";
import router from "@/router";
import jwt_decode from 'jwt-decode';
import dayjs from "dayjs";

interface JwtTokenPayload {
    exp: number
}

export const authService = {
    isLoggedId(): boolean {
        const store = useAuthenticationStore();
        if (store.token !== null) {
            let decoded = jwt_decode<JwtTokenPayload>(store.token);
            const now = dayjs().unix();
            if (now < decoded.exp) {
                return true;
            }
            store.deleteSession();

            return false;
        }

        return false;
    },
    async login(email: string, password: string, site: string) {
        try {
            const response = await axios.post("/api/login_check?site=" + site, {
                username: email,
                password: password,
            });

            const token = response.data.token;
            if (token) {
                useAuthenticationStore().setSession(token);
                this.startRefreshTokenTimer()
            }
        } catch (error) {
            console.log(error);
            throw new IncorrectCredentialsLoginError();
        }
    },
    startRefreshTokenTimer() {
        let decoded = jwt_decode<JwtTokenPayload>(useAuthenticationStore().token!);

        const expires = new Date(decoded.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        useAuthenticationStore().setRefreshTokenTimeout(setTimeout(this.refreshToken, timeout));
    },
    async refreshToken() {
        try {
            let response = await axios.post('/api/token/refresh');
            useAuthenticationStore().setSession(response.data.token);
        } catch (e) {
            useAuthenticationStore().deleteSession();
            return;
        }
    },
    async logout() {
        useAuthenticationStore().deleteSession();
        await router.push({name: "login"});
    },
};
