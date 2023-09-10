import { Div, Panel, View } from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PanelHeaderWithBack from '../components/UI/PanelHeaderWithBack';

const Attestation = ({ id }: { id: string }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();

  return (
    <View
      id={id}
      history={panelsHistory}
      activePanel={activePanel as string}
      onSwipeBack={() => routeNavigator.back()}
    >
      <Panel nav={id}>
        <PanelHeaderWithBack title='Аттестация' />
        <Div>
          аттестация
        </Div>
      </Panel>
    </View>
  );
};

export default Attestation;
