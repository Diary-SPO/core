import { lazy } from 'react';
import { createRoot } from 'react-dom/client';

import '@vkontakte/vkui/dist/cssm/styles/themes.css';
import './index.css';

import Suspense from './components/Suspense';

const AppWrapper = lazy(() => import('./AppWrapper'));

const domNode = document.getElementById('root')!;
const root = createRoot(domNode);

root.render(
  <Suspense id='AppWrapper' mode='screen'>
    <AppWrapper />
  </Suspense>,
);
