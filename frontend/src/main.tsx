import {lazy} from "react";
import ReactDOM from 'react-dom/client';
import { AdaptivityProvider } from '@vkontakte/vkui';
import { RouterProvider } from '@vkontakte/vk-mini-apps-router';
import bridge from '@vkontakte/vk-bridge';

const App = lazy(() => import('./App'));

import { router } from './routes';

import '@vkontakte/vkui/dist/cssm/styles/themes.css';
import './index.css';
import Suspense from "./components/Suspense.tsx";

bridge.send('VKWebAppInit');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AdaptivityProvider>
    <RouterProvider router={router} notFound={<div>404</div>}>
      <Suspense id='app'>
        <App />
      </Suspense>
    </RouterProvider>
  </AdaptivityProvider>,
);
