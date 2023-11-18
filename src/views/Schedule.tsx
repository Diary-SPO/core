import { FC, lazy, useEffect, useState } from 'preact/compat'
import {
  Button,
  ButtonGroup,
  Group,
  Header,
  IconButton,
  Link,
  Panel,
  PanelSpinner,
  Placeholder,
  PullToRefresh,
  View,
} from '@vkontakte/vkui'
import {
  useActiveVkuiLocation,
  useRouteNavigator,
} from '@vkontakte/vk-mini-apps-router'
import {
  Icon16ArrowLeftOutline,
  Icon16ArrowRightOutline,
  Icon28ErrorCircleOutline,
  Icon24ChevronRightCircle,
} from '@vkontakte/icons'
import { addDays, endOfWeek, startOfWeek } from '@vkontakte/vkui/dist/lib/date'
import { Day, PerformanceCurrent } from '@diary-spo/shared'
import { getLessons, getPerformance } from '../methods'
import { ExplanationTooltip, PanelHeaderWithBack, Suspense } from '@components'
import {
  useDebouncedChangeWeek,
  useRateLimitExceeded,
  useSnackbar,
  useScrollPosition,
} from '../hooks'
import { useCallback } from 'preact/hooks'
import { handleResponse } from '@utils'

const MarksByDay = lazy(() => import('../components/UI/MarksByDay'))
const ScheduleGroup = lazy(() => import('../components/ScheduleGroup'))

