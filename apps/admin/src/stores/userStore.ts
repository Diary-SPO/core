import { defineStore } from 'pinia'

interface User {
  name: string
}

interface UserState {
  isAuthenticated: boolean
  token: null | string
  user: User | null
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    isAuthenticated: false,
    token: null,
    user: null
  }),
  actions: {
    login(token: string, user: User) {
      this.isAuthenticated = true
      this.token = token
      this.user = user
    },
    logout() {
      this.isAuthenticated = false
      this.token = null
      this.user = null
    }
  }
})
