import axios from "axios";
import {useAuthenticationStore} from "@/stores/authToken";
import {IncorrectCredentialsLoginError} from "@/model/Exception";
import router from "@/router";
import jwt_decode from 'jwt-decode';

interface JwtTokenPayload {
    exp: number
}

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
        let response = await axios.post('/api/token/refresh');
        useAuthenticationStore().setSession(response.data.token);
    },
    async logout() {
        useAuthenticationStore().deleteSession();
        await router.push({name: "login"});
    },
};
