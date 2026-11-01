import { backgroundGradeNotifications } from '@runtime-api'
import { Panel, Placeholder } from '@vkontakte/vkui'
import type { FC } from 'react'

import { PanelHeaderWithBack } from '../../../shared'
import type { Props } from '../../types.ts'
import GradeNotifications from '../GradeNotifications'

const NotificationsSettings: FC<Props> = ({ id }) => (
  <Panel nav={id}>
    <PanelHeaderWithBack title='Уведомления' />
    {backgroundGradeNotifications.supported ? (
      <GradeNotifications />
    ) : (
      <Placeholder>
        Фоновые уведомления об оценках доступны в мобильном приложении
      </Placeholder>
    )}
  </Panel>
)

export default NotificationsSettings
