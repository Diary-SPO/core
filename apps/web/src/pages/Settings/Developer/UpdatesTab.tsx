import { appUpdater } from '@runtime-api'
import {
  Icon28DeleteOutline,
  Icon28DownloadOutline,
  Icon28RefreshOutline,
  Icon28WarningTriangleOutline
} from '@vkontakte/icons'
import {
  CellButton,
  Group,
  Header,
  InfoRow,
  SimpleCell,
  Text
} from '@vkontakte/vkui'
import { type FC, useEffect, useState } from 'react'

import type { AppUpdateStatus } from '../../../shared/api/runtime/types'

interface UpdatesTabProps {
  busy: boolean
  onRun: (label: string, action: () => Promise<unknown>) => void
  onMessage: (title: string) => void
}

const UpdatesTab: FC<UpdatesTabProps> = ({ busy, onRun, onMessage }) => {
  const [status, setStatus] = useState<AppUpdateStatus>(() =>
    appUpdater.getStatus()
  )

  useEffect(() => appUpdater.subscribe(setStatus), [])

  if (!appUpdater.supported) {
    return (
      <Group>
        <SimpleCell multiline>
          <Text style={{ color: 'var(--vkui--color_text_secondary)' }}>
            OTA доступен только в Android-сборке
          </Text>
        </SimpleCell>
      </Group>
    )
  }

  return (
    <Group header={<Header size='s'>Обновление интерфейса</Header>}>
      <SimpleCell multiline>
        <InfoRow header='Канал'>{status.channel}</InfoRow>
      </SimpleCell>
      <SimpleCell multiline>
        <InfoRow header='Текущий бандл'>{status.currentVersion}</InfoRow>
      </SimpleCell>
      <SimpleCell multiline>
        <InfoRow header='Native versionCode'>
          {status.nativeVersionCode || '—'}
        </InfoRow>
      </SimpleCell>
      <SimpleCell multiline>
        <InfoRow header='Статус'>
          {status.kind}
          {status.available ? ` → ${status.available.version}` : ''}
          {status.downloadedVersion
            ? ` (скачано ${status.downloadedVersion})`
            : ''}
        </InfoRow>
      </SimpleCell>
      {status.lastError && (
        <SimpleCell multiline>
          <InfoRow header='Ошибка'>{status.lastError}</InfoRow>
        </SimpleCell>
      )}

      <CellButton
        before={<Icon28WarningTriangleOutline />}
        disabled={busy}
        onClick={() => appUpdater.debugOpenPrompt({ force: true })}
      >
        Открыть панель обновления
      </CellButton>
      <CellButton
        before={<Icon28RefreshOutline />}
        disabled={busy}
        onClick={() =>
          void onRun('Проверка обновлений', () =>
            appUpdater.check({ silent: false })
          )
        }
      >
        Проверить обновления
      </CellButton>
      <CellButton
        before={<Icon28DownloadOutline />}
        disabled={busy}
        onClick={() =>
          void onRun('Принудительное скачивание', () =>
            appUpdater.debugForceDownload()
          )
        }
      >
        Принудительно скачать
      </CellButton>
      <CellButton
        before={<Icon28RefreshOutline />}
        disabled={busy || !status.downloadedVersion}
        onClick={() => void onRun('Установка бандла', () => appUpdater.apply())}
      >
        Установить скачанный бандл
      </CellButton>
      <CellButton
        appearance='negative'
        before={<Icon28DeleteOutline />}
        disabled={busy}
        onClick={() => void onRun('Сброс OTA', () => appUpdater.reset())}
      >
        Сброс к встроенному
      </CellButton>
      <CellButton
        disabled={busy}
        onClick={() => {
          appUpdater.clearBadge()
          onMessage('Бейдж обновления сброшен')
        }}
      >
        Сбросить бейдж
      </CellButton>
    </Group>
  )
}

export default UpdatesTab
