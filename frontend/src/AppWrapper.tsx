import { lazy } from 'react';
import { AdaptivityProvider, ConfigProvider, usePlatform } from '@vkontakte/vkui';
import { RouterProvider } from '@vkontakte/vk-mini-apps-router';
import bridge from '@vkontakte/vk-bridge';

import { ModalProvider } from './modals/ModalContext';

import NotFound from './components/NotFound';
import Suspense from './components/Suspense';

import { router } from './routes';

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
