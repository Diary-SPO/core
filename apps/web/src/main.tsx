import { render } from 'preact'
import AppWrapper from './app/AppWrapper'

import '@vkontakte/vkui/dist/cssm/styles/themes.css'
import './styles/index.css'

render(<AppWrapper />, document.getElementById('app')!)
