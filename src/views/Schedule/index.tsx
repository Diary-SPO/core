import { PanelHeaderWithBack, Suspense } from '@components'
import { Day } from '@diary-spo/shared'
import { handleResponse } from '@utils'
import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import {
  Cell,
  Div,
  Group,
  Header, List,
  Panel, PanelHeaderContext,
  PanelSpinner,
  PullToRefresh,
  View
} from '@vkontakte/vkui'
import { endOfWeek, startOfWeek } from '@vkontakte/vkui/dist/lib/date'
import { FC, lazy, useEffect, useMemo, useState } from 'preact/compat'
import { useRateLimitExceeded, useSnackbar } from '../../hooks'
import { getLessons } from '../../methods'
import ErrorPlaceholder from './ErrorPlaceholder.tsx'
import ScheduleAsideButtons from './ScheduleAsideButtons.tsx'
import Tabs, { DefaultInPanel } from './Tabs'
import { getWeekString, isNeedToGetNewData } from './utils.ts'
import {Icon24Done, Icon28SettingsOutline, Icon28UsersOutline} from "@vkontakte/icons";

const MarksByDay = lazy(() => import('./MarksByDay'))
const ScheduleGroup = lazy(() => import('./ScheduleGroup'))

const Schedule: FC<{ id: string }> = ({ id }) => {
  const newDate = new Date()
  const cachedDate = new Date(localStorage.getItem('currentDate'))
  const currentDate =
    cachedDate && cachedDate.getFullYear() >= 2023 ? cachedDate : newDate
  const [endDate, setEndDate] = useState<Date>(endOfWeek(currentDate))

  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation()
  const routeNavigator = useRouteNavigator()

  const [lessonsState, setLessons] = useState<Day[] | null>()
  const [startDate, setStartDate] = useState<Date>(startOfWeek(currentDate))
  console.log(lessonsState)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

  const [rateSnackbar, handleRateLimitExceeded] = useRateLimitExceeded()
  const [snackbar, showSnackbar] = useSnackbar()

  const handleGetLesson = async (start: Date, end: Date) => {
    setIsLoading(true)
    localStorage.setItem('currentDate', startDate.toString())

    try {
      const data = await getLessons(start, end)

      handleResponse(
        data,
        () => {
          setIsLoading(false)
          setIsError(true)
        },
        handleRateLimitExceeded,
        setIsLoading,
        showSnackbar
      )

      localStorage.setItem('savedLessons', JSON.stringify(data))
      setLessons(data as Day[])
      return data
    } catch (e) {
      console.error('handleGetLesson', e)
    } finally {
      setIsLoading(false)
    }
  }

  /** Используется при ручном обновлении страницы */
  const handleReloadData = async () => {
    await gettedLessons(true)
  }

  const getError = () =>
    useMemo(
      () =>
        showSnackbar({
          title: 'Ошибка при попытке получить новые данные',
          action: 'Повторить',
          onActionClick: handleReloadData
        }),
      []
    )

  const gettedLessons = async (isHandle?: boolean) => {
    const savedLessons = localStorage.getItem('savedLessons')

    if (savedLessons && !isNeedToGetNewData() && !isHandle) {
      showSnackbar({
        layout: 'vertical',
        action: 'Загрузить новые',
        onActionClick: handleReloadData,
        title: 'Данные взяты из кеша'
      })
      setLessons(JSON.parse(savedLessons) as Day[])
      return
    }

    await handleGetLesson(startDate, endDate)
  }

  /** Для получения расписания при маунте */
  useEffect(() => {
    gettedLessons()
  }, [])

  const weekString = getWeekString(startDate, endDate)

  const isNoMarks = !lessonsState?.some((day) =>
    day.lessons?.some((lesson) =>
      lesson.gradebook?.tasks?.some((task) => task.mark)
    )
  )
  const [menuOpened, setMenuOpened] = useState(false)
  const [selected, setSelected] = useState('news')
  const [mode, setMode] = useState('all');
  return (
    <View
      id={id}
      history={panelsHistory}
      activePanel={activePanel as string}
      onSwipeBack={() => routeNavigator.back()}
    >
      <Panel nav={id}>
        <PanelHeaderWithBack>
          <DefaultInPanel
              selected={selected}
              setSelected={setSelected}
              menuOpened={menuOpened}
              onMenuClick={(opened) => {
                setMenuOpened((prevState) => (opened ? !prevState : false));
              }}
          />
        </PanelHeaderWithBack>
        <PullToRefresh onRefresh={handleReloadData} isFetching={isLoading}>
          <Div>
            <Suspense id='MarksByDay'>
              <Group>
                <PanelHeaderContext style={{width: 705}} opened={true} onClose={() => setMenuOpened(false)}>
                  <List>
                    <Cell
                        before={<Icon28UsersOutline />}
                        after={mode === 'all' && <Icon24Done fill="var(--vkui--color_icon_accent)" />}
                        onClick={() => setMode('all')}
                    >
                      Communities
                    </Cell>
                    <Cell
                        before={<Icon28SettingsOutline />}
                        after={mode === 'managed' && <Icon24Done fill="var(--vkui--color_icon_accent)" />}
                        onClick={() => setMode('managed')}
                    >
                      Managed Communities
                    </Cell>
                  </List>
                </PanelHeaderContext>
                <Header mode='secondary'>
                  Оценки за неделю {isNoMarks && 'отсутствуют'}
                </Header>
                {isLoading ? (
                  <PanelSpinner />
                ) : (
                  <MarksByDay lessonsState={lessonsState} />
                )}
              </Group>
            </Suspense>
            <Suspense id='ScheduleGroup' mode='screen'>
              <Group
                header={
                  <Header
                    aside={
                      <ScheduleAsideButtons
                        handleGetLesson={handleGetLesson}
                        getError={getError}
                        showSnackbar={showSnackbar}
                        endDate={endDate}
                        setIsLoading={setIsLoading}
                        startDate={startDate}
                        setLessons={setLessons}
                        setEndDate={setEndDate}
                        setStartDate={setStartDate}
                      />
                    }
                    mode='secondary'
                    style='align-items: center;'
                  >
                    {weekString}
                  </Header>
                }
              >
                {isLoading ? (
                  <PanelSpinner size='regular' />
                ) : (
                  <ScheduleGroup lessonsState={lessonsState} />
                )}
              </Group>
            </Suspense>
            {isError && <ErrorPlaceholder onClick={handleReloadData} />}
          </Div>
        </PullToRefresh>
        {snackbar}
        {rateSnackbar}
      </Panel>
    </View>
  )
}

export default Schedule