const Schedule: FC<{ id: string }> = ({ id }) => {
  const currentDate = new Date()

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

      return data
    },
    [startDate]
  )

  const updateDatesFromData = (data: Day[]) => {
    const firstLessonDate =
      data && data.length > 0 ? new Date(data[0].date) : startDate
    const lastLessonDate =
      data && data.length > 0 ? new Date(data[data.length - 1].date) : endDate
    setStartDate(startOfWeek(firstLessonDate))
    setEndDate(endOfWeek(lastLessonDate))
  }

  const [isCurrent, setIsCurrent] = useState<boolean>(() => {
    const storedIsCurrent = localStorage.getItem('isCurrent')
    return storedIsCurrent ? Boolean(JSON.parse(storedIsCurrent)) : true
  })

  const handleReloadData = useCallback(async () => {
    setIsLoading(true)
    setIsMarksLoading(true)
    setIsError(false)
    setIsCurrent(true)
    localStorage.setItem('isCurrent', JSON.stringify(true))
    const newEndDate = new Date(endDate)
    newEndDate.setDate(newEndDate.getDate() + 7)

    try {
      const data = await getLessons(startDate, newEndDate)
      const marks = await getPerformance()

      handleResponse(
        data,
        () => {
          setIsMarksLoading(false)
        },
        handleRateLimitExceeded,
        setIsLoading,
        showSnackbar
      )

      handleResponse(
        marks,
        () => {
          setIsMarksLoading(false)
        },
        handleRateLimitExceeded,
        setIsLoading,
        showSnackbar
      )

      setMarksData(marks as PerformanceCurrent)
      setLessons(data as Day[])
      updateDatesFromData(data as Day[])

      localStorage.setItem('savedLessons', JSON.stringify(data))
      localStorage.setItem('savedMarks', JSON.stringify(marks))
    } catch (error) {
      setIsError(true)
      showSnackbar({
        title: 'Ошибка при попытке получить новые данные',
        action: 'Повторить',
        onActionClick: handleReloadData,
      })
      console.error(error)
    } finally {
      setIsLoading(false)
      setIsMarksLoading(false)
    }
  }, [startDate, endDate])

  const getError = () =>
    showSnackbar({
      title: 'Ошибка при попытке получить расписание',
      action: 'Повторить',
      onActionClick: handleReloadData,
    })

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
          title: 'Данные взяты из кеша',
        })
        setIsLoading(false)
        return
      }

      try {
        const data = await handleGetLesson(startDate, endDate)
        setLessons(data as Day[])

        localStorage.setItem('lastRequestTime', currentTime.toString())
        updateDatesFromData(data as Day[])
      } catch (error) {
        setIsError(true)
        getError()
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    if (savedLessons) {
      setLessons(JSON.parse(savedLessons) as Day[])
      const firstLessonDate = JSON.parse(savedLessons)[0]
        ? new Date(JSON.parse(savedLessons)[0].date as string)
        : startDate
      const lastLessonDate = JSON.parse(savedLessons)[
        JSON.parse(savedLessons).length - 1
      ]
        ? new Date(
            JSON.parse(savedLessons)[JSON.parse(savedLessons).length - 1]
              .date as string
          )
        : endDate
      setStartDate(startOfWeek(firstLessonDate))
      setEndDate(endOfWeek(lastLessonDate))
    }

    gettedLessons()
  }, [])

  useEffect(() => {
    const savedMarks = localStorage.getItem('savedMarks')

    if (savedMarks) {
      setMarksData(JSON.parse(savedMarks) as PerformanceCurrent)
      setIsMarksLoading(false)
    }

    const fetchMarksData = async () => {
      setIsMarksLoading(true)

      if (savedMarks) {
        setIsMarksLoading(false)
        return
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
          onActionClick: fetchMarksData,
        })
      } finally {
        setIsMarksLoading(false)
      }
    }

    fetchMarksData()
  }, [])

  const sendToServerIfValid = async (start: Date, end: Date) => {
    setIsLoading(true)
    setIsCurrent(false)
    const data = await handleGetLesson(start, end)
    setLessons(data as Day[])

    localStorage.setItem('savedLessons', JSON.stringify(data))
    setIsLoading(false)
  }

  const getCurrentWeek = async () => {
    const startWeek = startOfWeek(currentDate)
    const startOfCurrWeek = startOfWeek(startDate)
    const endWeek = addDays(endOfWeek(currentDate), 7)

    const startWeekStr = startWeek.toLocaleString('default', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

    const startOfCurrWeekStr = startOfCurrWeek.toLocaleString('default', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

    if (startWeekStr === startOfCurrWeekStr) {
      showSnackbar({
        title: 'Вы уже на текущей неделе',
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

  const Buttons = (
    <ButtonGroup
      style={{
        alignItems: 'center',
        position: 'relative',
        color: 'var(--vkui--color_stroke_accent_themed)',
      }}
      gap="s"
    >
      <IconButton
        aria-label="Prev"
        onClick={() => debouncedHandleButtonClick('prev', sendToServerIfValid)}
      >
        <Icon16ArrowLeftOutline />
      </IconButton>
      <Button
        size="s"
        mode="secondary"
        onClick={() => getCurrentWeek()}
        disabled={isCurrent}
      >
        <ExplanationTooltip
          tooltipContent="Вернёт вас на текущую неделю"
          text="Домой"
        />
      </Button>
      <IconButton
        aria-label="Next"
        onClick={() => debouncedHandleButtonClick('next', sendToServerIfValid)}
      >
        <Icon16ArrowRightOutline />
      </IconButton>
    </ButtonGroup>
  )

  const weekString = `
  ${startDate.getDate()}
  ${startDate.toLocaleString('default', { month: 'long' }).slice(0, 3)}
    -
    ${endDate.getDate()}
    ${endDate.toLocaleString('default', { month: 'long' }).slice(0, 3)}`

  return (
    <View
      id={id}
      history={panelsHistory}
      activePanel={activePanel as string}
      onSwipeBack={() => routeNavigator.back()}
    >
      <Panel nav={id}>
        <PanelHeaderWithBack title="Главная" />
        <PullToRefresh onRefresh={handleReloadData} isFetching={isLoading}>
          <Suspense id="MarksByDay">
            <Group header={<Header mode="secondary">Недавние оценки</Header>}>
              {isMarksLoading ? (
                <PanelSpinner />
              ) : (
                <MarksByDay performanceData={marksData} />
              )}
            </Group>
          </Suspense>
          <Suspense id="ScheduleGroup" mode="screen">
            <Group
              header={
                <Header
                  aside={Buttons}
                  mode="secondary"
                  style="align-items: center;"
                >
                  {weekString}
                </Header>
              }
            >
              {isLoading ? (
                <PanelSpinner size="regular" />
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

const ErrorPlaceholder: FC<{ onClick: () => void }> = ({ onClick }) => (
  <Placeholder
    header="Ошибка при загрузке"
    action={
      <ButtonGroup mode="vertical" align="center">
        <Button size="s" onClick={() => onClick()}>
          Попробовать снова
        </Button>
        <Link href="https://vk.me/dnevnik_spo" target="_blank">
          Сообщить о проблеме
        </Link>
      </ButtonGroup>
    }
  />
)

const ScrollToTop: FC = () => (
  <IconButton
    aria-label="scroll top"
    style={{ position: 'fixed', left: 5, bottom: 60 }}
    onClick={() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }}
  >
    <Icon24ChevronRightCircle
      style={{
        transform: 'rotate(-90deg)',
        color: 'var(--vkui--color_background_accent_themed)',
      }}
    />
  </IconButton>
)

export default Schedule
