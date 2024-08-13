import { render } from 'preact'
import { lazy } from 'preact/compat'

import { Suspense } from './shared/ui'

import '@vkontakte/vkui/dist/cssm/styles/themes.css'
import './app/styles/index.css'

const AppWrapper = lazy(() => import('./app/AppWrapper'))

render(
  <Suspense id='RootAppWrapper' mode='screen'>
    <AppWrapper />
  </Suspense>,
  document.getElementById('app')!
)
