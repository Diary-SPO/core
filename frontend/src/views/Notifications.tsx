import { FC, useEffect, useState } from 'react';
import {
  Button, ButtonGroup, Card, Div, Group, Header, Link, Panel, Placeholder, Spinner, Title, View, Text, Subhead,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Icon28ErrorCircleOutline } from '@vkontakte/icons';
import PanelHeaderWithBack from '../components/UI/PanelHeaderWithBack';
import { handleResponse } from '../utils/handleResponse';
import getAds from '../methods/server/getAds';
import { useSnackbar } from '../hooks';
import { NotificationsResponse } from '../../../shared';
import SubtitleWithBorder from '../components/SubtitleWithBorder';

const Notifications: FC<{ id: string }> = ({ id }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();

  const [adsData, setAdsData] = useState<NotificationsResponse[] | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [snackbar, showSnackbar] = useSnackbar();

  const updateCache = (ads: NotificationsResponse[]) => {
    localStorage.setItem('savedAds', JSON.stringify(ads));
    localStorage.setItem('lastFetchTime', String(Date.now()));
  };

  const fetchAds = async (isHandle?: boolean) => {
    setLoading(true);
    try {
      if (isHandle) {
        const ads = await getAds();
        console.log('asd', ads);
        handleResponse(
          ads,
          () => {
            setLoading(false);
            setIsError(true);
          },
          () => {
            showSnackbar({
              icon: <Icon28ErrorCircleOutline fill='var(--vkui--color_icon_negative)' />,
              title: 'Ошибка при попытке сделать запрос',
              subtitle: 'Сообщите нам об этом',
            });
            setIsError(true);
            setLoading(false);
          },
          () => {
            setLoading(false);
            setIsError(false);
          },
          showSnackbar,
        );

        updateCache(ads as NotificationsResponse[]);
        setAdsData(ads as NotificationsResponse[]);
      } else {
        console.log('кеш');
        const cachedAds = JSON.parse(localStorage.getItem('savedAds') || '[]');
        setAdsData(cachedAds);
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
    console.log(cachedAds);
    if (cachedAds) {
      setAdsData(JSON.parse(cachedAds));
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
      activePanel={activePanel as string}
      onSwipeBack={() => routeNavigator.back()}
    >
      <Panel nav={id}>
        <PanelHeaderWithBack title='Объявления' />
        <Div>
          {adsData && adsData?.length > 0 && (
            adsData?.map(({
              title, id, date, isForEmployees, isForParents, isForStudents, deleteInDays, text,
            }) => (
              <Group
                key={id}
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
                    <Title level='3'>{title}</Title>
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
            {isError
              && (
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
            {adsData && adsData?.length < 1 && <Placeholder header='Объявлений нет' />}
          </Div>
          {snackbar}
        </Div>
      </Panel>
    </View>
  );
};

export default Notifications;
