import { FC } from 'react';
import { PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

const PanelHeaderWithBack: FC<{ title: string }> = ({ title }) => {
  const routeNavigator = useRouteNavigator();
  return (
    <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>{title}</PanelHeader>
  );
};

export default PanelHeaderWithBack;
