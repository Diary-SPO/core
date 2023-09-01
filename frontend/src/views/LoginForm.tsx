import {useState, FC, FormEvent} from 'react';
import {
  Button, Checkbox, FormItem, FormLayout, Input, Link, Group, Panel, View,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import Hashes from 'jshashes';

import PanelHeaderWithBack from '../components/PanelHeaderWithBack';

const LoginForm: FC<{ id: string }> = ({ id }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const onChange = (e) => {
    const { name, value } = e.currentTarget;
    console.log(name);
    const setStateAction = {
      login: setLogin,
      password: setPassword,
    }[name];

    setStateAction && setStateAction(value);
  };

  const handleLogin = async () => {
    console.log(password);
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
              top='E-mail'
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
            <Checkbox>
              Согласен со всем
              {' '}
              <Link>этим</Link>
            </Checkbox>
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
