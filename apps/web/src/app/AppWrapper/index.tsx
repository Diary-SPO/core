import vkBridge from '@vkontakte/vk-bridge'
import { useAppearance } from '@vkontakte/vk-bridge-react'
import { RouterProvider } from '@vkontakte/vk-mini-apps-router'
import {
  AdaptivityProvider,
  ConfigProvider,
  usePlatform
} from '@vkontakte/vkui'
import { router } from '../../routes'
import AuthProvider from './AuthProvider.tsx'

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
          <AuthProvider>
            <App />
          </AuthProvider>
        </ConfigProvider>
      </RouterProvider>
    </AdaptivityProvider>
  )
}

export default AppWrapper
