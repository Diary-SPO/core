import { render } from 'preact'

import { Suspense } from '@components'
import '@vkontakte/vkui/dist/cssm/styles/themes.css'
import { lazy } from 'preact/compat'
import './styles/index.css'

const AppWrapper = lazy(() => import('./app/AppWrapper'))

render(
  <Suspense id='RootAppWrapper' mode='screen'>
    <AppWrapper />
  </Suspense>,
  document.getElementById('app')!
)
