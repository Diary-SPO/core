import { Suspense } from '@components'
import vkBridge from '@vkontakte/vk-bridge'
import { useAdaptivity, useAppearance } from '@vkontakte/vk-bridge-react'
import { RouterProvider } from '@vkontakte/vk-mini-apps-router'
import {
  AdaptivityProvider,
  ConfigProvider,
  usePlatform
} from '@vkontakte/vkui'
import { lazy } from 'preact/compat'
import { router } from '../../routes'
import AuthProvider from './AuthProvider.tsx'
import { transformVKBridgeAdaptivity } from './transformers/transformVKBridgeAdaptivity'

const App = lazy(() => import('./App'))
const NotFoundCorrect = lazy(() => import('./NotFound'))

const AppWrapper = () => {
  const platform = usePlatform()
  const vkBridgeAdaptivityProps = transformVKBridgeAdaptivity(useAdaptivity())
  const vkBridgeAppearance = useAppearance() || undefined

  return (
    <AdaptivityProvider {...vkBridgeAdaptivityProps}>
      <RouterProvider router={router} notFound={<NotFoundCorrect />}>
        <Suspense id='app' mode='screen'>
          <ConfigProvider
            appearance={vkBridgeAppearance}
            platform={platform}
            isWebView={vkBridge.isWebView()}
          >
            <AuthProvider>
              <App />
            </AuthProvider>
          </ConfigProvider>
        </Suspense>
      </RouterProvider>
    </AdaptivityProvider>
  )
}

export default AppWrapper
