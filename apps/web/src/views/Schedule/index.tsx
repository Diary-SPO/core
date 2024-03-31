import { ErrorPlaceholder, PanelHeaderWithBack, Suspense } from '@components'
import type { Day, Nullable } from '@diary-spo/shared'
import { useRateLimitExceeded, useSnackbar } from '@hooks'
import { handleResponse, isApiError, isNeedToUpdateCache } from '@utils'
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
import { type FC, lazy, useEffect, useState } from 'preact/compat'

import { getLessons } from '@api'

import type { Props } from '../types.ts'
import { getWeekString } from './utils'

const ScheduleAsideButtons = lazy(() => import('./ScheduleAsideButtons'))
const MarksByDay = lazy(() => import('./MarksByDay'))
const ScheduleGroup = lazy(() => import('./ScheduleGroup'))

const Schedule: FC<Props> = ({ id }) => {
  /** Управление данными **/
  const newDate = new Date()
  const cachedDate = new Date(localStorage.getItem('currentDate'))
  const currentDate =
    cachedDate && cachedDate.getFullYear() >= 2023 ? cachedDate : newDate

  const [endDate, setEndDate] = useState<Date>(endOfWeek(currentDate))
  const [lessonsState, setLessons] = useState<Nullable<Day[]>>(null)
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
    console.log('asdasd')
    setIsLoading(true)
    setIsError(false)

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

      if (isApiError(data)) {
        return
      }

      setLessons(data)
      localStorage.setItem('savedLessons', JSON.stringify(data))
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

    if (savedLessons && !isNeedToUpdateCache('lastFetchTime') && !isHandle) {
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
    <Suspense id='ScheduleAsideButtons'>
      <ScheduleAsideButtons
        handleGetLesson={handleGetLesson}
        showSnackbar={showSnackbar}
        endDate={endDate}
        startDate={startDate}
        setEndDate={setEndDate}
        setStartDate={setStartDate}
      />
    </Suspense>
  )

  const shouldShowSpinner = isLoading && <PanelSpinner />

  const MarksByDayOrLoading = shouldShowSpinner || (
    <Suspense id='MarksByDay'>
      <MarksByDay lessonsState={lessonsState} />
    </Suspense>
  )
  const ScheduleOrLoading = shouldShowSpinner || (
    <Suspense id='ScheduleGroup'>
      <ScheduleGroup lessonsState={lessonsState} />
    </Suspense>
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
        <PullToRefresh onRefresh={handleReloadData} isFetching={isLoading}>
          {isError ? (
            <ErrorPlaceholder onClick={handleReloadData} />
          ) : (
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
          )}
        </PullToRefresh>

        {snackbar}
        {rateSnackbar}
      </Panel>
    </View>
  )
}

export default Schedule
