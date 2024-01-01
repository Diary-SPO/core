import vkBridge from '@vkontakte/vk-bridge'
import { useAppearance, useInsets } from '@vkontakte/vk-bridge-react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import {
  AppRoot,
  Button,
  ConfigProvider,
  Div,
  usePlatform
} from '@vkontakte/vkui'
import { CSSProperties, FC } from 'preact/compat'

const notFoundStyle: CSSProperties = {
  display: 'flex',
  margin: 'auto',
  height: '100vh',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center'
}

const text: CSSProperties = {
  padding: '0px 8px',
  fontFamily: 'Roboto, sans-serif',
  fontSize: 80,
  color: 'rgb(63, 138, 224)',
  background: 'rgba(63, 138, 224, 0.08)',
  borderRadius: 8,
  marginBottom: 40
}

const NotFound: FC = () => {
  const routeNavigator = useRouteNavigator()
  const vkBridgeInsets = useInsets() || undefined

  return (
    <AppRoot safeAreaInsets={vkBridgeInsets}>
      <Div style={notFoundStyle}>
        <h1 style={text}>404</h1>
        <Button
          onClick={() => routeNavigator.replace('/')}
          size='l'
          mode='outline'
          appearance='accent-invariable'
          style={{ padding: 10 }}
        >
          <span style={{ fontSize: '1.5em' }}>На главную</span>
        </Button>
      </Div>
    </AppRoot>
  )
}

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

export default NotFoundCorrect
