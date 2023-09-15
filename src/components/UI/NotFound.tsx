import { CSSProperties } from 'react';
import {
  AppRoot, Button, ConfigProvider, Div,
} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import vkBridge, {parseURLSearchParamsForGetLaunchParams} from "@vkontakte/vk-bridge";
import {useAppearance, useInsets} from "@vkontakte/vk-bridge-react";

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
  const { vk_platform } = parseURLSearchParamsForGetLaunchParams(window.location.search);
  const vkBridgeInsets = useInsets() || undefined;
  const vkBridgeAppearance = useAppearance() || undefined;
  
  return (
    <AppRoot safeAreaInsets={vkBridgeInsets}>
      <ConfigProvider
        appearance={vkBridgeAppearance}
        platform={vk_platform === 'desktop_web' ? 'vkcom' : undefined}
        isWebView={vkBridge.isWebView()}
      >
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
      </ConfigProvider>
    </AppRoot>
  );
};

export default NotFound;
