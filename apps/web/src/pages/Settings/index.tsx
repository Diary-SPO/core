import { Panel } from '@vkontakte/vkui'
import type { FC } from 'react'

import { PanelHeaderWithBack } from '../../shared'
import type { Props } from '../types.ts'

import Actions from './Actions'
import Contacts from './Contacts.tsx'
import FAQ from './FAQ'
import Footer from './Footer'
import GradeNotifications from './GradeNotifications.tsx'

const Settings: FC<Props> = ({ id }) => {
  return (
    <Panel nav={id}>
      <PanelHeaderWithBack title='Настройки' />
      <FAQ />
      <GradeNotifications />
      <Actions />
      <Contacts />
      <Footer />
    </Panel>
  )
}

export default Settings
