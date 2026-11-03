import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { Group, HorizontalScroll, Panel, Tabs, TabsItem } from '@vkontakte/vkui'
import { type FC, useState } from 'react'

import { PAGE_SETTINGS_ABOUT } from '../../../app/routes/constants'
import { PanelHeaderWithBack } from '../../../shared'
import { useSnackbar } from '../../../shared/hooks'
import type { Props } from '../../types.ts'
import { lockDeveloperMode } from '../shared/developer'
import GeneralTab from './GeneralTab'
import LogsTab from './LogsTab'
import NotificationsTab from './NotificationsTab'
import UpdatesTab from './UpdatesTab'

import { clearAppLogs } from '../../../shared/utils/appLog'
type DeveloperTab = 'general' | 'updates' | 'notifications' | 'logs'

const TABS: Array<{ id: DeveloperTab; label: string }> = [
  { id: 'general', label: 'Общее' },
  { id: 'updates', label: 'OTA' },
  { id: 'notifications', label: 'Пуши' },
  { id: 'logs', label: 'Логи' }
]

const DeveloperSettings: FC<Props> = ({ id }) => {
  const routeNavigator = useRouteNavigator()
  const [snackbar, showSnackbar] = useSnackbar()
  const [refreshKey, setRefreshKey] = useState(0)
  const [busy, setBusy] = useState(false)
  const [tab, setTab] = useState<DeveloperTab>('general')

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

  const disableDeveloperMode = async () => {
    lockDeveloperMode()
    showSnackbar({ title: 'Режим разработчика выключен' })
    await routeNavigator.replace(PAGE_SETTINGS_ABOUT)
  }

  return (
    clearAppLogs()
    <Panel nav={id}>
      <PanelHeaderWithBack title='Для разработчиков' />

      <Group>
        <Tabs mode='default'>
          <HorizontalScroll arrowSize='m'>
            {TABS.map((item) => (
              <TabsItem
                key={item.id}
                id={item.id}
                selected={tab === item.id}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </TabsItem>
            ))}
          </HorizontalScroll>
        </Tabs>
      </Group>

      {tab === 'general' && (
        <GeneralTab
          refreshKey={refreshKey}
          onCacheCleared={(removed) => {
            setRefreshKey((key) => key + 1)
            showSnackbar({
              title: 'Кеш очищен',
              subtitle:
                removed > 0
                  ? `Удалено записей: ${removed}`
                  : 'Сохранённых данных не нашлось'
            })
          }}
          onLockDeveloperMode={() => void disableDeveloperMode()}
        />
      )}
      {tab === 'updates' && (
        <UpdatesTab
          busy={busy}
          onRun={run}
          onMessage={(title) => showSnackbar({ title })}
        />
      )}
      {tab === 'notifications' && (
        <NotificationsTab
          busy={busy}
          setBusy={setBusy}
          onMessage={(title, subtitle) => showSnackbar({ title, subtitle })}
        />
      )}
      {tab === 'logs' && <LogsTab />}

      {snackbar}
    </Panel>
  )
}

export default DeveloperSettings
