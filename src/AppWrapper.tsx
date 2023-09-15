import { FC, lazy } from 'react';
import { AdaptivityProvider, AppRoot, ConfigProvider } from '@vkontakte/vkui';
import { RouterProvider } from '@vkontakte/vk-mini-apps-router';
import vkBridge, { parseURLSearchParamsForGetLaunchParams } from '@vkontakte/vk-bridge';
import { useAdaptivity, useAppearance, useInsets } from '@vkontakte/vk-bridge-react';
import { ModalProvider } from './modals/ModalContext';
import { router } from './routes';
import Suspense from './components/UI/Suspense';
import { transformVKBridgeAdaptivity } from './transformers/transformVKBridgeAdaptivity.ts';

const NotFound = lazy(() => import('./components/UI/NotFound'));
const App = lazy(() => import('./App'));

vkBridge.send('VKWebAppInit');

const NotFoundCorrect: FC = () => {
  const { vk_platform } = parseURLSearchParamsForGetLaunchParams(window.location.search);
  const vkBridgeAppearance = useAppearance() || undefined;

  return (
    <ConfigProvider
      appearance={vkBridgeAppearance}
      isWebView={vkBridge.isWebView()}
      platform={vk_platform === 'desktop_web' ? 'vkcom' : undefined}
    >
      <NotFound />
    </ConfigProvider>
  );
};

const AppWrapper = () => {
  const vkBridgeInsets = useInsets() || undefined;
  const { vk_platform } = parseURLSearchParamsForGetLaunchParams(window.location.search);
  const vkBridgeAdaptivityProps = transformVKBridgeAdaptivity(useAdaptivity());
  const vkBridgeAppearance = useAppearance() || undefined;

  return (
    <AdaptivityProvider {...vkBridgeAdaptivityProps}>
      <RouterProvider router={router} notFound={<NotFoundCorrect />}>
        <Suspense id='app' mode='screen'>
          <ConfigProvider
            appearance={vkBridgeAppearance}
            platform={vk_platform === 'desktop_web' ? 'vkcom' : undefined}
            isWebView={vkBridge.isWebView()}
          >
            <ModalProvider>
              <AppRoot safeAreaInsets={vkBridgeInsets}>
                <App />
              </AppRoot>
            </ModalProvider>
          </ConfigProvider>
        </Suspense>
      </RouterProvider>
    </AdaptivityProvider>
  );
};

export default AppWrapper;
