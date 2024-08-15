import type { Day, Nullable } from '@diary-spo/shared'
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

import { handleResponse, isApiError, isNeedToUpdateCache } from '../../shared'

import { endOfWeek } from 'date-fns/endOfWeek'
import { startOfWeek } from 'date-fns/startOfWeek'
import { type FC, lazy, useEffect, useState } from 'react'
import { getUserLessons } from '../../shared/api'
import { useRateLimitExceeded, useSnackbar } from '../../shared/hooks'
import {
  ErrorPlaceholder,
  PanelHeaderWithBack,
  Suspense
} from '../../shared/ui'
import type { Props } from '../types.ts'

import { getWeekString, transformData } from './lib'
const ScheduleAsideButtons = lazy(() => import('./ui/ScheduleAsideButtons.tsx'))
const MarksByDay = lazy(() => import('./ui/MarksByDay'))
const ScheduleGroup = lazy(() => import('./ui/ScheduleGroup'))

const Schedule: FC<Props> = ({ id }) => {
  /** Управление данными **/
  const newDate = new Date()
  const cachedDate = new Date(localStorage.getItem('currentDate') ?? '')
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
    setIsLoading(true)
    setIsError(false)

    localStorage.setItem('currentDate', startDate.toString())

    try {
      // @TODO: ??
      const data = await getUserLessons(start, end)

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
      localStorage.setItem('lastLessonsFetchTime', Date.now().toString())
      localStorage.setItem('savedLessons', JSON.stringify(data))
    } finally {
      setIsLoading(false)
    }
  }

  const getLessons = async () => handleGetLesson(startDate, endDate)

  const getDataOnMount = () => {
    const savedLessons = localStorage.getItem('savedLessons')

    if (!savedLessons || isNeedToUpdateCache('lastLessonsFetchTime')) {
      getLessons()
      return
    }

    showSnackbar({
      layout: 'vertical',
      action: 'Загрузить новые',
      onActionClick: getLessons,
      title: 'Данные взяты из кеша'
    })
    setLessons(JSON.parse(savedLessons) as Day[])
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: all good
  useEffect(getDataOnMount, [])

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

  const data = transformData(lessonsState).reverse()

  const MarksByDayOrLoading = shouldShowSpinner || (
    <Suspense id='MarksByDay'>
      <MarksByDay lessonsState={data} />
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
        <PullToRefresh onRefresh={getLessons} isFetching={isLoading}>
          {isError ? (
            <ErrorPlaceholder onClick={getLessons} />
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
                      // @TODO: ??
                      style={{ alignItems: 'center' }}
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
