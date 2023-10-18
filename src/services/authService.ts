import axios, { AxiosError } from 'axios'
import { useAuthenticationStore } from '@/stores/authToken'
import { IncorrectCredentialsLoginError } from '@/model/Exception'
import router from '@/router'
import jwt_decode from 'jwt-decode'
import { Config } from '@/model/Config'
import type { SiteEnum } from '@/gql/graphql'
import { appStore } from '@/stores/appStorage'
import type { Role } from '@/utils/userRoles'

interface JwtTokenPayload {
  exp: number
  roles: string[]
}

export const authService = {
  isLoggedId(): boolean {
    const store = useAuthenticationStore()
    return store.token !== null
  },
  async login(email: string, password: string, site: string): Promise<void> {
    try {
      const response = await axios.post(
        Config.AUTH_SERVICE_HOST + '/api/login_check?site=' + site,
        {
          username: email,
          password: password
        }
      )

      const token = response.data.token
      if (token) {
        useAuthenticationStore().setSession(token)
        appStore().setSite(site as SiteEnum)
        this.startRefreshTokenTimer()
      }
    } catch (error) {
      throw new IncorrectCredentialsLoginError()
    }
  },
  startRefreshTokenTimer(): void {
    const decoded = jwt_decode<JwtTokenPayload>(useAuthenticationStore().token!)

    const expires = new Date(decoded.exp * 1000)
    const now = Date.now()
    const timeout = expires.getTime() - now - 60 * 1000 // 1 minute before it expires
    const self = this
    useAuthenticationStore().setRefreshTokenTimeout(
      window.setTimeout(async function () {
        try {
          await self.refreshToken()
          self.startRefreshTokenTimer()
        } catch (e) {
          await self.logout()
        }
      }, timeout)
    )
  },
  async refreshToken(): Promise<void> {
    const response = await axios.post(Config.AUTH_SERVICE_HOST + '/api/token/refresh')
    useAuthenticationStore().setSession(response.data.token)
  },
  async logout(): Promise<void> {
    useAuthenticationStore().deleteSession()
    await router.push({ name: 'login' })
  },
  async validateResetPasswordToken(resetPasswordToken: string): Promise<string> {
    try {
      const response = await axios.get(
        Config.AUTH_SERVICE_HOST + '/api/reset-password/validate-token/' + resetPasswordToken
      )

      useAuthenticationStore().setSession(response.data.token)
      return 'success'
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response?.data &&
        error.response?.data.status &&
        error.response?.data.status === 'error'
      ) {
        return error.response?.data.code
      }

      return 'unknown_error'
    }
  },
  userHasRole(role: Role): boolean {
    const token = useAuthenticationStore().token

    if (token) {
      const decoded = jwt_decode<JwtTokenPayload>(token)

      const userRoles = decoded.roles as Role[]

      for (let index = 0; index < userRoles.length; index++) {
        if (role === userRoles[index]) return true
      }
    }

    return false
  }
}
