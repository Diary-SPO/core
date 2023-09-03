import { lazy } from 'react';
import { AdaptivityProvider } from '@vkontakte/vkui';
import { RouterProvider } from '@vkontakte/vk-mini-apps-router';

import NotFound from './components/NotFound';
import Suspense from './components/Suspense';

import { router } from './routes';

const App = lazy(() => import('./App'));

const AppWrapper = () => (
  <AdaptivityProvider>
    <RouterProvider router={router} notFound={<NotFound />}>
      <Suspense id='app' mode='screen'>
        <App />
      </Suspense>
    </RouterProvider>
  </AdaptivityProvider>
);

export default AppWrapper;
