import {
  AppRoot, PanelHeader, ScreenSpinner, SplitCol, SplitLayout,
} from '@vkontakte/vkui';
import { lazy, useEffect, useState } from 'react';
import { useActiveVkuiLocation, usePopout, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { useInsets } from '@vkontakte/vk-bridge-react';
import { MAIN_SETTINGS, VIEW_SCHEDULE } from './routes';
import { getCookie } from './methods';
import { Pages } from './types';
import Suspense from './components/UI/Suspense';

const ModalRoot = lazy(() => import('./modals/ModalRoot'));
const Epic = lazy(() => import('./components/UI/Epic'));

const App = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { view: activeView = MAIN_SETTINGS } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();
  const modals = <ModalRoot />;

  const routerPopout = usePopout();
  const vkBridgeInsets = useInsets() || undefined;

  const handleStorageChange = (event: Event) => {
    if (!(event instanceof StorageEvent && event.key === 'your_storage_key') || !(event instanceof Event && event.type === 'hashchange')) {
      return;
    }
    setIsLoading(true);

    getCookie().then(async (cookieValue) => {
      if (!cookieValue) {
        await routeNavigator.replace('/');
        setIsLoading(false);
      } else if ((cookieValue) && activeView === MAIN_SETTINGS) {
        await routeNavigator.replace(`/${VIEW_SCHEDULE}`);
        setIsLoading(false);
      }
    });

    setIsLoading(false);
  };

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('hashchange', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('hashchange', handleStorageChange);
    };
  }, [activeView, localStorage, window.location]);

  const onStoryChange = async (currentView: Pages) => {
    const cookieValue = await getCookie();

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
