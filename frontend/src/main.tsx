import { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { AdaptivityProvider, ConfigProvider } from '@vkontakte/vkui';
import { RouterProvider } from '@vkontakte/vk-mini-apps-router';
import bridge from '@vkontakte/vk-bridge';

import Suspense from './components/Suspense';

import { router } from './routes';

import '@vkontakte/vkui/dist/cssm/styles/themes.css';
import './index.css';

const App = lazy(() => import('./App'));

bridge.send('VKWebAppInit');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AdaptivityProvider>
    <RouterProvider router={router} notFound={<div>404</div>}>
      <ConfigProvider>
        <Suspense id='app'>
          <App />
        </Suspense>
      </ConfigProvider>
    </RouterProvider>
  </AdaptivityProvider>,
);
