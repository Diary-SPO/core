import { appUpdater, backgroundGradeNotifications } from '@runtime-api'
import {
  Icon28DeleteOutline,
  Icon28DownloadOutline,
  Icon28Notifications,
  Icon28RefreshOutline,
  Icon28WarningTriangleOutline
} from '@vkontakte/icons'
import {
  CellButton,
  Group,
  Header,
  InfoRow,
  Panel,
  SimpleCell
} from '@vkontakte/vkui'
import { type FC, useEffect, useState } from 'react'

import { PanelHeaderWithBack } from '../../../shared'
import type { AppUpdateStatus } from '../../../shared/api/runtime/types'
import { useSnackbar } from '../../../shared/hooks'
import type { Props } from '../../types.ts'
import TechInfo from '../Actions/TechInfo'
import { clearAppCache } from '../shared/clearCache'

const DeveloperSettings: FC<Props> = ({ id }) => {
  const [snackbar, showSnackbar] = useSnackbar()
  const [refreshKey, setRefreshKey] = useState(0)
  const [status, setStatus] = useState<AppUpdateStatus>(() =>
    appUpdater.getStatus()
  )
  const [busy, setBusy] = useState(false)

  useEffect(() => appUpdater.subscribe(setStatus), [])

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

  const run = async (label: string, action: () => Promise<unknown>) => {
    setBusy(true)
    try {
      await action()
      showSnackbar({ title: label })
    } catch (error) {
      showSnackbar({
        title: 'Ошибка',
        subtitle: error instanceof Error ? error.message : 'Неизвестно'
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Panel nav={id}>
      <PanelHeaderWithBack title='Для разработчиков' />
      <Group header={<Header size='s'>Действия</Header>}>
        <CellButton before={<Icon28DeleteOutline />} onClick={clearCache}>
          Очистить кеш приложения
        </CellButton>
      </Group>

      {appUpdater.supported && (
        <Group
          header={<Header size='s'>Обновление интерфейса</Header>}
          description='Сценарии для проверки панели и бандлов'
        >
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
            Открыть панель обновления (даже без update)
          </CellButton>
          <CellButton
            before={<Icon28RefreshOutline />}
            disabled={busy}
            onClick={() =>
              void run('Проверка обновлений', () =>
                appUpdater.check({ silent: false })
              )
            }
          >
            Проверить и открыть панель при наличии
          </CellButton>
          <CellButton
            before={<Icon28DownloadOutline />}
            disabled={busy}
            onClick={() =>
              void run('Принудительное скачивание', () =>
                appUpdater.debugForceDownload()
              )
            }
          >
            Принудительно скачать обновление
          </CellButton>
          <CellButton
            before={<Icon28RefreshOutline />}
            disabled={busy || !status.downloadedVersion}
            onClick={() =>
              void run('Установка бандла', () => appUpdater.apply())
            }
          >
            Установить скачанный бандл
          </CellButton>
          <CellButton
            appearance='negative'
            before={<Icon28DeleteOutline />}
            disabled={busy}
            onClick={() =>
              void run('Сброс OTA-бандлов', () => appUpdater.reset())
            }
          >
            Удалить обновления (сброс к встроенному)
          </CellButton>
          <CellButton
            disabled={busy}
            onClick={() => {
              appUpdater.clearBadge()
              showSnackbar({ title: 'Бейдж обновления сброшен' })
            }}
          >
            Сбросить бейдж «есть обновление»
          </CellButton>
        </Group>
      )}

      {backgroundGradeNotifications.supported && (
        <Group header={<Header size='s'>Уведомления об оценках</Header>}>
          <CellButton
            before={<Icon28Notifications />}
            disabled={busy}
            onClick={() =>
              void (async () => {
                setBusy(true)
                try {
                  const result =
                    await backgroundGradeNotifications.debugRetestNotification()
                  if (!result.forgotten) {
                    showSnackbar({
                      title: 'Нет оценок в снимке',
                      subtitle:
                        result.reason === 'corrupt'
                          ? 'Снимок повреждён, дождитесь следующей проверки'
                          : 'Сначала дождитесь фоновой проверки'
                    })
                    return
                  }
                  showSnackbar({
                    title: 'Проверка запущена',
                    subtitle: `${result.forgotten.subjectName}, ${result.forgotten.day}: ${result.forgotten.mark}`
                  })
                } catch (error) {
                  showSnackbar({
                    title: 'Ошибка',
                    subtitle:
                      error instanceof Error ? error.message : 'Неизвестно'
                  })
                } finally {
                  setBusy(false)
                }
              })()
            }
          >
            Симулировать новую оценку
          </CellButton>
        </Group>
      )}

      <TechInfo key={refreshKey} />
      {snackbar}
    </Panel>
  )
}

export default DeveloperSettings
