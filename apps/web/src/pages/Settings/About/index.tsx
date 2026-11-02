import { appUpdater, getAppVersion } from '@runtime-api'
import { Icon28ChevronRightOutline } from '@vkontakte/icons'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import {
  Badge,
  Group,
  Header,
  Panel,
  SegmentedControl,
  SimpleCell,
  Snackbar
} from '@vkontakte/vkui'
import { type FC, useEffect, useRef, useState } from 'react'

import { PAGE_SETTINGS_DEVELOPER } from '../../../app/routes'
import { PanelHeaderWithBack } from '../../../shared'
import type {
  AppUpdateChannel,
  AppUpdateStatus
} from '../../../shared/api/runtime/types'
import { APP_VERSION, IS_DEV } from '../../../shared/config'
import type { Props } from '../../types.ts'
import Legal from '../Legal'
import {
  DEVELOPER_UNLOCK_TAPS,
  isDeveloperModeUnlocked,
  unlockDeveloperMode
} from '../shared/developer'

const CHANNEL_OPTIONS = [
  { label: 'Стабильная', value: 'stable' },
  { label: 'Бета', value: 'beta' }
] as const

const AboutSettings: FC<Props> = ({ id }) => {
  const routeNavigator = useRouteNavigator()
  const tapsRef = useRef(0)
  const [unlocked, setUnlocked] = useState(isDeveloperModeUnlocked)
  const [snackbar, setSnackbar] = useState<string | null>(null)
  const [version, setVersion] = useState(APP_VERSION)
  const [updateStatus, setUpdateStatus] = useState<AppUpdateStatus>(() =>
    appUpdater.getStatus()
  )
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    void getAppVersion()
      .then(setVersion)
      .catch(() => setVersion(APP_VERSION))
  }, [])

  useEffect(() => appUpdater.subscribe(setUpdateStatus), [])

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

  const onChannelChange = async (value: string) => {
    const channel = value as AppUpdateChannel
    const status = await appUpdater.setChannel(channel)
    setUpdateStatus(status)
    setSnackbar(
      channel === 'beta'
        ? 'Включён бета-канал обновлений'
        : 'Включён стабильный канал обновлений'
    )
    void appUpdater.check({ silent: true })
  }

  const onCheckUpdates = async () => {
    setChecking(true)
    try {
      const status = await appUpdater.check({ silent: false })
      setUpdateStatus(status)
      if (status.kind === 'none') {
        setSnackbar('Обновлений нет')
      } else if (status.kind === 'native') {
        setSnackbar('Нужно обновление из RuStore')
      } else if (
        status.badge ||
        status.kind === 'web' ||
        status.kind === 'ready'
      ) {
        setSnackbar(
          `Доступно: ${status.available?.version ?? status.downloadedVersion}`
        )
      }
    } finally {
      setChecking(false)
    }
  }

  const onOpenReady = () => {
    appUpdater.clearBadge()
    appUpdater.debugOpenPrompt()
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
          Версия {version}
        </SimpleCell>
        {appUpdater.supported && (
          <SimpleCell
            multiline
            subtitle={
              updateStatus.kind === 'ready'
                ? 'Скачано и готово к установке'
                : updateStatus.badge
                  ? 'Есть новое обновление'
                  : 'Проверить обновления интерфейса'
            }
            indicator={
              updateStatus.badge || updateStatus.kind === 'ready' ? (
                <Badge mode='prominent'>1</Badge>
              ) : undefined
            }
            after={<Icon28ChevronRightOutline />}
            disabled={checking}
            onClick={() =>
              updateStatus.badge || updateStatus.kind === 'ready'
                ? onOpenReady()
                : void onCheckUpdates()
            }
          >
            {updateStatus.badge || updateStatus.kind === 'ready'
              ? 'Установить обновление'
              : 'Проверить обновления'}
          </SimpleCell>
        )}
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

      {appUpdater.supported && (
        <Group
          header={<Header size='s'>Канал обновлений</Header>}
          description='Бета — ранний доступ к новым функциям'
        >
          <div style={{ padding: '4px 16px 12px' }}>
            <SegmentedControl
              size='m'
              value={updateStatus.channel}
              onChange={(value) => void onChannelChange(String(value))}
              options={[...CHANNEL_OPTIONS]}
            />
          </div>
        </Group>
      )}

      <Legal />
      {snackbar && (
        <Snackbar onClosed={() => setSnackbar(null)}>{snackbar}</Snackbar>
      )}
    </Panel>
  )
}

export default AboutSettings
