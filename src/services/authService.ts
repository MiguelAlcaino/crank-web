import axios from 'axios'
import { useAuthenticationStore } from '@/stores/authToken'
import { IncorrectCredentialsLoginError } from '@/model/Exception'
import router from '@/router'
import jwt_decode from 'jwt-decode'
import { Config } from '@/model/Config'
import type { SiteEnum } from '@/gql/graphql'
import { appStore } from '@/stores/appStorage'

interface JwtTokenPayload {
  exp: number
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

      if (response.status === 200) {
        if (response.data.status && response.data.status === 'success') {
          useAuthenticationStore().setSession(response.data.accessToken)
          return response.data.status
        } else {
          if (response.data.code) {
            return response.data.code
          } else {
            return 'unknown_error'
          }
        }
      }
      return 'unknown_error'
    } catch (error) {
      return 'unknown_error'
    }
  }
}
