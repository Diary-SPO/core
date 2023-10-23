import {
  Alert,
  CellButton, Group, Header, InfoRow, Panel, ScreenSpinner, SimpleCell, Subhead, Switch, View,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import {
  Icon28ClearDataOutline,
  Icon28DoorArrowRightOutline,
  Icon28HomeArrowDownOutline,
  Icon28IncognitoOutline,
  Icon28RefreshOutline,
  Icon28ThumbsUpCircleFillGreen,
} from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';
import { AuthData } from 'diary-shared';
import { useEffect, useRef, useState } from 'preact/hooks';
import { FunctionalComponent } from 'preact';
import { Storage } from '../types';
import PanelHeaderWithBack from '../components/UI/PanelHeaderWithBack';
import { useSnackbar } from '../hooks';
import logOut from '../utils/logOut';

interface ISettings {
  id: string,
}

const Settings: FunctionalComponent<ISettings> = ({ id }) => {
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
  const [isHomeScreenSupported, setIsHomeScreenSupported] = useState<boolean>(false);

  const switchRef = useRef(null);
  const [isSwitchChecked, setIsSwitchChecked] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  useEffect(() => {
    const allKeys = Object.keys(localStorage);

    const getCache = allKeys.map((key) => ({ key, value: localStorage.getItem(key) || 'false' }));
    setCacheData(getCache);
  }, []);

  const clearCache = () => {
    localStorage.clear();
    setCacheData([]);

    if (!snackbar) {
      cleatCacheSnackbar();
    }
  };

  const handleLogOut = () => {
    showSnackbar({
      title: 'Выход',
      //@ts-ignore типы React не совсем совместимы с Preact
      icon: <Icon28DoorArrowRightOutline color='var(--vkui--color_background_accent_themed)' />,
      subtitle: 'После удаления всех данных вы попадёте на страницу авторизации',
    });

    setTimeout(async () => {
      try {
        await logOut();
        await routeNavigator.replace('/');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }, 1500);
  };

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
        //@ts-ignore типы React не совсем совместимы с Preact
        {
          title: 'Отмена',
          autoClose: true,
          mode: 'cancel',
        },
        //@ts-ignore типы React не совсем совместимы с Preact
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
        //@ts-ignore типы React не совсем совместимы с Preact
        {
          title: 'Отмена',
          autoClose: true,
          mode: 'cancel',
        },
        //@ts-ignore типы React не совсем совместимы с Preact
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

  const reloadCookie = async () => {
    const login = localStorage.getItem('log');
    const password = localStorage.getItem('main');

    if (!login || !password) {
      showSnackbar({
        title: 'Чего-то не хватает',
        subtitle: 'Попробуйте перезайти в аккаунт или сообщите об ошибке',
      });
      return;
    }

    try {
      setIsLoading(true);
      //@ts-ignore типы React не совсем совместимы с Preact
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login,
          password,
          isRemember: true,
        }),
      });

      const data = await response.json() as AuthData;

      if (!data.cookie) {
        showSnackbar({
          title: 'Сервер вернул что-то плохое',
          subtitle: 'Попробуйте перезайти в аккаунт или сообщите об ошибке',
        });
        return;
      }

      localStorage.setItem('cookie', data.cookie);

      showSnackbar({
        title: 'Cookie обновлена',
        icon: <Icon28ThumbsUpCircleFillGreen />,
        subtitle: 'Не забывайте периодически это делать',
      });
    } catch (e) {
      showSnackbar({
        title: 'Ошибка на сервере',
        subtitle: 'Попробуйте перезайти в аккаунт или сообщите об ошибке',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      id={id}
      history={panelsHistory}
      activePanel={activePanel}
      onSwipeBack={() => routeNavigator.back()}
    >
      <Panel nav={id}>
        <PanelHeaderWithBack title='Настройки' />
        <Group header={<Header mode='secondary'>Действия</Header>}>
          {isLoading && <ScreenSpinner size='medium' />}
          <CellButton
            Component='label'
            //@ts-ignore типы React не совсем совместимы с Preact
            after={<Switch getRef={switchRef} defaultChecked />}
            onChange={() => setIsSwitchChecked(!isSwitchChecked)}
            before={<Icon28IncognitoOutline />}
          >
            Показывать тех. инфрмацию
          </CellButton>
          <CellButton
            before={<Icon28RefreshOutline />}
            onClick={reloadCookie}
          >
            Обновить cookie
          </CellButton>
          <CellButton
            before={<Icon28ClearDataOutline />}
            onClick={() => routeNavigator.showPopout(clearCachePopup)}
          >
            Очистить кеш
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
                //@ts-ignore типы React не совсем совместимы с Preact
                <Header mode='secondary' aside={<Subhead>Хранится в LocalStorage</Subhead>}>Кеш</Header>)}
            >
              {cacheData.map((item) => (
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
