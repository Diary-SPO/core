import {
  AppRoot,
  PanelHeader,
  Platform,
  SplitCol,
  SplitLayout,
  useAdaptivityConditionalRender,
  usePlatform,
} from '@vkontakte/vkui';
import { lazy, useEffect } from 'react';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import bridge from '@vkontakte/vk-bridge';

import { MAIN_SETTINGS, VIEW_SCHEDULE } from './routes';
import { Pages } from './types';

import Suspense from './components/Suspense';

const Sidebar = lazy(() => import('./components/Sidebar'));
const Epic = lazy(() => import('./components/Epic'));

const App = () => {
  const platform = usePlatform();
  const isVKCOM = platform !== Platform.VKCOM;

  const { viewWidth } = useAdaptivityConditionalRender();
  const { view: activeView = VIEW_SCHEDULE } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();

  useEffect(() => {
    bridge.send('VKWebAppStorageGet', {
      keys: ['cookie'],
    })
      .then((data) => {
        if (!data.keys[0].value) {
          routeNavigator.replace('/');
        } else if (data.keys[0].value && activeView === MAIN_SETTINGS) {
          routeNavigator.replace(`/${VIEW_SCHEDULE}`);
        }
      })
      .catch((error) => error);
  }, [window.location]);

  const onStoryChange = async (currentView: Pages) => {
    try {
      await bridge.send('VKWebAppStorageGet', {
        keys: ['cookie'],
      })
        .then((data) => {
          if (!data.keys[0].value) {
            routeNavigator.replace('/');
          } else {
            routeNavigator.push(`/${currentView}`);
          }
        })
        .catch((error) => error);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppRoot>
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
