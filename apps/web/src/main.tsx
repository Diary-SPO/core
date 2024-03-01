import { render } from 'preact'

import '@vkontakte/vkui/dist/cssm/styles/themes.css'
import './styles/index.css'
import { lazy } from 'preact/compat'
import { Suspense } from '@components'

const AppWrapper = lazy(() => import('./app/AppWrapper'))

render(
  <Suspense id='RootAppWrapper' mode='screen'>
    <AppWrapper />
  </Suspense>,
  document.getElementById('app')!
)
