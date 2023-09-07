import {
  useState, FC, ChangeEvent, ReactNode, useEffect,
} from 'react';
import {
  Button, FormItem, FormLayout, Input, Group, Panel, View, FormStatus, ScreenSpinner,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import Hashes from 'jshashes';
import { Icon28ErrorCircleOutline, Icon28DoorArrowLeftOutline } from '@vkontakte/icons';

import { AuthData } from '../../../shared';
import { appStorageSet, getCookie } from '../methods';
import { VIEW_SCHEDULE } from '../routes';

import { useSnackbar } from '../hooks';

import PanelHeaderWithBack from '../components/UI/PanelHeaderWithBack';

const LoginForm: FC<{ id: string }> = ({ id }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();

  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isDataInvalid, setIsDataInvalid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [_, setPopout] = useState<ReactNode | null>(null);
  const [snackbar, showSnackbar] = useSnackbar();

  const createErrorSnackbar = () => showSnackbar({
    icon: <Icon28ErrorCircleOutline fill='var(--vkui--color_icon_negative)' />,
    subtitle: 'Попробуйте заного или сообщите об ошибке',
    title: 'Ошибка при попытке авторизации',
  });

  const clearPopout = () => setPopout(null);

  useEffect(() => {
    setIsLoading(true);
    getCookie().then((cookieValue) => {
      if (!cookieValue) {
        routeNavigator.replace('/');
        setIsLoading(false);
        showSnackbar({
          icon: <Icon28ErrorCircleOutline fill='var(--vkui--color_icon_negative)' />,
          subtitle: 'Заполни форму и войди в дневник',
          title: 'О вас нет данных, ты кто такой?',
        });
      } else {
        routeNavigator.replace(`/${VIEW_SCHEDULE}`);
        setIsLoading(false);
      }
    });
  }, []);

  const setErrorScreenSpinner = () => {
    setPopout(<ScreenSpinner state='loading' />);

    setTimeout(() => {
      setPopout(<ScreenSpinner state='error'>Произошла ошибка</ScreenSpinner>);

      setTimeout(clearPopout, 300);
    }, 1);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    const setStateAction = {
      login: setLogin,
      password: setPassword,
    }[name];
    setIsDataInvalid(false);
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
    setPopout(<ScreenSpinner state='loading' />);
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        origin,
      },
      body: JSON.stringify({
        login,
        password: passwordHashed,
      }),
    });
    if (response.status === 401) {
      console.log('401');
      setIsLoading(false);
      setErrorScreenSpinner();
      setIsDataInvalid(true);
      throw new Error('401');
    } else if (!response.ok) {
      setIsLoading(false);
      createErrorSnackbar();
      setErrorScreenSpinner();
      throw new Error(`Failed to fetch login / status: ${response.status} / statusText: ${response.statusText}`);
    }

    const dataResp = await response.json() as AuthData;
    if (!String(dataResp.cookie)) {
      createErrorSnackbar();
    }

    try {
      await appStorageSet('cookie', dataResp.cookie);
      await appStorageSet('id', String(dataResp.data.tenants.SPO_23.studentRole.id));

      await appStorageSet('firstName', String(dataResp.data.tenants.SPO_23.firstName));
      await appStorageSet('lastName', String(dataResp.data.tenants.SPO_23.lastName));
      await appStorageSet('middleName', String(dataResp.data.tenants.SPO_23.middleName));
      await appStorageSet('org', String(dataResp.data.tenants.SPO_23.settings.organization.abbreviation));
      await appStorageSet('city', String(dataResp.data.tenants.SPO_23.settings.organization.address.settlement));

      await appStorageSet('group', String(dataResp.data.tenants.SPO_23.students[0].groupName));

      setIsLoading(false);
      await routeNavigator.replace(`/${VIEW_SCHEDULE}`);
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    }
  };

  const isLoginEmpty = login === '';
  const isPasswordEmpty = password === '';
  const isPasswordValid = password && !isPasswordEmpty;

  const loginTopText = isLoginEmpty ? 'Логин' : (loginPattern.test(login) ? 'Логин введён' : 'Введите корректный логин');
  const passwordTopText = password === '' ? 'Пароль' : (isPasswordValid ? 'Пароль введён' : 'Введите корректный пароль');

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
