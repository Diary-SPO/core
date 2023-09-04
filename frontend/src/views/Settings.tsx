import {
  FC, ReactNode, useEffect, useState,
} from 'react';
import {
  Cell, CellButton, Group, Header, Panel, Snackbar, Subhead, usePlatform, View,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import {
  Icon28ClearDataOutline, Icon28DoorArrowRightOutline, Icon28ErrorCircleOutline, Icon28HomeArrowDownOutline
} from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';

import { Storage } from '../types';

import PanelHeaderWithBack from '../components/PanelHeaderWithBack';
import { appStorageSet, getVkStorageData, getVkStorageKeys } from '../methods';

interface ISettings {
  id: string,
}

const Settings: FC<ISettings> = ({ id }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();

  const [cacheData, setCacheData] = useState<Storage[]>([]);
  const [vkCacheData, setVkCacheData] = useState<Storage[]>([]);
  const [snackbar, setSnackbar] = useState<ReactNode | null>(null);

  const UnsuppoertedSnackbar = (
    <Snackbar
      onClose={() => setSnackbar(null)}
      before={<Icon28ErrorCircleOutline fill='var(--vkui--color_icon_negative)' />}
      subtitle='Если вы считаете это ошибкой, то сообщите нам'
    >
      Метод не подедрживается на вашем устройстве
    </Snackbar>
  );

  useEffect(() => {
    const allKeys = Object.keys(localStorage);

    const getCache = allKeys.map((key) => ({ key, value: localStorage.getItem(key) || 'false' }));
    setCacheData(getCache);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const keys = await getVkStorageKeys();
      const data = await getVkStorageData(keys);

      const updatedVkCacheData = data.keys.map((item) => {
        if (item.key === 'cookie') {
          return { ...item, value: 'secret' };
        }
        return item;
      });

      setVkCacheData(updatedVkCacheData);
    };

    fetchData();
  }, []);

  const clearCache = () => {
    localStorage.clear();
    setCacheData([]);
  };

  const logOut = async () => {
    await appStorageSet('cookie', '').then((result) => {
      console.log(result);
      if (result) {
        location.reload();
      }
    });
  };
  const platform = usePlatform();
  const isAndroid = platform === 'android';

  const addToHomeScreen = () => {
    bridge.send('VKWebAppAddToHomeScreen')
      .then((data) => {
        if (data.result) {
          console.log(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    bridge.send('VKWebAppAddToHomeScreenInfo')
      .then((data) => {
        console.log(data);
        if (data.is_added_to_home_screen) {
          console.log(data);
        } else if (!data.is_feature_supported) {
          setSnackbar(UnsuppoertedSnackbar);
        }
      })
      .catch((error) => {
        // Ошибка
        console.log(error);
      });
  };

  return (
    <View
      id={id}
      history={panelsHistory}
      activePanel={activePanel as string}
      onSwipeBack={() => routeNavigator.back()}
    >
      <Panel nav={id}>
        <PanelHeaderWithBack title='Настройки' />
        <Group header={<Header mode='secondary'>Действия</Header>}>
          <CellButton
            before={<Icon28ClearDataOutline />}
            onClick={clearCache}
          >
            Очистить кеш
          </CellButton>
          <CellButton
            before={<Icon28DoorArrowRightOutline />}
            onClick={logOut}
          >
            Выйти
          </CellButton>
          {isAndroid && (
          <CellButton
            before={<Icon28HomeArrowDownOutline />}
            onClick={addToHomeScreen}
          >
            Добавить на экран
          </CellButton>
          )}
        </Group>
        <Group
          header={(
            <Header mode='secondary' aside={<Subhead>Хранится в LocalStorage</Subhead>}>Кеш</Header>)}
        >
          {cacheData.map((item) => (
            <Cell key={item.key} indicator={item.value}>
              {item.key}
            </Cell>
          ))}
        </Group>
        <Group
          header={(
            <Header mode='secondary'>VK Storage</Header>)}
        >
          {vkCacheData.map((item) => (
            <Cell key={item.key} indicator={item.value}>
              {item.key}
            </Cell>
          ))}
        </Group>
        {snackbar}
      </Panel>
    </View>
  );
};

export default Settings;
