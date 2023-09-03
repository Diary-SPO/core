import { lazy } from 'react';
import { AdaptivityProvider, ConfigProvider } from '@vkontakte/vkui';
import { RouterProvider } from '@vkontakte/vk-mini-apps-router';

import bridge from '@vkontakte/vk-bridge';
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

const AppWrapper = () => (
  <AdaptivityProvider>
    <RouterProvider router={router} notFound={NotFoundCorrect}>
      <Suspense id='app' mode='screen'>
        <ConfigProvider>
          <App />
        </ConfigProvider>
      </Suspense>
    </RouterProvider>
  </AdaptivityProvider>
);

export default AppWrapper;
