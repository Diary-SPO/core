import '@vkontakte/vkui/dist/vkui.css'
import { render } from 'preact'

import AppWrapper from './app/AppWrapper'
import './index.css'

render(<AppWrapper />, document.getElementById('app')!)
