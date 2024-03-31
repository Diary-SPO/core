import { Suspense } from '@components'
import type { Pages } from '@types'
import {
  Icon28BookSpreadOutline,
  Icon28GraphOutline,
  Icon28HomeOutline,
  Icon28SettingsOutline
} from '@vkontakte/icons'
import { useInsets } from '@vkontakte/vk-bridge-react'
import {
  useActiveVkuiLocation,
  usePopout,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import {
  AppRoot,
  Cell,
  Group,
  Panel,
  PanelHeader,
  Platform,
  SplitCol,
  SplitLayout,
  useAdaptivityConditionalRender,
  usePlatform
} from '@vkontakte/vkui'
import { type FC, lazy } from 'preact/compat'

import {
  MAIN_SETTINGS,
  VIEW_MARKS,
  VIEW_NOTIFICATIONS,
  VIEW_SCHEDULE,
  VIEW_SETTINGS
} from '@routes'

const Epic = lazy(() => import('./Epic'))
import ModalRoot from './ModalRoot'

const App: FC = () => {
  const routeNavigator = useRouteNavigator()
  const { panel } = useActiveVkuiLocation()
  const { viewWidth } = useAdaptivityConditionalRender()
  const platform = usePlatform()
  const routerPopout = usePopout()
  const vkBridgeInsets = useInsets() || undefined
  const isVKCOM = platform === Platform.VKCOM

  const cookieValue = localStorage.getItem('token')

  const onStoryChange = async (currentView: Pages) => {
    if (cookieValue) {
      try {
        await routeNavigator.push(`/${currentView}`)
        return
      } catch (e) {
        console.error(e)
      }
    }

    await routeNavigator.replace('/')
  }

  const modals = <ModalRoot />

  return (
    // @ts-ignore Типы не совместимы
    <AppRoot safeAreaInsets={vkBridgeInsets}>
      <SplitLayout
        popout={routerPopout}
        modal={modals}
        header={!isVKCOM && <PanelHeader delimiter='none' />}
        style={{ justifyContent: 'center' }}
      >
        {viewWidth.tabletPlus && panel !== MAIN_SETTINGS && (
          <SplitCol
            className={viewWidth.tabletPlus.className}
            fixed
            width={280}
            maxWidth={280}
          >
            <Panel>
              {!isVKCOM && <PanelHeader />}
              <Group>
                {/*// @ts-ignore Типы не совместимы */}
                <Cell
                  onClick={() => onStoryChange(VIEW_SCHEDULE)}
                  hovered={panel === VIEW_SCHEDULE}
                  before={<Icon28HomeOutline />}
                >
                  Главная
                </Cell>
                {/*// @ts-ignore Типы не совместимы */}
                <Cell
                  onClick={() => onStoryChange(VIEW_MARKS)}
                  hovered={panel === VIEW_MARKS}
                  before={<Icon28GraphOutline />}
                >
                  Успеваемость
                </Cell>
                {/*//@ts-ignore типы React не совсем совместимы с Preact*/}
                <Cell
                  onClick={() => onStoryChange(VIEW_NOTIFICATIONS)}
                  hovered={panel === VIEW_NOTIFICATIONS}
                  before={<Icon28BookSpreadOutline />}
                >
                  Объявления
                </Cell>
                {/*// @ts-ignore Типы не совместимы */}
                <Cell
                  onClick={() => onStoryChange(VIEW_SETTINGS)}
                  hovered={panel === VIEW_SETTINGS}
                  before={<Icon28SettingsOutline />}
                >
                  Настройки
                </Cell>
              </Group>
            </Panel>
          </SplitCol>
        )}
        <Suspense id='Epic'>
          <SplitCol width='100%' maxWidth='700px' stretchedOnMobile autoSpaced>
            <Epic onStoryChange={onStoryChange} />
          </SplitCol>
        </Suspense>
      </SplitLayout>
    </AppRoot>
  )
}

export default App
