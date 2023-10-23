import {
  Button, ButtonGroup, Card, Div, Group, Header, Link, Panel, Placeholder, Spinner, Subhead, Text, Title, View,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Icon28ErrorCircleOutline } from '@vkontakte/icons';
import { NotificationsResponse } from 'diary-shared';
import { useEffect, useState } from 'preact/hooks';
import { FC } from 'preact/compat';
import PanelHeaderWithBack from '../components/UI/PanelHeaderWithBack';
import { handleResponse } from '../utils/handleResponse';
import { useSnackbar } from '../hooks';
import SubtitleWithBorder from '../components/SubtitleWithBorder';
import { getAds } from '../methods'

const Notifications: FC<{ id: string }> = ({ id }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();

  const [notifications, setNotifications] = useState<NotificationsResponse[] | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [snackbar, showSnackbar] = useSnackbar();

  const updateCache = (ads: NotificationsResponse[]) => {
    localStorage.setItem('savedAds', JSON.stringify(ads));
    localStorage.setItem('lastFetchTime', String(Date.now()));
  };

  const handleError = () => {
    setLoading(false);
    setIsError(true);
  };

  const fetchAds = async (isHandle?: boolean) => {
    setLoading(true);
    try {
      if (isHandle) {
        const ads = await getAds();
        handleResponse(
          ads,
          handleError,
          handleError,
          () => {
            setLoading(false);
            setIsError(false);
          },
          showSnackbar,
        );
        updateCache(ads as NotificationsResponse[]);
        setNotifications(ads as NotificationsResponse[]);
      } else {
        const cachedAds = JSON.parse(localStorage.getItem('savedAds') || '') as NotificationsResponse[] | null;
        setNotifications(cachedAds);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showSnackbar({
        icon: <Icon28ErrorCircleOutline fill='var(--vkui--color_icon_negative)' />,
        title: 'Ошибка при попытке загрузить объявления',
        action: 'Попробовать снова',
        onActionClick: () => fetchAds(true),
      });
      console.error('Ошибка при получении объявлений:', error);
    }
  };

  useEffect(() => {
    const cachedAds = localStorage.getItem('savedAds');

    if (cachedAds) {
      setNotifications(JSON.parse(cachedAds) as NotificationsResponse[]);
      showSnackbar({
        title: 'Данные взяты из кеша',
        action: 'Загрузить новые',
        onActionClick: () => fetchAds(true),
      });
    } else {
      fetchAds(true);
    }
  }, []);

  return (
    <View
      id={id}
      history={panelsHistory}
      activePanel={activePanel}
      onSwipeBack={() => routeNavigator.back()}
    >
      <Panel nav={id}>
        <PanelHeaderWithBack title='Объявления' />
        <Div>
          {notifications && notifications?.length > 0 && (
            notifications?.map(({
              title, id: _id, date, isForEmployees, isForParents, isForStudents, deleteInDays, text,
            }) => (
              <Group
                key={_id}
                description={(
                  <div style={{ display: 'flex', gap: 10 }}>
                    {isForEmployees && <SubtitleWithBorder>Для работников</SubtitleWithBorder>}
                    {isForParents && <SubtitleWithBorder color='yellow-outline'>Для родителей</SubtitleWithBorder>}
                    {isForStudents && <SubtitleWithBorder color='green-outline'>Для студентов</SubtitleWithBorder>}
                  </div>
                                )}
                header={(
                  <Header
                    mode='tertiary'
                    aside={(
                      //@ts-ignore типы React не совсем совместимы с Preact
                      <Subhead>
                        Удалится через
                        {' '}
                        {deleteInDays}
                        {' '}
                        дней
                      </Subhead>
                    )}
                  >
                    {new Date(date).toLocaleDateString()}
                  </Header>
)}
              >
                <Card mode='shadow'>
                  <Div>
                    {/*//@ts-ignore типы React не совсем совместимы с Preact*/}
                    <Title level='3'>{title}</Title>
                    {/*//@ts-ignore типы React не совсем совместимы с Preact*/}
                    <Text>{text}</Text>
                  </Div>
                </Card>
              </Group>
            ))
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
              action={(
                <ButtonGroup mode='vertical' align='center'>
                  <Button size='s' onClick={() => fetchAds(true)}>Попробовать снова</Button>
                  <Link href='https://vk.me/dnevnik_spo' target='_blank'>
                    Сообщить о проблеме
                  </Link>
                </ButtonGroup>
)}
            />
            )}
          </Div>

          <Div>
            {notifications && notifications?.length < 1 && <Placeholder header='Объявлений нет' />}
          </Div>
        </Div>
        {snackbar}
      </Panel>
    </View>
  );
};

export default Notifications;
