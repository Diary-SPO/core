import vkBridge from '@vkontakte/vk-bridge'
import { useAppearance } from '@vkontakte/vk-bridge-react'
import { RouterProvider } from '@vkontakte/vk-mini-apps-router'
import {
  AdaptivityProvider,
  ConfigProvider,
  usePlatform
} from '@vkontakte/vkui'
import { lazy } from 'react'

import { Suspense } from '../../shared'
import { router } from '../routes/router'

import App from './App'
import NotFoundCorrect from './NotFound'

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
          <Suspense id='App' mode='screen'>
            <App />
          </Suspense>
        </ConfigProvider>
      </RouterProvider>
    </AdaptivityProvider>
  )
}

export default AppWrapper
