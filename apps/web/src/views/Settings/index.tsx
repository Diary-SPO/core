import { Panel } from '@vkontakte/vkui'
import type { FunctionalComponent } from 'preact'
import { lazy } from 'preact/compat'

import { PanelHeaderWithBack, Suspense } from '@components'
import type { Props } from '../types.ts'

const Contacts = lazy(() => import('./Contacts'))
const Actions = lazy(() => import('./Actions'))
const FAQ = lazy(() => import('./FAQ'))
const Footer = lazy(() => import('./Footer'))

const Settings: FunctionalComponent<Props> = ({ id }) => {
  return (
    <Panel nav={id}>
      <PanelHeaderWithBack title='Настройки' />
      <Suspense id='Settings_FACF'>
        <FAQ />
        <Actions />
        <Contacts />
        <Footer />
      </Suspense>
    </Panel>
  )
}

export default Settings
