import { PanelHeaderWithBack, Suspense } from '@components'
import { Day } from '@diary-spo/shared'
import { useRateLimitExceeded, useSnackbar } from '@hooks'
import { handleResponse } from '@utils'
import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import {
  Div,
  Group,
  Header,
  Panel,
  PanelSpinner,
  PullToRefresh,
  View
} from '@vkontakte/vkui'
import { endOfWeek, startOfWeek } from '@vkontakte/vkui/dist/lib/date'
import { FC, lazy, useEffect, useState } from 'preact/compat'
import { getLessons } from '../../methods'
import ErrorPlaceholder from './ErrorPlaceholder.tsx'
import ScheduleAsideButtons from './ScheduleAsideButtons.tsx'
import { getWeekString, isNeedToGetNewData } from './utils.ts'

const MarksByDay = lazy(() => import('./MarksByDay'))
const ScheduleGroup = lazy(() => import('./ScheduleGroup'))

const Schedule: FC<{ id: string }> = ({ id }) => {
  /** Управление данными **/
  const newDate = new Date()
  const cachedDate = new Date(localStorage.getItem('currentDate'))
  const currentDate =
    cachedDate && cachedDate.getFullYear() >= 2023 ? cachedDate : newDate

  const [endDate, setEndDate] = useState<Date>(endOfWeek(currentDate))
  const [lessonsState, setLessons] = useState<Day[] | null>()
  const [startDate, setStartDate] = useState<Date>(startOfWeek(currentDate))

  /** Навигация **/
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation()
  const routeNavigator = useRouteNavigator()

  /** Для асинхронных действий **/
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

      if (data instanceof Response) {
        return
      }

      setLessons(data)
      localStorage.setItem('savedLessons', JSON.stringify(data))
    } catch (e) {
      console.error('handleGetLesson', e)
    } finally {
      setIsLoading(false)
    }
  }

  /** Используется при ручном обновлении страницы */
  const handleReloadData = () => {
    gettedLessons(true)
  }

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

  /** Для получения расписания и оценок при маунте */
  useEffect(() => {
    gettedLessons()
  }, [])

  const weekString = getWeekString(startDate, endDate)

  const isNoMarks =
    lessonsState?.length &&
    !lessonsState?.some((day) =>
      day.lessons?.some((lesson) =>
        lesson.gradebook?.tasks?.some((task) => task.mark)
      )
    )

  const ScheduleGroupAside = (
    <ScheduleAsideButtons
      handleGetLesson={handleGetLesson}
      showSnackbar={showSnackbar}
      endDate={endDate}
      startDate={startDate}
      setEndDate={setEndDate}
      setStartDate={setStartDate}
    />
  )

  const shouldShowSpinner = isLoading && <PanelSpinner />

  const MarksByDayOrLoading = shouldShowSpinner || (
    <MarksByDay lessonsState={lessonsState} />
  )
  const ScheduleOrLoading = shouldShowSpinner || (
    <ScheduleGroup lessonsState={lessonsState} />
  )

  const MarksHeader = (
    <Header mode='secondary'>
      Оценки за неделю {isNoMarks && 'отсутствуют'}
    </Header>
  )

  return (
    <View
      id={id}
      history={panelsHistory}
      activePanel={activePanel as string}
      onSwipeBack={() => routeNavigator.back()}
    >
      <Panel nav={id}>
        <PanelHeaderWithBack title='Главная' />
        {isError && <ErrorPlaceholder onClick={handleReloadData} />}
        <PullToRefresh onRefresh={handleReloadData} isFetching={isLoading}>
          <Div>
            <Suspense id='MarksByDay'>
              <Group header={MarksHeader}>{MarksByDayOrLoading}</Group>
            </Suspense>
            <Suspense id='ScheduleGroup' mode='screen'>
              <Group
                header={
                  <Header
                    aside={ScheduleGroupAside}
                    mode='secondary'
                    style='align-items: center;'
                  >
                    {weekString}
                  </Header>
                }
              >
                {ScheduleOrLoading}
              </Group>
            </Suspense>
          </Div>
        </PullToRefresh>
        {snackbar}
        {rateSnackbar}
      </Panel>
    </View>
  )
}

export default Schedule
