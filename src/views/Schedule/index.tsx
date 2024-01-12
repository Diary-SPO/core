import { PanelHeaderWithBack, Suspense } from '@components'
import { Day, PerformanceCurrent } from '@diary-spo/shared'
import { handleResponse } from '@utils'
import { Icon28ErrorCircleOutline } from '@vkontakte/icons'
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
import { FC, lazy, useCallback, useEffect, useState } from 'preact/compat'
import {
  useRateLimitExceeded,
  useScrollPosition,
  useSnackbar
} from '../../hooks'
import { getLessons, getPerformance } from '../../methods'
import ErrorPlaceholder from './ErrorPlaceholder.tsx'
import ScheduleAsideButtons from './ScheduleAsideButtons.tsx'
import ScrollToTop from './ScrollToTop.tsx'
import { getWeekString } from './utils.ts'

const MarksByDay = lazy(() => import('../../components/UI/MarksByDay'))
const ScheduleGroup = lazy(() => import('../../components/ScheduleGroup.tsx'))

const Schedule: FC<{ id: string }> = ({ id }) => {
  const newDate = new Date()
  const cachedDate = new Date(localStorage.getItem('currentDate'))
  const currentDate =
    cachedDate && cachedDate.getFullYear() >= 2023 ? cachedDate : newDate

  const scrollPosition = useScrollPosition()
  const showToTopButton = scrollPosition > 700

  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation()
  const routeNavigator = useRouteNavigator()

  const [lessonsState, setLessons] = useState<Day[] | null>()
  const [startDate, setStartDate] = useState<Date>(startOfWeek(currentDate))

  const [endDate, setEndDate] = useState<Date>(endOfWeek(currentDate))
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [marksData, setMarksData] = useState<PerformanceCurrent | null>(null)
  const [isMarksLoading, setIsMarksLoading] = useState<boolean>(false)

  const [rateSnackbar, handleRateLimitExceeded] = useRateLimitExceeded()
  const [snackbar, showSnackbar] = useSnackbar()

  const handleGetLesson = useCallback(
    async (start: Date, end: Date) => {
      setIsLoading(true)
      localStorage.setItem('currentDate', startDate.toString())

      try {
        const data = await getLessons(start, end)

        handleResponse(
          data,
          () => {
            setIsLoading(false)
            setIsMarksLoading(false)
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
    },
    [startDate, endDate]
  )

  const fetchMarksData = async () => {
    const savedMarks = localStorage.getItem('savedMarks')

    setIsMarksLoading(true)

    if (savedMarks) {
      setMarksData(JSON.parse(savedMarks) as PerformanceCurrent)
      return setIsMarksLoading(false)
    }

    try {
      const marks = await getPerformance()

      handleResponse(
        marks,
        () => {
          setIsLoading(false)
          setIsMarksLoading(false)
        },
        handleRateLimitExceeded,
        setIsLoading,
        showSnackbar
      )

      if (typeof marks !== 'number') {
        setMarksData(marks)
        localStorage.setItem('savedMarks', JSON.stringify(marks))
      }
    } catch (error) {
      console.error(error)
      showSnackbar({
        title: 'Ошибка при попытке получить оценки',
        action: 'Повторить',
        icon: <Icon28ErrorCircleOutline />,
        onActionClick: fetchMarksData
      })
    } finally {
      setIsMarksLoading(false)
    }
  }

  const getError = () =>
    showSnackbar({
      title: 'Ошибка при попытке получить расписание',
      action: 'Повторить',
      onActionClick: handleReloadData
    })

  const handleReloadData = useCallback(async () => {
    setIsMarksLoading(true)
    setIsError(false)
    const newEndDate = new Date(endDate)
    newEndDate.setDate(newEndDate.getDate() + 7)

    try {
      await handleGetLesson(startDate, endDate)
      await fetchMarksData()
    } catch (error) {
      setIsError(true)
      showSnackbar({
        title: 'Ошибка при попытке получить новые данные',
        action: 'Повторить',
        onActionClick: handleReloadData
      })
      console.error(error)
    } finally {
      setIsLoading(false)
      setIsMarksLoading(false)
    }
  }, [startDate, endDate])

  /** Для получения расписания при маунте */
  useEffect(() => {
    const savedLessons = localStorage.getItem('savedLessons')
    const getLastRequestTime = localStorage.getItem('lastRequestTime')
    const currentTime = Date.now()
    const lastRequestTime = getLastRequestTime
      ? parseInt(getLastRequestTime, 10)
      : 0
    const timeSinceLastRequest = currentTime - lastRequestTime

    const gettedLessons = async () => {
      setIsLoading(true)
      setIsError(false)

      if (savedLessons || timeSinceLastRequest < 30000) {
        showSnackbar({
          layout: 'vertical',
          action: 'Загрузить новые',
          onActionClick: handleReloadData,
          title: 'Данные взяты из кеша'
        })
        setIsLoading(false)
        return
      }

      await handleGetLesson(startDate, endDate)
    }

    if (savedLessons) {
      setLessons(JSON.parse(savedLessons) as Day[])
    }

    gettedLessons()
  }, [])

  /** Для получения оценок при маунте */
  useEffect(() => {
    fetchMarksData()
  }, [])

  const weekString = getWeekString(startDate, endDate)
  const isNoMarks = !marksData?.daysWithMarksForSubject.length

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
                  Недавние оценки {isNoMarks && 'отсутствуют'}
                </Header>
              }
            >
              {isMarksLoading ? (
                <PanelSpinner />
              ) : (
                <MarksByDay performanceData={marksData} />
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
        </PullToRefresh>
        {isError && <ErrorPlaceholder onClick={handleReloadData} />}
        {showToTopButton && <ScrollToTop />}
        {snackbar}
        {rateSnackbar}
      </Panel>
    </View>
  )
}

export default Schedule
