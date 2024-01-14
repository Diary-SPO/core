import { Suspense } from '@components'
import '@vkontakte/vkui/dist/vkui.css'
import { render } from 'preact'

import vkBridge from '@vkontakte/vk-bridge'
import AppWrapper from './app/AppWrapper'
import './index.css'

vkBridge.send('VKWebAppInit')

render(
  <Suspense id='AppWrapper' mode='screen'>
    <AppWrapper />
  </Suspense>,
  document.getElementById('app')!
)
