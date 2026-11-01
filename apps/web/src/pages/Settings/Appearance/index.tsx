import { Panel } from '@vkontakte/vkui'
import type { FC } from 'react'

import { PanelHeaderWithBack } from '../../../shared'
import type { Props } from '../../types.ts'
import ThemeSettings from '../ThemeSettings'

const AppearanceSettings: FC<Props> = ({ id }) => (
  <Panel nav={id}>
    <PanelHeaderWithBack title='Оформление' />
    <ThemeSettings />
  </Panel>
)

export default AppearanceSettings
