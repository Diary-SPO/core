import {
  AppRoot, PanelHeader, PanelSpinner, SplitCol, SplitLayout,
} from '@vkontakte/vkui';
import { lazy, useEffect, useState } from 'react';
import { useActiveVkuiLocation, usePopout, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { useInsets } from '@vkontakte/vk-bridge-react';
import { Icon32PrometeyCircleFillRed } from '@vkontakte/icons';
import { MAIN_SETTINGS, VIEW_SCHEDULE, VIEW_SETTINGS } from './routes';
import { getCookie, getVkStorageData } from './methods';
import { Pages } from './types';
import Suspense from './components/UI/Suspense';
import useSnackbar from './hooks/useSnackbar';
import logOut from './utils/logOut';

const ModalRoot = lazy(() => import('./modals/ModalRoot'));
const Epic = lazy(() => import('./components/UI/Epic'));

const App = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [snackbar, showSnackbar] = useSnackbar();
  const { view: activeView = MAIN_SETTINGS } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();

  const modals = <ModalRoot />;

  useEffect(() => {
    setIsLoading(true);
    getCookie().then((cookieValue) => {
      if (!cookieValue || !localStorage.getItem('cookie')) {
        routeNavigator.replace('/');
        setIsLoading(false);
      } else if (cookieValue && activeView === MAIN_SETTINGS) {
        routeNavigator.replace(`/${VIEW_SCHEDULE}`);
        setIsLoading(false);
      }
    });

    setIsLoading(false);
  }, [window.location]);

  useEffect(() => {
    if (activeView === MAIN_SETTINGS || activeView === VIEW_SETTINGS) {
      return;
    }

    const getData = async () => {
      const data = await getVkStorageData(['log', 'main', 'name']);
      let logoutTimer: NodeJS.Timeout | null = null;

      data.keys.map((key) => {
        if (key.value === '') {
          const openInvalidData = () => {
            showSnackbar({
              title: 'Данные устарели',
              icon: <Icon32PrometeyCircleFillRed fill='#fff' width={32} height={32} />,
              subtitle: 'Через 5 секунд произойдет автоматический выход из аккаунта, поэтому ищите листок с паролем',
            });

            logoutTimer = setTimeout(async () => {
              await logOut();
            }, 5000);

            return () => {
              if (logoutTimer) {
                clearTimeout(logoutTimer);
              }
            };
          };

          openInvalidData();
        }
      });

      console.log(data);
      return data;
    };
    getData();
  }, []);

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

  const routerPopout = usePopout();
  const vkBridgeInsets = useInsets() || undefined;
  return (
    <AppRoot safeAreaInsets={vkBridgeInsets}>
      {isLoading && <PanelSpinner />}
      <SplitLayout popout={routerPopout} modal={modals} header={<PanelHeader separator={false} />} style={{ justifyContent: 'center' }}>
        <Suspense id='Epic'>
          <SplitCol width='100%' maxWidth='700px' stretchedOnMobile autoSpaced>
            {snackbar}
            <Epic onStoryChange={onStoryChange} />
          </SplitCol>
        </Suspense>
      </SplitLayout>
    </AppRoot>
  );
};

export default App;
