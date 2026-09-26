import vkBridge from '@vkontakte/vk-bridge'
import { useAppearance } from '@vkontakte/vk-bridge-react'
import { RouterProvider } from '@vkontakte/vk-mini-apps-router'
import {
  AdaptivityProvider,
  ConfigProvider,
  usePlatform
} from '@vkontakte/vkui'
import { useEffect, useState } from 'react'

import { Suspense } from '../../shared'
import {
  getThemePreference,
  THEME_CHANGE_EVENT,
  type ThemePreference
} from '../../shared/config'
import { router } from '../routes/router'

import App from './App'
import NotFoundCorrect from './NotFound'

vkBridge.send('VKWebAppInit')

const AppWrapper = () => {
  const platform = usePlatform()
  const vkBridgeAppearance = useAppearance() || undefined
  const [themePreference, setThemePreference] =
    useState<ThemePreference>(getThemePreference)

  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      setThemePreference((event as CustomEvent<ThemePreference>).detail)
    }

    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange)
    return () =>
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange)
  }, [])

  const colorScheme =
    themePreference === 'auto' ? vkBridgeAppearance : themePreference

  return (
    <AdaptivityProvider>
      <RouterProvider router={router} notFound={<NotFoundCorrect />}>
        <ConfigProvider
          colorScheme={colorScheme}
          platform={platform}
          isWebView={vkBridge.isWebView()}
        >
          <Suspense id='App' mode='screen'>
            <App />
          </Suspense>
        </ConfigProvider>
      </RouterProvider>
    </AdaptivityProvider>
  )
}

export default AppWrapper
