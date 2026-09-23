import type { NotificationsResponse, Nullable } from '@diary-spo/shared'
import { Icon28ErrorCircleOutline } from '@vkontakte/icons'
import {
  Card,
  Div,
  Group,
  Header,
  Panel,
  Placeholder,
  PullToRefresh,
  Spinner,
  Text,
  Title
} from '@vkontakte/vkui'
import { formatDistance } from 'date-fns'
import { ru } from 'date-fns/locale'
import { type FC, useEffect, useState } from 'react'

import { handleResponse, isApiError } from '../shared'
import { getAds } from '../shared/api'
import { VKUI_RED } from '../shared/config'
import { useSnackbar } from '../shared/hooks'
import {
  ErrorPlaceholder,
  PanelHeaderWithBack,
  SubtitleWithBorder
} from '../shared/ui'
import type { Props } from './types.ts'

const updateCache = (ads: NotificationsResponse[]) => {
  localStorage.setItem('savedAds', JSON.stringify(ads))
  localStorage.setItem('lastFetchTime', String(Date.now()))
}

export const formatNotificationRelativeDate = (
  date: Date,
  now = new Date()
): string =>
  formatDistance(new Date(date), now, { addSuffix: true, locale: ru })

const Notifications: FC<Props> = ({ id }) => {
  const [notifications, setNotifications] =
    useState<Nullable<NotificationsResponse[]>>(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [snackbar, showSnackbar] = useSnackbar()
  console.info('notifications', notifications)
  const handleError = () => {
    setLoading(false)
    setIsError(true)
  }

  const fetchAds = async (isHandle?: boolean) => {
    setLoading(true)
    const cachedAds = localStorage.getItem('savedAds')

    if (!isHandle && cachedAds) {
      setNotifications(JSON.parse(cachedAds))
      setLoading(false)
      return
    }

    try {
      setIsError(false)
      const { data: ads } = await getAds()
      handleResponse(ads, handleError, handleError, setLoading, showSnackbar)

      if (isApiError(ads)) {
        showSnackbar({
          before: <Icon28ErrorCircleOutline fill={VKUI_RED} />,
          title: 'Ошибка при попытке загрузить объявления',
          action: 'Попробовать снова',
          onActionClick: () => fetchAds(true)
        })
        return
      }

      updateCache(ads)
      setNotifications(ads)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const cachedAds = localStorage.getItem('savedAds')

    if (!cachedAds) {
      fetchAds(true)
      return
    }

    setNotifications(JSON.parse(cachedAds) as NotificationsResponse[])
    showSnackbar({
      title: 'Данные взяты из кеша',
      action: 'Загрузить новые',
      onActionClick: () => fetchAds(true)
    })
  }, [])

  if (isLoading && !notifications) {
    return (
      <Div>
        <Spinner />
      </Div>
    )
  }

  return (
    <Panel nav={id}>
      <PanelHeaderWithBack title='Объявления' />
      <PullToRefresh onRefresh={() => fetchAds(true)} isFetching={isLoading}>
        <Div>
          {Boolean(notifications?.length) &&
            notifications?.map(
              ({
                title,
                id: _id,
                date,
                isForEmployees,
                isForParents,
                isForStudents,
                text
              }) => (
                <Group
                  key={_id}
                  description={
                    <div style={{ display: 'flex', gap: 10 }}>
                      {isForEmployees && (
                        <SubtitleWithBorder>Для работников</SubtitleWithBorder>
                      )}

                      {isForParents && (
                        <SubtitleWithBorder color='yellow-outline'>
                          Для родителей
                        </SubtitleWithBorder>
                      )}
                      {isForStudents && (
                        <SubtitleWithBorder color='green-outline'>
                          Для студентов
                        </SubtitleWithBorder>
                      )}
                    </div>
                  }
                  header={
                    <Header size='m'>
                      {new Date(date).toLocaleDateString('ru-RU')} (
                      {formatNotificationRelativeDate(date)})
                    </Header>
                  }
                >
                  <Card mode='shadow'>
                    <Div>
                      <Title level='3' Component='h3'>
                        {title}
                      </Title>
                      <Text>{text}</Text>
                    </Div>
                  </Card>
                </Group>
              )
            )}
        </Div>

        {Boolean(!notifications?.length && !isError) && (
          <Placeholder title='Объявлений нет' />
        )}
        {isError && <ErrorPlaceholder onClick={() => fetchAds(true)} />}
      </PullToRefresh>

      {snackbar}
    </Panel>
  )
}

export default Notifications
