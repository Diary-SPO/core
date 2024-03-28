import { render } from 'preact'

import { Suspense } from '@components'
import { lazy } from 'preact/compat'

import '@vkontakte/vkui/dist/cssm/styles/themes.css'
import './styles/index.css'

const AppWrapper = lazy(() => import('./app/AppWrapper'))

render(
  <Suspense id='RootAppWrapper' mode='screen'>
    <AppWrapper />
  </Suspense>,
  document.getElementById('app')!
)
