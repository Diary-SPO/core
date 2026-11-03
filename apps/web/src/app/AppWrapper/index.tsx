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
  ACCENT_CHANGE_EVENT,
  type AccentId,
  getAccentPreference,
  getThemePreference,
  syncAppearanceToDocument,
  THEME_CHANGE_EVENT,
  type ThemePreference,
  toColorScheme
} from '../../shared/config'
import { router } from '../routes/router'

import App from './App'
import NotFoundCorrect from './NotFound'
import PinLock from './PinLock'

vkBridge.send('VKWebAppInit')

const AppWrapper = () => {
  const platform = usePlatform()
  const vkBridgeAppearance = useAppearance() || undefined
  const [themePreference, setThemePreference] =
    useState<ThemePreference>(getThemePreference)
  const [accent, setAccent] = useState<AccentId>(getAccentPreference)

  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      setThemePreference((event as CustomEvent<ThemePreference>).detail)
    }
    const handleAccentChange = (event: Event) => {
      setAccent((event as CustomEvent<AccentId>).detail)
    }

    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange)
    window.addEventListener(ACCENT_CHANGE_EVENT, handleAccentChange)
    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange)
      window.removeEventListener(ACCENT_CHANGE_EVENT, handleAccentChange)
    }
  }, [])

  useEffect(() => {
    syncAppearanceToDocument(themePreference, accent)
  }, [themePreference, accent])

  const colorScheme = toColorScheme(themePreference, vkBridgeAppearance)

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
            <PinLock />
          </Suspense>
        </ConfigProvider>
      </RouterProvider>
    </AdaptivityProvider>
  )
}

export default AppWrapper
