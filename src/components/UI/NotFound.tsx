import {
  AppRoot, Button, Div,
} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { useInsets } from '@vkontakte/vk-bridge-react';
import { CSSProperties } from 'preact/compat';

const notFoundStyle: CSSProperties = {
  display: 'flex',
  margin: 'auto',
  height: '100vh',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
};

const text: CSSProperties = {
  padding: '0px 8px',
  fontFamily: 'Roboto, sans-serif',
  fontSize: 80,
  color: 'rgb(63, 138, 224)',
  background: 'rgba(63, 138, 224, 0.08)',
  borderRadius: 8,
  marginBottom: 40,
};

const NotFound = () => {
  const routeNavigator = useRouteNavigator();
  const vkBridgeInsets = useInsets() || undefined;

  return (
    <AppRoot safeAreaInsets={vkBridgeInsets}>
      <Div style={notFoundStyle}>
        <h1 style={text}>404</h1>
        <Button
          onClick={() => routeNavigator.replace('/')}
          size='l'
          mode='outline'
          appearance='accent-invariable'
          style={{ padding: 10 }}
        >
          <span style={{ fontSize: '1.5em' }}>На главную</span>
        </Button>
      </Div>
    </AppRoot>
  );
};

export default NotFound;
