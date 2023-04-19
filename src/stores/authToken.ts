import { defineStore } from 'pinia'

interface State {
  token: string | null
  refreshTokenTimeout: number | null
}

export const useAuthenticationStore = defineStore({
  id: 'authToken',
  state: (): State => ({
    token: localStorage.getItem('authToken'),
    refreshTokenTimeout: null
  }),
  actions: {
    setSession(token: string) {
      localStorage.setItem('authToken', token)
      this.token = token
    },
    setRefreshTokenTimeout(timeoutId: number) {
      this.refreshTokenTimeout = timeoutId
    },
    deleteSession() {
      localStorage.removeItem('authToken')
      this.token = null
      clearTimeout(this.refreshTokenTimeout!)
      this.refreshTokenTimeout = null
    }
  }
})
