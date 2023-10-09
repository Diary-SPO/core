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
import { useLocalStorage } from './hooks';

const ModalRoot = lazy(() => import('./modals/ModalRoot'));
const Epic = lazy(() => import('./components/UI/Epic'));

const App = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { view: activeView = MAIN_SETTINGS } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();
  const modals = <ModalRoot />;
  // FIXME: remove this
  const [cookie, setCookie] = useLocalStorage('cookie', undefined);

  const routerPopout = usePopout();
  const vkBridgeInsets = useInsets() || undefined;

  useEffect(() => {
    setIsLoading(true);

    getCookie().then(async (cookieValue) => {
      if (!cookie && !cookieValue) {
        await routeNavigator.replace('/');
        setIsLoading(false);
      } else if ((cookieValue || cookie) && activeView === MAIN_SETTINGS) {
        await routeNavigator.replace(`/${VIEW_SCHEDULE}`);
        setIsLoading(false);
      }
    });

    setIsLoading(false);
  }, [activeView, localStorage]);

  const onStoryChange = async (currentView: Pages) => {
    const cookieValue = await getCookie();

    if (Boolean(cookie) || Boolean(cookieValue)) {
      try {
        await routeNavigator.push(`/${currentView}`);
        setCookie(cookieValue);
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
