let globalToken: string | null = null

export const setToken = (token: string) => {
  globalToken = token
}

export const getToken = (): string | null => globalToken
