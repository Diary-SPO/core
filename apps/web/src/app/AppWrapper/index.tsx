import vkBridge from '@vkontakte/vk-bridge'
import { useAppearance } from '@vkontakte/vk-bridge-react'
import { RouterProvider } from '@vkontakte/vk-mini-apps-router'
import {
  AdaptivityProvider,
  ConfigProvider,
  usePlatform
} from '@vkontakte/vkui'
import { lazy } from 'preact/compat'

import { Suspense } from '../../shared/ui'
import { router } from '../routes/router'

import AuthProvider from '../providers/AuthProvider.tsx'

const NotFoundCorrect = lazy(() => import('./NotFound'))
const App = lazy(() => import('./App'))

vkBridge.send('VKWebAppInit')

const AppWrapper = () => {
  const platform = usePlatform()
  const vkBridgeAppearance = useAppearance() || undefined

  return (
    <AdaptivityProvider>
      <RouterProvider router={router} notFound={<NotFoundCorrect />}>
        <ConfigProvider
          appearance={vkBridgeAppearance}
          platform={platform}
          isWebView={vkBridge.isWebView()}
        >
          <AuthProvider>
            <Suspense id='App' mode='screen'>
              <App />
            </Suspense>
          </AuthProvider>
        </ConfigProvider>
      </RouterProvider>
    </AdaptivityProvider>
  )
}

export default AppWrapper
