import { Panel } from '@vkontakte/vkui'
import { type FC, lazy } from 'react'

import { PanelHeaderWithBack, Suspense } from '../../shared/ui'
import type { Props } from '../types.ts'

const Contacts = lazy(() => import('./Contacts.tsx'))
const Actions = lazy(() => import('./Actions'))
const FAQ = lazy(() => import('./FAQ'))
const Footer = lazy(() => import('./Footer'))

const Settings: FC<Props> = ({ id }) => {
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
