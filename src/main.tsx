import { render } from 'preact'
import '@vkontakte/vkui/dist/vkui.css'
import { Suspense } from '@components'
import AppWrapper from './AppWrapper'

import './index.css'

render(
  <Suspense id="AppWrapper" mode="screen">
    <AppWrapper />
  </Suspense>,
  document.getElementById('app')!
)
