import { Icon28ChevronRightOutline } from '@vkontakte/icons'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { Group, Header, Panel, SimpleCell, Snackbar } from '@vkontakte/vkui'
import { type FC, useRef, useState } from 'react'

import { PAGE_SETTINGS_DEVELOPER } from '../../../app/routes'
import { PanelHeaderWithBack } from '../../../shared'
import { BETA_VERSION, IS_DEV } from '../../../shared/config'
import type { Props } from '../../types.ts'
import Legal from '../Legal'
import {
  DEVELOPER_UNLOCK_TAPS,
  isDeveloperModeUnlocked,
  unlockDeveloperMode
} from '../shared/developer'

const APP_VERSION = BETA_VERSION || '8.0.0'

const AboutSettings: FC<Props> = ({ id }) => {
  const routeNavigator = useRouteNavigator()
  const tapsRef = useRef(0)
  const [unlocked, setUnlocked] = useState(isDeveloperModeUnlocked)
  const [snackbar, setSnackbar] = useState<string | null>(null)

  const onVersionTap = () => {
    if (unlocked) {
      void routeNavigator.push(PAGE_SETTINGS_DEVELOPER)
      return
    }

    tapsRef.current += 1
    if (tapsRef.current >= DEVELOPER_UNLOCK_TAPS) {
      unlockDeveloperMode()
      setUnlocked(true)
      tapsRef.current = 0
      setSnackbar('Режим разработчика включён')
      return
    }

    const left = DEVELOPER_UNLOCK_TAPS - tapsRef.current
    if (left <= 3) {
      setSnackbar(`Ещё ${left}, чтобы открыть режим разработчика`)
    }
  }

  return (
    <Panel nav={id}>
      <PanelHeaderWithBack title='О приложении' />
      <Group header={<Header size='s'>Приложение</Header>}>
        <SimpleCell
          multiline
          subtitle={IS_DEV ? 'Сборка для разработки' : 'Дневник СПО'}
          onClick={onVersionTap}
        >
          Версия {APP_VERSION}
        </SimpleCell>
        {unlocked && (
          <SimpleCell
            multiline
            subtitle='Техническая информация и отладка'
            after={<Icon28ChevronRightOutline />}
            onClick={() => void routeNavigator.push(PAGE_SETTINGS_DEVELOPER)}
          >
            Для разработчиков
          </SimpleCell>
        )}
      </Group>
      <Legal />
      {snackbar && (
        <Snackbar onClosed={() => setSnackbar(null)}>{snackbar}</Snackbar>
      )}
    </Panel>
  )
}

export default AboutSettings
