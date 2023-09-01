import { useState, FC } from 'react';
import {
  Button, Checkbox, FormItem, FormLayout, Input, Link, Group, Panel, View,
} from '@vkontakte/vkui';

import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

import PanelHeaderWithBack from '../components/PanelHeaderWithBack';

const LoginForm: FC<{ id: string }> = ({ id }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();

  const [email, setEmail] = useState('');

  const onChange = (e) => {
    const { name, value } = e.currentTarget;

    const setStateAction = {
      email: setEmail,
    }[name];

    setStateAction && setStateAction(value);
  };

  return (
    <View
      id={id}
      history={panelsHistory}
      activePanel={activePanel as string}
      onSwipeBack={() => routeNavigator.back()}
    >
      <Panel nav={id}>
        <PanelHeaderWithBack title='Контакты' />
        <Group>
          <FormLayout>
            <FormItem
              htmlFor='email'
              top='E-mail'
              status={email ? 'valid' : 'error'}
              bottom={email ? 'Электронная почта введена верно!' : 'Пожалуйста, введите электронную почту'}
              bottomId='email-type'
            >
              <Input
                aria-labelledby='email-type'
                id='email'
                type='email'
                name='email'
                value={email}
                onChange={onChange}
              />
            </FormItem>

            <FormItem top='Пароль' htmlFor='pass'>
              <Input id='pass' type='password' placeholder='Введите пароль' />
            </FormItem>

            <Checkbox>
              Согласен со всем
              {' '}
              <Link>этим</Link>
            </Checkbox>
            <FormItem>
              <Button size='l' stretched>
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
