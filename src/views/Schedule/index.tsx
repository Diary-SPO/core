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
  useDebouncedChangeWeek,
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
  const currentDate = new Date(localStorage.getItem('currentDate')) ?? newDate

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
      localStorage.setItem('currentDate', start.toString())
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
  const getError = () =>
    showSnackbar({
      title: 'Ошибка при попытке получить расписание',
      action: 'Повторить',
      onActionClick: handleReloadData
    })

  const [isCurrent, setIsCurrent] = useState<boolean>(() => {
    const storedIsCurrent = localStorage.getItem('isCurrent')
    return storedIsCurrent ? Boolean(JSON.parse(storedIsCurrent)) : true
  })

  const handleReloadData = useCallback(async () => {
    setIsMarksLoading(true)
    setIsError(false)
    const newEndDate = new Date(endDate)
    newEndDate.setDate(newEndDate.getDate() + 7)
    console.log(startDate)
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

  /** Для получения данных при маунте */
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

      if (savedLessons || savedMarks || timeSinceLastRequest < 30000) {
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

  const savedMarks = localStorage.getItem('savedMarks')

  const fetchMarksData = async () => {
    setIsMarksLoading(true)

    if (savedMarks) {
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

  useEffect(() => {
    if (savedMarks) {
      setMarksData(JSON.parse(savedMarks) as PerformanceCurrent)
      setIsMarksLoading(false)
    }

    fetchMarksData()
  }, [])

  useEffect(() => {
    const startWeek = startOfWeek(newDate)
    const startOfCurrWeek = startOfWeek(startDate)

    const startWeekStr = startWeek.toLocaleString('default', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })

    const startOfCurrWeekStr = startOfCurrWeek.toLocaleString('default', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })

    if (startWeekStr === startOfCurrWeekStr) {
      localStorage.setItem('isCurrent', JSON.stringify(true))
      return setIsCurrent(true)
    }

    localStorage.setItem('isCurrent', JSON.stringify(false))
    setIsCurrent(false)
  }, [endDate, startDate])

  const getCurrentWeek = async () => {
    const startWeek = startOfWeek(newDate)
    const startOfCurrWeek = startOfWeek(startDate)
    const endWeek = endOfWeek(newDate)

    const startWeekStr = startWeek.toLocaleString('default', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })

    const startOfCurrWeekStr = startOfCurrWeek.toLocaleString('default', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })

    if (startWeekStr === startOfCurrWeekStr) {
      showSnackbar({
        title: 'Вы уже на текущей неделе'
      })
      localStorage.setItem('isCurrent', JSON.stringify(true))
      setIsCurrent(true)
      return
    }

    setIsLoading(true)
    try {
      const data = await handleGetLesson(startWeek, endWeek)
      setLessons(data as Day[])
      setStartDate(startWeek)
      setEndDate(endWeek)

      localStorage.setItem('isCurrent', JSON.stringify(true))
      setIsCurrent(true)
    } catch (e) {
      console.error(e)
      getError()
    } finally {
      setIsLoading(false)
    }
  }

  const debouncedChangeWeekHook = useDebouncedChangeWeek(
    startDate,
    endDate,
    setIsCurrent,
    setStartDate,
    setEndDate
  )
  const { handleButtonClick: debouncedHandleButtonClick } =
    debouncedChangeWeekHook

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
                      debouncedHandleButtonClick={debouncedHandleButtonClick}
                      getCurrentWeek={getCurrentWeek}
                      isCurrent={isCurrent}
                      handleGetLesson={handleGetLesson}
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
          {showToTopButton && <ScrollToTop />}
          {snackbar}
          {rateSnackbar}
        </PullToRefresh>
      </Panel>
    </View>
  )
}

export default Schedule
