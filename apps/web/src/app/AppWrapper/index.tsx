import {
  getSystemAccent,
  getSystemDark,
  setStatusBarIconStyle,
  subscribeSystemDark
} from '@runtime-api'
import vkBridge from '@vkontakte/vk-bridge'
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
  setSystemDarkOverride,
  syncAppearanceToDocument,
  THEME_CHANGE_EVENT,
  toColorScheme,
  type ThemePreference
} from '../../shared/config'
import { router } from '../routes/router'

import App from './App'
import NotFoundCorrect from './NotFound'
import PinLock from './PinLock'

vkBridge.send('VKWebAppInit')

const AppWrapper = () => {
  const platform = usePlatform()
  const [themePreference, setThemePreference] =
    useState<ThemePreference>(getThemePreference)
  const [oled, setOled] = useState(getOledPreference)
  const [accent, setAccent] = useState<AccentId>(getAccentPreference)
  const [colorScheme, setColorScheme] = useState(() =>
    toColorScheme(getThemePreference())
  )

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
      const nativeDark = await getSystemDark()
      if (cancelled) return
      if (nativeDark !== null) setSystemDarkOverride(nativeDark)

      let systemColors: AccentColors | null = null
      if (accent === 'system') {
        systemColors = await getSystemAccent()
      }
      if (cancelled) return

      const scheme = toColorScheme(themePreference)
      setColorScheme(scheme)
      syncAppearanceToDocument(themePreference, accent, oled, systemColors)
      // Тёмный UI → светлые иконки статус-бара (darkIcons=false).
      void setStatusBarIconStyle(scheme === 'light')
    }

    void apply()
    const retryId =
      accent === 'system' ? window.setTimeout(() => void apply(), 400) : 0

    const schemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const onSchemeChange = () => {
      if (themePreference === 'auto') void apply()
    }
    schemeQuery.addEventListener('change', onSchemeChange)

    const onFocus = () => {
      if (accent === 'system' || themePreference === 'auto') void apply()
    }
    window.addEventListener('focus', onFocus)

    let unsubscribeNative = () => undefined as void
    void subscribeSystemDark((dark) => {
      setSystemDarkOverride(dark)
      if (themePreference === 'auto') void apply()
    }).then((unsubscribe) => {
      if (cancelled) {
        unsubscribe()
        return
      }
      unsubscribeNative = unsubscribe
    })

    return () => {
      cancelled = true
      window.clearTimeout(retryId)
      schemeQuery.removeEventListener('change', onSchemeChange)
      window.removeEventListener('focus', onFocus)
      unsubscribeNative()
    }
  }, [themePreference, accent, oled])

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
