import {
  Icon28DeleteOutline,
  Icon28DoorArrowRightOutline
} from '@vkontakte/icons'
import { CellButton, Group, Header } from '@vkontakte/vkui'
import type { FC } from 'react'

import TechInfo from '../Actions/TechInfo'
import { clearAppCache } from '../shared/clearCache'

interface GeneralTabProps {
  refreshKey: number
  onCacheCleared: (removed: number) => void
  onLockDeveloperMode: () => void
}

const GeneralTab: FC<GeneralTabProps> = ({
  refreshKey,
  onCacheCleared,
  onLockDeveloperMode
}) => (
  <>
    <Group header={<Header size='s'>Действия</Header>}>
      <CellButton
        before={<Icon28DeleteOutline />}
        onClick={() => onCacheCleared(clearAppCache())}
      >
        Очистить кеш приложения
      </CellButton>
      <CellButton
        appearance='negative'
        before={<Icon28DoorArrowRightOutline />}
        onClick={onLockDeveloperMode}
      >
        Выключить режим разработчика
      </CellButton>
    </Group>
    <TechInfo key={refreshKey} />
  </>
)

export default GeneralTab
