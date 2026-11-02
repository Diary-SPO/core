import { Panel } from '@vkontakte/vkui'
import type { FC, PropsWithChildren } from 'react'

import { PanelHeaderWithBack } from '../../../shared/ui'

interface Props extends PropsWithChildren {
  id: string
}

export const Layout: FC<Props> = ({ id, children }) => (
  <Panel nav={id}>
    <PanelHeaderWithBack title='Главная' showBack={false} />
    {children}
  </Panel>
)
