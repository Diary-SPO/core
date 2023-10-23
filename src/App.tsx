import {
  AppRoot, PanelHeader, ScreenSpinner, SplitCol, SplitLayout,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, usePopout, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { useInsets } from '@vkontakte/vk-bridge-react';
import { lazy } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';
import { MAIN_SETTINGS, VIEW_SCHEDULE } from './routes';
import { Pages } from './types';
import Suspense from './components/UI/Suspense';

const ModalRoot = lazy(() => import('./modals/ModalRoot'));
const Epic = lazy(() => import('./components/UI/Epic'));

const App = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const routeNavigator = useRouteNavigator();
  const modals = <ModalRoot />;
  const { view: activeView = MAIN_SETTINGS } = useActiveVkuiLocation();
  const cookieValue = localStorage.getItem('cookie');

  const routerPopout = usePopout();
  const vkBridgeInsets = useInsets() || undefined;

  useEffect(() => {
    const onRoute = async () => {
      if (!cookieValue) {
        await routeNavigator.replace('/');
        setIsLoading(false);
      } else if ((cookieValue) && activeView === MAIN_SETTINGS) {
        await routeNavigator.replace(`/${VIEW_SCHEDULE}`);
        setIsLoading(false);
      }
    };

    onRoute();
  }, [activeView, localStorage, window.location]);

  const onStoryChange = async (currentView: Pages) => {
    if (cookieValue) {
      try {
        await routeNavigator.push(`/${currentView}`);
        return;
      } catch (e) {
        console.error(e);
      }
    }
    await routeNavigator.replace('/');
  };

  return (
    <AppRoot safeAreaInsets={vkBridgeInsets}>
      <SplitLayout popout={routerPopout} modal={modals} header={<PanelHeader separator={false} />} style={{ justifyContent: 'center' }}>
        <Suspense id='Epic'>
          {isLoading && <ScreenSpinner size='large' />}
          <SplitCol width='100%' maxWidth='700px' stretchedOnMobile autoSpaced>
            <Epic onStoryChange={onStoryChange} />
          </SplitCol>
        </Suspense>
      </SplitLayout>
    </AppRoot>
  );
};

export default App;
