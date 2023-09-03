import { lazy } from 'react';
import { createRoot } from 'react-dom/client';
import bridge from '@vkontakte/vk-bridge';

import '@vkontakte/vkui/dist/cssm/styles/themes.css';
import './index.css';
import Suspense from './components/Suspense.tsx';

const AppWrapper = lazy(() => import('./AppWrapper.tsx'));

bridge.send('VKWebAppInit');

const domNode = document.getElementById('root')!;
const root = createRoot(domNode);

root.render(
  <Suspense id='AppWrapper' mode='screen'>
    <AppWrapper />
  </Suspense>,
);
