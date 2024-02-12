import { PanelHeaderWithBack, SubtitleWithBorder } from '@components'
import { VKUI_RED } from '@config'
import { NotificationsResponse } from '@diary-spo/shared'
import { useSnackbar } from '@hooks'
import { handleResponse } from '@utils'
import { Icon28ErrorCircleOutline } from '@vkontakte/icons'
import {
  Button,
  ButtonGroup,
  Card,
  Div,
  Group,
  Header,
  Link,
  Panel,
  Placeholder,
  Spinner,
  Text,
  Title
} from '@vkontakte/vkui'
import { FC } from 'preact/compat'
import { useEffect, useState } from 'preact/hooks'
import { getAds } from '../methods'

const updateCache = (ads: NotificationsResponse[]) => {
  localStorage.setItem('savedAds', JSON.stringify(ads))
  localStorage.setItem('lastFetchTime', String(Date.now()))
}

const Notifications: FC<{ id: string }> = ({ id }) => {
  const [notifications, setNotifications] = useState<
    NotificationsResponse[] | null
  >(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [snackbar, showSnackbar] = useSnackbar()

  const handleError = () => {
    setLoading(false)
    setIsError(true)
  }

  const fetchAds = async (isHandle?: boolean) => {
    setLoading(true)
    try {
      if (!isHandle) {
        const cachedAds = JSON.parse(localStorage.getItem('savedAds') || '')
        setNotifications(cachedAds)
      }

      const ads = await getAds()
      handleResponse(ads, handleError, handleError, setLoading, showSnackbar)

      if (ads instanceof Response) {
        return
      }

      updateCache(ads)
      setNotifications(ads)
    } catch (error) {
      showSnackbar({
        before: <Icon28ErrorCircleOutline fill={VKUI_RED} />,
        title: 'Ошибка при попытке загрузить объявления',
        action: 'Попробовать снова',
        onActionClick: () => fetchAds(true)
      })
      console.error('Ошибка при получении объявлений:', error)
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

  return (
    <Panel nav={id}>
      <PanelHeaderWithBack title='Объявления' />
      <Div>
        {notifications &&
          notifications?.length > 0 &&
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
                  <Header mode='tertiary'>
                    {new Date(date).toLocaleDateString()}
                  </Header>
                }
              >
                <Card mode='shadow'>
                  <Div>
                    {/*//@ts-ignore типы React не совсем совместимы с Preact*/}
                    <Title level='3' Component='h3'>
                      {title}
                    </Title>
                    {/*//@ts-ignore типы React не совсем совместимы с Preact*/}
                    <Text>{text}</Text>
                  </Div>
                </Card>
              </Group>
            )
          )}

        <Div>
          {isLoading && (
            <Div>
              <Spinner />
            </Div>
          )}
        </Div>

        <Div>
          {isError && (
            <Placeholder
              header='Ошибка при загрузке'
              action={
                <ButtonGroup mode='vertical' align='center'>
                  {/*// @ts-ignore Типы не совместимы */}
                  <Button size='s' onClick={() => fetchAds(true)}>
                    Попробовать снова
                  </Button>
                  {/*// @ts-ignore Типы не совместимы */}
                  <Link href='https://vk.me/diary_spo' target='_blank'>
                    Сообщить о проблеме
                  </Link>
                </ButtonGroup>
              }
            />
          )}
        </Div>

        <Div>
          {notifications && notifications?.length < 1 && (
            <Placeholder header='Объявлений нет' />
          )}
        </Div>
      </Div>
      {snackbar}
    </Panel>
  )
}

export default Notifications
