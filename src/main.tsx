import { render } from 'preact';
import './index.css';
import '@vkontakte/vkui/dist/vkui.css';
import Suspense from './components/UI/Suspense.tsx';
import AppWrapper from './AppWrapper.tsx';

render(<Suspense id='AppWrapper' mode='screen'>
  <AppWrapper />
       </Suspense>, document.getElementById('app')!);
