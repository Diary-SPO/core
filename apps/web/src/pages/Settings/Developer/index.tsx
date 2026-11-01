import { Icon28DeleteOutline } from '@vkontakte/icons'
import { CellButton, Group, Header, Panel } from '@vkontakte/vkui'
import { type FC, useState } from 'react'

import { PanelHeaderWithBack } from '../../../shared'
import { useSnackbar } from '../../../shared/hooks'
import type { Props } from '../../types.ts'
import TechInfo from '../Actions/TechInfo'
import { clearAppCache } from '../shared/clearCache'

const DeveloperSettings: FC<Props> = ({ id }) => {
  const [snackbar, showSnackbar] = useSnackbar()
  const [refreshKey, setRefreshKey] = useState(0)

  const clearCache = () => {
    const removed = clearAppCache()
    setRefreshKey((key) => key + 1)
    showSnackbar({
      title: 'Кеш очищен',
      subtitle:
        removed > 0
          ? `Удалено записей: ${removed}`
          : 'Сохранённых данных не нашлось'
    })
  }

  return (
    <Panel nav={id}>
      <PanelHeaderWithBack title='Для разработчиков' />
      <Group header={<Header size='s'>Действия</Header>}>
        <CellButton before={<Icon28DeleteOutline />} onClick={clearCache}>
          Очистить кеш приложения
        </CellButton>
      </Group>
      <TechInfo key={refreshKey} />
      {snackbar}
    </Panel>
  )
}

export default DeveloperSettings
