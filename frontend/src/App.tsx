import {
  AppRoot,
  PanelHeader, PanelSpinner,
  Platform,
  SplitCol,
  SplitLayout,
  useAdaptivityConditionalRender,
  usePlatform,
} from '@vkontakte/vkui';
import {lazy, useEffect, useState} from 'react';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

import { MAIN_SETTINGS, VIEW_SCHEDULE } from './routes';
import { getCookie } from './methods';
import { Pages } from './types';

import Suspense from './components/Suspense';

const Sidebar = lazy(() => import('./components/Sidebar'));
const Epic = lazy(() => import('./components/Epic'));

const App = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const platform = usePlatform();
  const isVKCOM = platform !== Platform.VKCOM;
  
  const { viewWidth } = useAdaptivityConditionalRender();
  const { view: activeView = MAIN_SETTINGS } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();
  
  useEffect(() => {
    setIsLoading(true)
    getCookie().then((cookieValue) => {
      if (!cookieValue) {
        routeNavigator.replace('/');
        setIsLoading(false);
      } else if (cookieValue && activeView === MAIN_SETTINGS) {
        routeNavigator.replace(`/${VIEW_SCHEDULE}`);
        setIsLoading(false);
      }
    });
    setIsLoading(false)
  }, [window.location]);

  const onStoryChange = async (currentView: Pages) => {
    try {
      const cookieValue = await getCookie();
      if (!cookieValue) {
        routeNavigator.replace('/');
      } else {
        routeNavigator.push(`/${currentView}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppRoot>
      {isLoading && <PanelSpinner />}
      <SplitLayout header={<PanelHeader separator={false} />} style={{ justifyContent: 'center' }}>
        {viewWidth.tabletPlus && (
          <SplitCol className={viewWidth.tabletPlus.className} fixed width={280} maxWidth={280}>
            {isVKCOM && <PanelHeader /> }
            <Suspense id='sidebar'>
              <Sidebar activeView={activeView as Pages} onStoryChange={onStoryChange} />
            </Suspense>
          </SplitCol>
        )}
        <Suspense id='Epic'>
          <SplitCol width='100%' maxWidth='700px' stretchedOnMobile autoSpaced>
            <Epic onStoryChange={onStoryChange} />
          </SplitCol>
        </Suspense>
      </SplitLayout>
    </AppRoot>
  );
};

export default App;
