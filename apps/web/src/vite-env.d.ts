/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_SERVER_URLS: string

  readonly VITE_MODE: 'prod' | 'dev'
  readonly VITE_NODE_ENV: 'production' | 'development'
  readonly NODE_ENV: 'production' | 'development'

  readonly VITE_ADMIN_PAGE_URL: string
  readonly VITE_BETA_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
