import { lazy } from 'react';
import { AdaptivityProvider, ConfigProvider, usePlatform } from '@vkontakte/vkui';
import { RouterProvider } from '@vkontakte/vk-mini-apps-router';
import bridge from '@vkontakte/vk-bridge';

import { ModalProvider } from './modals/ModalContext';

import { router } from './routes';

import Suspense from './components/UI/Suspense';

const NotFound = lazy(() => import('./components/UI/NotFound'));
const App = lazy(() => import('./App'));

bridge.send('VKWebAppInit');

const NotFoundCorrect = (
  <ConfigProvider>
    <NotFound />
  </ConfigProvider>
);

const AppWrapper = () => {
  const platform = usePlatform();

  return (
    <AdaptivityProvider>
      <RouterProvider router={router} notFound={NotFoundCorrect}>
        <Suspense id='app' mode='screen'>
          <ConfigProvider platform={platform}>
            <ModalProvider>
              <App />
            </ModalProvider>
          </ConfigProvider>
        </Suspense>
      </RouterProvider>
    </AdaptivityProvider>
  );
};

export default AppWrapper;
