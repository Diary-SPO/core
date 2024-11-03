import { lazy } from 'react'
import { createRoot } from 'react-dom/client'

import '@vkontakte/vkui/dist/cssm/styles/themes.css'
import './app/styles/index.css'

const AppWrapper = lazy(() => import('./app/AppWrapper'))

const app = document.getElementById('app')

createRoot(app!).render(<AppWrapper />)
