import { PanelHeaderWithBack, Suspense } from '@components'
import { Day } from '@diary-spo/shared'
import { handleResponse } from '@utils'
import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import {
  Group,
  Header,
  Panel,
  PanelSpinner,
  PullToRefresh,
  View
} from '@vkontakte/vkui'
import { endOfWeek, startOfWeek } from '@vkontakte/vkui/dist/lib/date'
import { FC, lazy, useEffect, useMemo, useState } from 'preact/compat'
import {
  useRateLimitExceeded,
  useScrollPosition,
  useSnackbar
} from '../../hooks'
import { getLessons } from '../../methods'
import ErrorPlaceholder from './ErrorPlaceholder.tsx'
import ScheduleAsideButtons from './ScheduleAsideButtons.tsx'
import ScrollToTop from './ScrollToTop.tsx'
import { getWeekString, isNeedToGetNewData } from './utils.ts'

const MarksByDay = lazy(() => import('../../components/UI/MarksByDay'))
const ScheduleGroup = lazy(() => import('../../components/ScheduleGroup.tsx'))

const Schedule: FC<{ id: string }> = ({ id }) => {
  const newDate = new Date()
  const cachedDate = new Date(localStorage.getItem('currentDate'))
  const currentDate =
    cachedDate && cachedDate.getFullYear() >= 2023 ? cachedDate : newDate
  const [endDate, setEndDate] = useState<Date>(endOfWeek(currentDate))

  const scrollPosition = useScrollPosition()
  const showToTopButton = scrollPosition > 700

  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation()
  const routeNavigator = useRouteNavigator()

  const [lessonsState, setLessons] = useState<Day[] | null>()
  const [startDate, setStartDate] = useState<Date>(startOfWeek(currentDate))

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

  // const fetchMarksData = async (isHandle?: boolean) => {
  //   const savedMarks = localStorage.getItem('savedMarks')
  //
  //   setIsMarksLoading(true)
  //
  //   if (savedMarks && !isNeedToGetNewData() && !isHandle) {
  //     setMarksData(JSON.parse(savedMarks) as PerformanceCurrent)
  //     return setIsMarksLoading(false)
  //   }
  //
  //   try {
  //     const marks = await getPerformance()
  //
  //     handleResponse(
  //       marks,
  //       () => {
  //         setIsError(true)
  //         setIsMarksLoading(false)
  //       },
  //       handleRateLimitExceeded,
  //       setIsLoading,
  //       showSnackbar
  //     )
  //
  //     if (typeof marks !== 'number' && !(marks instanceof Response)) {
  //       setMarksData(marks)
  //       localStorage.setItem('savedMarks', JSON.stringify(marks))
  //     }
  //   } catch (error) {
  //     console.error(error)
  //     showSnackbar({
  //       title: 'Ошибка при попытке получить оценки',
  //       action: 'Повторить',
  //       icon: <Icon28ErrorCircleOutline />,
  //       onActionClick: fetchMarksData
  //     })
  //   } finally {
  //     setIsMarksLoading(false)
  //   }
  // }

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

  /** Используется при ручном обновлении страницы */
  const handleReloadData = () => {
    gettedLessons(true)
    // fetchMarksData(true)
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

  /** Для получения расписания при маунте */
  useEffect(() => {
    gettedLessons()
  }, [])

  // /** Для получения оценок при маунте */
  // useEffect(() => {
  //   fetchMarksData()
  // }, [])

  const weekString = getWeekString(startDate, endDate)
  console.log(lessonsState)
  const isNoMarks = !lessonsState?.some((day) =>
    day.lessons?.some((lesson) =>
      lesson.gradebook?.tasks?.some((task) => task.mark)
    )
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
          <Suspense id='MarksByDay'>
            <Group
              header={
                <Header mode='secondary'>
                  Оценки за неделю {isNoMarks && 'отсутствуют'}
                </Header>
              }
            >
              {/* ex isMarksLoading */}
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
        </PullToRefresh>
        {showToTopButton && <ScrollToTop />}
        {snackbar}
        {rateSnackbar}
      </Panel>
    </View>
  )
}

export default Schedule
