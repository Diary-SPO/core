import { getSystemAccent } from '@runtime-api'
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
  type AccentColors,
  type AccentId,
  getAccentPreference,
  getOledPreference,
  getThemePreference,
  OLED_CHANGE_EVENT,
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
  const [oled, setOled] = useState(getOledPreference)
  const [accent, setAccent] = useState<AccentId>(getAccentPreference)

  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      setThemePreference((event as CustomEvent<ThemePreference>).detail)
    }
    const handleOledChange = (event: Event) => {
      setOled((event as CustomEvent<boolean>).detail)
    }
    const handleAccentChange = (event: Event) => {
      setAccent((event as CustomEvent<AccentId>).detail)
    }

    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange)
    window.addEventListener(OLED_CHANGE_EVENT, handleOledChange)
    window.addEventListener(ACCENT_CHANGE_EVENT, handleAccentChange)
    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange)
      window.removeEventListener(OLED_CHANGE_EVENT, handleOledChange)
      window.removeEventListener(ACCENT_CHANGE_EVENT, handleAccentChange)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const apply = async () => {
      let systemColors: AccentColors | null = null
      if (accent === 'system') {
        systemColors = await getSystemAccent()
      }
      if (cancelled) return
      syncAppearanceToDocument(themePreference, accent, oled, systemColors)
    }

    void apply()

    if (themePreference !== 'auto' && accent !== 'system') return

    const schemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const onSchemeChange = () => {
      void apply()
    }
    schemeQuery.addEventListener('change', onSchemeChange)

    const onFocus = () => {
      if (accent === 'system') void apply()
    }
    window.addEventListener('focus', onFocus)

    return () => {
      cancelled = true
      schemeQuery.removeEventListener('change', onSchemeChange)
      window.removeEventListener('focus', onFocus)
    }
  }, [themePreference, accent, oled])

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
