import {
  ChangeEvent, FC, useEffect, useState,
} from 'react';
import {
  Button, FormItem, FormLayout, FormStatus, Group, Input, Panel, View,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import Hashes from 'jshashes';
import { Icon28DoorArrowLeftOutline, Icon28ErrorCircleOutline } from '@vkontakte/icons';
import { AuthData } from 'diary-shared';
import PanelHeaderWithBack from '../components/UI/PanelHeaderWithBack';
import { appStorageSet, getCookie } from '../methods';
import { VIEW_SCHEDULE } from '../routes';
import { useSnackbar } from '../hooks';

const LoginForm: FC<{ id: string }> = ({ id }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();

  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isDataInvalid, setIsDataInvalid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [snackbar, showSnackbar] = useSnackbar();

  const createErrorSnackbar = () => showSnackbar({
    icon: <Icon28ErrorCircleOutline fill='var(--vkui--color_icon_negative)' />,
    subtitle: 'Попробуйте заного или сообщите об ошибке',
    title: 'Ошибка при попытке авторизации',
  });

  useEffect(() => {
    const storageCookie = localStorage.getItem('cookie');
    console.log(storageCookie);
    setIsLoading(true);
    const getUserCookie = () => {
      getCookie().then((cookieValue) => {
        console.log(cookieValue);
        if (storageCookie || cookieValue) {
          routeNavigator.replace(`/${VIEW_SCHEDULE}`);
          setIsLoading(false);
          return;
        }

        setTimeout(() => {
          if (!storageCookie) {
            routeNavigator.replace('/');
            setIsLoading(false);
            showSnackbar({
              icon: <Icon28ErrorCircleOutline fill='var(--vkui--color_icon_negative)' />,
              subtitle: 'Заполни форму и войди в дневник',
              title: 'О вас нет данных, ты кто такой?',
            });
          }
        }, 500);
      });
    };

    getUserCookie();
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    const setStateAction = {
      login: setLogin,
      password: setPassword,
    }[name];
    setIsDataInvalid(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    setStateAction && setStateAction(value);
  };

  const loginPattern = /^[a-zA-Z0-9а-яА-ЯёЁ-]+$/;

  const handleLogin = async () => {
    if (!loginPattern.test(login)) {
      setIsDataInvalid(true);
      return;
    }

    const passwordHashed = (new Hashes.SHA256()).b64(password);

    setIsLoading(true);
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login,
        password: passwordHashed,
        isRemember: true,
      }),
    });

    if (response.status === 401) {
      setIsLoading(false);
      setIsDataInvalid(true);
      throw new Error('401');
    } else if (!response.ok) {
      showSnackbar({
        icon: <Icon28ErrorCircleOutline fill='var(--vkui--color_icon_negative)' />,
        title: 'Ошибка при попытке сделать запрос',
        subtitle: 'Попробуйте обновить страницу или обновите куки в настройках',
      });
      setIsLoading(false);
      createErrorSnackbar();
      throw new Error(`Failed to fetch login / status: ${response.status} / statusText: ${response.statusText}`);
    }

    const dataResp = await response.json() as AuthData;
    if (!String(dataResp.cookie)) {
      createErrorSnackbar();
    }

    try {
      const basePath = dataResp.data.tenants[dataResp.data.tenantName];

      const userId = String(basePath.studentRole.id);
      const { cookie } = dataResp;
      const name = ` ${String(basePath.lastName)} ${String(basePath.firstName)} ${String(basePath.middleName)}`;
      const org = String(basePath.settings.organization.abbreviation);
      const city = String(basePath.settings.organization.address.settlement);
      const group = String(basePath.students[0].groupName);

      localStorage.setItem('id', userId);
      localStorage.setItem('cookie', cookie);

      localStorage.setItem('log', login);
      localStorage.setItem('main', passwordHashed);

      const userData = {
        name,
        org,
        city,
        group,
      };

      await Promise.all([
        appStorageSet('log', login),
        appStorageSet('main', passwordHashed),
        appStorageSet('cookie', cookie),
        appStorageSet('id', userId),
        appStorageSet('data', JSON.stringify(userData)),
      ]);

      showSnackbar({
        title: 'Вхожу',
        subtitle: 'Подождите немного',
      });

      setTimeout(async () => {
        await routeNavigator.replace(`/${VIEW_SCHEDULE}`);
      }, 1500);
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const isLoginEmpty = login === '';
  const isPasswordEmpty = password === '';
  const isPasswordValid = password && !isPasswordEmpty;

  const loginTopText = isLoginEmpty
    ? 'Логин'
    : (loginPattern.test(login)
      ? 'Логин введён'
      : 'Введите корректный логин');
  const passwordTopText = password === ''
    ? 'Пароль'
    : (isPasswordValid
      ? 'Пароль введён'
      : 'Введите корректный пароль');

  return (
    <View
      id={id}
      history={panelsHistory}
      activePanel={activePanel as string}
      onSwipeBack={() => routeNavigator.back()}
    >
      <Panel nav={id}>
        <PanelHeaderWithBack title='Авторизация' />
        <Group>
          {isDataInvalid && (
            <FormStatus header='Некорректный данные' mode='error'>
              Проверьте правильность логина и пароля
            </FormStatus>
          )}
          <FormLayout>
            <FormItem
              required
              htmlFor='userLogin'
              top='Логин'
              status={isLoginEmpty ? 'default' : (loginPattern.test(login) ? 'valid' : 'error')}
              bottom={isLoginEmpty || loginTopText}
              bottomId='login-type'
            >
              <Input
                required
                aria-labelledby='login-type'
                id='userLogin'
                type='text'
                name='login'
                placeholder='Введите логин'
                value={login}
                onChange={onChange}
              />
            </FormItem>
            <FormItem
              top='Пароль'
              htmlFor='pass'
              status={isPasswordEmpty ? 'default' : (isPasswordValid ? 'valid' : 'error')}
              bottom={isPasswordEmpty || passwordTopText}
            >
              <Input
                name='password'
                id='pass'
                type='password'
                placeholder='Введите пароль'
                onChange={onChange}
              />
            </FormItem>
            <FormItem>
              <Button
                size='l'
                stretched
                onClick={() => handleLogin()}
                disabled={!password || !login || !loginPattern.test(login) || isLoading}
                before={<Icon28DoorArrowLeftOutline />}
              >
                {isLoading ? 'Пытаюсь войти...' : 'Войти'}
              </Button>
            </FormItem>
          </FormLayout>
          {snackbar}
        </Group>
      </Panel>
    </View>
  );
};

export default LoginForm;
