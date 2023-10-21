import { FC, useEffect } from 'react';
import { PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { getCookie } from '../../methods';
import { MAIN_SETTINGS } from '../../routes';

const PanelHeaderWithBack: FC<{ title: string }> = ({ title }) => {
  const routeNavigator = useRouteNavigator();
  const storageCookie = localStorage.getItem('cookie');
  const { view } = useActiveVkuiLocation();

  useEffect(() => {
    getCookie().then((cookieValue) => {
      console.log(cookieValue);
      if ((!storageCookie || !cookieValue) && view !== MAIN_SETTINGS) {
        routeNavigator.replace('/');
      }
    });
  }, [view, localStorage, window.location]);

  return (
    <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>{title}</PanelHeader>
  );
};

export default PanelHeaderWithBack;
