import { Suspense } from '@components'
import '@vkontakte/vkui/dist/vkui.css'
import { render } from 'preact'
import AppWrapper from './AppWrapper'

import './index.css'

render(
  <Suspense id='AppWrapper' mode='screen'>
    <AppWrapper />
  </Suspense>,
  document.getElementById('app')!
)
