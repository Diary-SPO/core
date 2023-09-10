import {
  FC, useEffect, useRef, useState,
} from 'react';
import {
  Alert,
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
import { useSnackbar } from '../hooks';

interface ISettings {
  id: string,
}

export const clearVkStorage = async (excludeKey?: string) => {
  try {
    const keys = await getVkStorageKeys();

    for (const key of keys) {
      if (key !== excludeKey) {
        appStorageSet(key, '');
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const Settings: FC<ISettings> = ({ id }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();

  const [snackbar, showSnackbar] = useSnackbar();
  const cleatCacheSnackbar = () => {
    showSnackbar({
      title: 'Кеш очищен',
      subtitle: 'Необходимая информация загрузится при необходимости',
    });
  };

  const [cacheData, setCacheData] = useState<Storage[]>([]);
  const [vkCacheData, setVkCacheData] = useState<Storage[]>([]);
  const [isHomeScreenSupported, setIsHomeScreenSupported] = useState<boolean>(false);

  const switchRef = useRef(null);
  const [isSwitchChecked, setIsSwitchChecked] = useState<boolean>(true);

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

    if (!snackbar) {
      cleatCacheSnackbar();
    }
  };

  const handleLogOut = async () => {
    showSnackbar({
      title: 'Выхожу',
      icon: <Icon28DoorArrowRightOutline color='var(--vkui--color_background_accent_themed)' />,
      subtitle: 'После удаления всех данных страница обновится',
    });
    await clearVkStorage();

    setTimeout(() => {
      clearCache();
      location.reload();
    }, 1000);
  };

  useEffect(() => {
    const checkIsFeatureSupported = async () => {
      await bridge.send('VKWebAppAddToHomeScreenInfo')
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

  const clearCachePopup = (
    <Alert
      actions={[
        {
          title: 'Отмена',
          autoClose: true,
          mode: 'cancel',
        },
        {
          title: 'Удалить',
          autoClose: true,
          mode: 'destructive',
          action: () => clearCache(),
        },
      ]}
      actionsLayout='horizontal'
      onClose={() => routeNavigator.hidePopout()}
      header='Очистка кеша'
      text='После удаления кеша вся информация (оценки, расписание и тд) загрузится повторно.'
    />
  );

  const logOutPopup = (
    <Alert
      actions={[
        {
          title: 'Отмена',
          autoClose: true,
          mode: 'cancel',
        },
        {
          title: 'Выйти',
          autoClose: true,
          mode: 'destructive',
          action: () => handleLogOut(),
        },
      ]}
      actionsLayout='horizontal'
      onClose={() => routeNavigator.hidePopout()}
      header='Выход'
      text='Вы уверены, что хотите выйти из аккаунта?'
    />
  );

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
            onClick={() => routeNavigator.showPopout(clearCachePopup)}
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
            onClick={() => routeNavigator.showPopout(logOutPopup)}
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
        {snackbar}
      </Panel>
    </View>
  );
};

export default Settings;
