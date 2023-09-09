import {
  FC, useEffect, useRef, useState,
} from 'react';
import {
  CellButton, Group, Header, InfoRow, Panel, SimpleCell, Subhead, Switch, View,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import {
  Icon28ClearDataOutline, Icon28DoorArrowRightOutline, Icon28HomeArrowDownOutline, Icon28IncognitoOutline,
} from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';

import { Storage } from '../types';
import {
  appStorageSet, getVkStorageData, getVkStorageKeys,
} from '../methods';

import PanelHeaderWithBack from '../components/UI/PanelHeaderWithBack';

interface ISettings {
  id: string,
}

const Settings: FC<ISettings> = ({ id }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();

  const [cacheData, setCacheData] = useState<Storage[]>([]);
  const [vkCacheData, setVkCacheData] = useState<Storage[]>([]);
  const [isHomeScreenSupported, setIsHomeScreenSupported] = useState<boolean>(false);

  const switchRef = useRef(null);
  const [isSwitchChecked, setIsSwitchChecked] = useState<boolean>(true);
  console.log(isSwitchChecked);
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

  useEffect(() => {
    const checkIsFeatureSupported = async () => {
      bridge.send('VKWebAppAddToHomeScreenInfo')
        .then(({ is_added_to_home_screen, is_feature_supported }) => {
          if (is_feature_supported) {
            setIsHomeScreenSupported(true);
          }
          if (is_added_to_home_screen) {
            console.log(is_added_to_home_screen);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    checkIsFeatureSupported();
  }, []);

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
            Component='label'
            after={<Switch getRef={switchRef} defaultChecked />}
            onChange={() => setIsSwitchChecked(!isSwitchChecked)}
            before={<Icon28IncognitoOutline />}
          >
            Показывать тех. инфрмацию
          </CellButton>
          <CellButton
            before={<Icon28DoorArrowRightOutline />}
            onClick={logOut}
          >
            Выйти
          </CellButton>
          {isHomeScreenSupported && (
            <CellButton
              before={<Icon28HomeArrowDownOutline />}
              onClick={addToHomeScreen}
            >
              Добавить на экран
            </CellButton>
          )}
        </Group>
        {isSwitchChecked
          && (
          <Group header={(<Header mode='secondary'>Техническая информация</Header>)}>
            <Group
              header={(
                <Header mode='secondary' aside={<Subhead>Хранится в LocalStorage</Subhead>}>Кеш</Header>)}
            >
              {cacheData.map((item) => (
                <SimpleCell key={item.key}>
                  <InfoRow header={item.key}>{item.value.slice(0, 30)}</InfoRow>
                </SimpleCell>
              ))}
            </Group>
            <Group
              header={(
                <Header mode='secondary'>VK Storage</Header>)}
            >
              {vkCacheData.map((item) => (
                <SimpleCell key={item.key}>
                  <InfoRow header={item.key}>{item.value.slice(0, 30)}</InfoRow>
                </SimpleCell>
              ))}
            </Group>
          </Group>
          )}
      </Panel>
    </View>
  );
};

export default Settings;
