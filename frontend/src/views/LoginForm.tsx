import {
  useState, FC, ChangeEvent, ReactNode, useEffect,
} from 'react';
import {
  Button, FormItem, FormLayout, Input, Group, Panel, View, FormStatus, ScreenSpinner, Snackbar,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import Hashes from 'jshashes';
import bridge from '@vkontakte/vk-bridge';
import { Icon28ErrorCircleOutline, Icon28DoorArrowLeftOutline } from '@vkontakte/icons';

import { AuthData } from '../../../shared';
import {VIEW_SCHEDULE} from '../routes';

import PanelHeaderWithBack from '../components/PanelHeaderWithBack';
import {getCookie} from "../methods";

const LoginForm: FC<{ id: string }> = ({ id }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();

  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isDataInvalid, setIsDataInvalid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [popout, setPopout] = useState<ReactNode | null>(null);
  const clearPopout = () => setPopout(null);
  
  const NoCookies = (
    <Snackbar
      onClose={() => setPopout(null)}
      before={<Icon28ErrorCircleOutline fill='var(--vkui--color_icon_negative)' />}
      subtitle='Заполни форму и войди в дневник'
    >
      О вас нет данных, ты кто такой?
    </Snackbar>
  );
  
  useEffect(() => {
    setIsLoading(true)
    getCookie().then((cookieValue) => {
      if (!cookieValue) {
        routeNavigator.replace('/');
        setIsLoading(false);
        setPopout(NoCookies)
      } else {
        routeNavigator.replace(`/${VIEW_SCHEDULE}`);
        setIsLoading(false);
      }
    });
  }, []);
  
  const ErrorSnackbar = (
    <Snackbar
      onClose={() => setPopout(null)}
      before={<Icon28ErrorCircleOutline fill='var(--vkui--color_icon_negative)' />}
      subtitle='Попробуйте заного или сообщите об ошибке'
    >
      Ошибка при попытке авторизации
    </Snackbar>
  );

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

  const loginPattern = /^[a-zA-Z0-9-]+$/;

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
        login,
        password: passwordHashed,
      },
    });

    if (response.status === 401) {
      console.log('401');
      setIsLoading(false);
      setErrorScreenSpinner();
      setIsDataInvalid(true);
      throw new Error('401');
    } else if (!response.ok) {
      setIsLoading(false);
      setPopout(ErrorSnackbar);
      setErrorScreenSpinner();
      throw new Error(`Failed to fetch login / status: ${response.status} / statusText: ${response.statusText}`);
    }

    const dataResp = await response.json() as AuthData;
    if (!String(dataResp.cookie)) {
      setPopout(ErrorSnackbar);
    }

    try {
      await bridge.send('VKWebAppStorageSet', {
        key: 'cookie',
        value: dataResp.cookie,
      })
        .then((data) => {
          if (data.result) {
            return data;
          }
        })
        .catch((error) => {
          console.error(error);
        });

      await bridge.send('VKWebAppStorageSet', {
        key: 'id',
        value: String(dataResp.data.tenants.SPO_23.studentRole.id),
      })
        .then((data) => {
          if (data.result) {
            console.log('id saved');
          }
        })
        .catch((error) => {
          console.error(error);
        });

      setIsLoading(false);
      await routeNavigator.replace(`/${VIEW_SCHEDULE}`);
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    }
  };

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
              status={login === '' ? 'default' : (loginPattern.test(login) ? 'valid' : 'error')}
              bottom={login === '' ? '' : (loginPattern.test(login) ? 'Логин введён' : 'Введите корректный логин')}
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
              status={password === '' ? 'default' : (password ? 'valid' : 'error')}
              bottom={password === '' ? '' : (password ? 'Пароль введён' : 'Введите корректный пароль')}
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
          {popout}
        </Group>
      </Panel>
    </View>
  );
};

export default LoginForm;
