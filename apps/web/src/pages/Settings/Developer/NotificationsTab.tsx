import { backgroundGradeNotifications } from '@runtime-api'
import { Icon28Notifications } from '@vkontakte/icons'
import { CellButton, Group, Header, SimpleCell, Text } from '@vkontakte/vkui'
import type { FC } from 'react'

interface NotificationsTabProps {
  busy: boolean
  setBusy: (busy: boolean) => void
  onMessage: (title: string, subtitle?: string) => void
}

const NotificationsTab: FC<NotificationsTabProps> = ({
  busy,
  setBusy,
  onMessage
}) => {
  if (!backgroundGradeNotifications.supported) {
    return (
      <Group>
        <SimpleCell multiline>
          <Text style={{ color: 'var(--vkui--color_text_secondary)' }}>
            Фоновые уведомления только в Android-сборке
          </Text>
        </SimpleCell>
      </Group>
    )
  }

  return (
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
                const subtitle =
                  result.reason === 'noSession'
                    ? 'Нет сессии дневника в фоне — войдите ещё раз'
                    : result.reason === 'corrupt'
                      ? 'Снимок повреждён, попробуйте ещё раз'
                      : 'В ответе дневника нет оценок, которые можно забыть'
                onMessage('Нечего симулировать', subtitle)
                return
              }
              onMessage(
                'Проверка запущена',
                `${result.forgotten.subjectName}, ${result.forgotten.day}: ${result.forgotten.mark}`
              )
            } catch (error) {
              onMessage(
                'Ошибка',
                error instanceof Error ? error.message : 'Неизвестно'
              )
            } finally {
              setBusy(false)
            }
          })()
        }
      >
        Симулировать новую оценку
      </CellButton>
    </Group>
  )
}

export default NotificationsTab
