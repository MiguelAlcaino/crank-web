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
        const store = useAuthenticationStore();
        return store.token !== null;
    },
    async login(email: string, password: string, site: string): Promise<void> {
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
    startRefreshTokenTimer(): void {
        const decoded = jwt_decode<JwtTokenPayload>(useAuthenticationStore().token!);

        const expires = new Date(decoded.exp * 1000);
        const now = Date.now();
        const timeout = expires.getTime() - now - (60 * 1000); // 1 minute before it expires
        const self = this;
        useAuthenticationStore().setRefreshTokenTimeout(window.setTimeout(async function () {
            try {
                await self.refreshToken();
                self.startRefreshTokenTimer();
            } catch (e) {
                await self.logout();
            }
        }, timeout));
    },
    async refreshToken(): Promise<void> {
        const response = await axios.post('/api/token/refresh');
        useAuthenticationStore().setSession(response.data.token);
    },
    async logout(): Promise<void> {
        useAuthenticationStore().deleteSession();
        await router.push({name: "login"});
    },
};
