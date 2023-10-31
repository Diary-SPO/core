import {
  AdaptivityProvider,
  ConfigProvider,
  usePlatform,
} from '@vkontakte/vkui'
import { RouterProvider } from '@vkontakte/vk-mini-apps-router'
import vkBridge from '@vkontakte/vk-bridge'
import { useAdaptivity, useAppearance } from '@vkontakte/vk-bridge-react'
import { FC, lazy } from 'preact/compat'
import { router } from './routes'
import Suspense from './components/UI/Suspense'
import { transformVKBridgeAdaptivity } from './transformers/transformVKBridgeAdaptivity'

const App = lazy(() => import('./App'))
const NotFound = lazy(() => import('./views/NotFound'))

vkBridge.send('VKWebAppInit')

const NotFoundCorrect: FC = () => {
  const platform = usePlatform()
  const vkBridgeAppearance = useAppearance() || undefined

  return (
    <ConfigProvider
      appearance={vkBridgeAppearance}
      isWebView={vkBridge.isWebView()}
      platform={platform}
    >
      <NotFound />
    </ConfigProvider>
  )
}

const AppWrapper = () => {
  const platform = usePlatform()
  const vkBridgeAdaptivityProps = transformVKBridgeAdaptivity(useAdaptivity())
  const vkBridgeAppearance = useAppearance() || undefined

  return (
    <AdaptivityProvider {...vkBridgeAdaptivityProps}>
      <RouterProvider router={router} notFound={<NotFoundCorrect />}>
        <Suspense id="app" mode="screen">
          <ConfigProvider
            appearance={vkBridgeAppearance}
            platform={platform}
            isWebView={vkBridge.isWebView()}
          >
            <App />
          </ConfigProvider>
        </Suspense>
      </RouterProvider>
    </AdaptivityProvider>
  )
}

export default AppWrapper
