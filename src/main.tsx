import { render } from 'preact'
import './index.css'
import '@vkontakte/vkui/dist/vkui.css'
import Suspense from './components/UI/Suspense'
import AppWrapper from './AppWrapper'

render(
  <Suspense id="AppWrapper" mode="screen">
    <AppWrapper />
  </Suspense>,
  document.getElementById('app')!
)
