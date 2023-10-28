import {
  AppRoot,
  Cell,
  Group,
  Panel,
  PanelHeader,
  Platform,
  ScreenSpinner,
  SplitCol,
  SplitLayout,
  useAdaptivityConditionalRender,
  usePlatform,
} from '@vkontakte/vkui'
import {
  useActiveVkuiLocation,
  usePopout,
  useRouteNavigator,
} from '@vkontakte/vk-mini-apps-router'
import { useInsets } from '@vkontakte/vk-bridge-react'
import { lazy } from 'preact/compat'
import { useEffect, useState } from 'preact/hooks'
import {
  MAIN_SETTINGS,
  VIEW_ATTESTATION,
  VIEW_CONTACTS,
  VIEW_MARKS,
  VIEW_NOTIFICATIONS,
  VIEW_SCHEDULE,
  VIEW_SETTINGS,
} from './routes'
import { Pages } from './types'
import Suspense from './components/UI/Suspense'
import {
  Icon28BookSpreadOutline,
  Icon28EducationOutline,
  Icon28GraphOutline,
  Icon28HomeOutline,
  Icon28SettingsOutline,
} from '@vkontakte/icons'

const ModalRoot = lazy(() => import('./modals/ModalRoot'))
const Epic = lazy(() => import('./components/UI/Epic'))

const App = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const routeNavigator = useRouteNavigator()
  const modals = <ModalRoot />
  const { view: activeView, panel } = useActiveVkuiLocation()
  const cookieValue = localStorage.getItem('cookie')
  const { viewWidth } = useAdaptivityConditionalRender()
  const platform = usePlatform()
  const isVKCOM = platform === Platform.VKCOM
  const routerPopout = usePopout()
  const vkBridgeInsets = useInsets() || undefined

  useEffect(() => {
    const onRoute = async () => {
      if (!cookieValue) {
        await routeNavigator.replace('/')
        setIsLoading(false)
      } else if (cookieValue && activeView === MAIN_SETTINGS) {
        await routeNavigator.replace(`/${VIEW_SCHEDULE}`)
        setIsLoading(false)
      }
    }

    onRoute()
  }, [activeView, localStorage, window.location])

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

  return (
    <AppRoot safeAreaInsets={vkBridgeInsets}>
      <SplitLayout
        popout={routerPopout}
        modal={modals}
        header={!isVKCOM && <PanelHeader separator={false} />}
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
                <Cell
                  onClick={() => onStoryChange(VIEW_SCHEDULE)}
                  hovered={panel === VIEW_SCHEDULE}
                  before={<Icon28HomeOutline />}
                >
                  Главная
                </Cell>
                <Cell
                  onClick={() => onStoryChange(VIEW_MARKS)}
                  hovered={panel === VIEW_MARKS}
                  before={<Icon28GraphOutline />}
                >
                  Успеваемость
                </Cell>
                <Cell
                  onClick={() => onStoryChange(VIEW_ATTESTATION)}
                  hovered={panel === VIEW_ATTESTATION}
                  before={<Icon28EducationOutline />}
                >
                  Аттестация
                </Cell>
                <Cell
                  onClick={() => onStoryChange(VIEW_NOTIFICATIONS)}
                  hovered={panel === VIEW_NOTIFICATIONS}
                  before={<Icon28BookSpreadOutline />}
                >
                  Объявления
                </Cell>
                <Cell
                  onClick={() => onStoryChange(VIEW_CONTACTS)}
                  hovered={panel === VIEW_CONTACTS}
                  before={<Icon28EducationOutline />}
                >
                  Помощь
                </Cell>
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
        <Suspense id="Epic">
          {isLoading && <ScreenSpinner size="large" />}
          <SplitCol width="100%" maxWidth="700px" stretchedOnMobile autoSpaced>
            <Epic onStoryChange={onStoryChange} />
          </SplitCol>
        </Suspense>
      </SplitLayout>
    </AppRoot>
  )
}

export default App
