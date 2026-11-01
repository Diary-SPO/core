import { Panel } from '@vkontakte/vkui'
import type { FC } from 'react'

import { PanelHeaderWithBack } from '../../../shared'
import type { Props } from '../../types.ts'
import Contacts from '../Contacts'
import FAQ from '../FAQ'

const HelpSettings: FC<Props> = ({ id }) => (
  <Panel nav={id}>
    <PanelHeaderWithBack title='Помощь' />
    <FAQ />
    <Contacts />
  </Panel>
)

export default HelpSettings
