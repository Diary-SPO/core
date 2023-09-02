import { useState, FC, ChangeEvent } from 'react';
import {
  Button, FormItem, FormLayout, Input, Group, Panel, View,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import Hashes from 'jshashes';

import bridge from '@vkontakte/vk-bridge';
import PanelHeaderWithBack from '../components/PanelHeaderWithBack';
import { VIEW_SCHEDULE } from '../routes';

interface AuthData {
  cookie: string
  data: {
    installName: string
    localNetwork: boolean
    tenantName: string
    tenants: {
      SPO_23: {
        firstName: string
        isTrusted: boolean
        lastName: string
        middleName: string
        studentRole: {
          id: number
          studentGroupId: number
        }
        // TODO: Типизировать это потом
      }
    }
  }
}

const LoginForm: FC<{ id: string }> = ({ id }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();

  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    const setStateAction = {
      login: setLogin,
      password: setPassword,
    }[name];

    setStateAction && setStateAction(value);
  };

  const handleLogin = async () => {
    const passwordHashed = (new Hashes.SHA256()).b64(password);
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        login,
        password: passwordHashed,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch login');
    }
    const dataResp = await response.json() as AuthData;

    try {
      await bridge.send('VKWebAppStorageSet', {
        key: 'cookie',
        value: dataResp.cookie,
      })
        .then((data) => {
          if (data.result) {
            console.log('куки сохранены');
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

      await routeNavigator.replace(`/${VIEW_SCHEDULE}`);
    } catch (e) {
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
          <FormLayout>
            <FormItem
              htmlFor='userLogin'
              top='Логин'
              status={login ? 'valid' : 'error'}
              bottom={login ? 'Логин введён' : 'Пожалуйста, введите логин'}
              bottomId='login-type'
            >
              <Input
                aria-labelledby='login-type'
                id='userLogin'
                type='text'
                name='login'
                value={login}
                onChange={onChange}
              />
            </FormItem>
            <FormItem top='Пароль' htmlFor='pass'>
              <Input name='password' id='pass' type='password' placeholder='Введите пароль' onChange={onChange} />
            </FormItem>
            <FormItem>
              <Button size='l' stretched onClick={() => handleLogin()}>
                Войти
              </Button>
            </FormItem>
          </FormLayout>
        </Group>
      </Panel>
    </View>
  );
};

export default LoginForm;
