import { Group, Panel, PanelSpinner, PullToRefresh } from '@vkontakte/vkui'
import { Icon28ErrorCircleOutline, Icon28InfoCircle } from '@vkontakte/icons'
import { PerformanceCurrent } from 'diary-shared'
import { FC } from 'preact/compat'
import { useEffect, useState } from 'preact/hooks'
import PanelHeaderWithBack from '../components/UI/PanelHeaderWithBack'
import Suspense from '../components/UI/Suspense'
import Summary from '../components/UI/Summary'
import MarksByGroup from '../components/MarksByGroup'
import UserInfo from '../components/UserInfo'
import { getPerformance } from '../methods'
import { handleResponse } from '../utils/handleResponse'
import { useSnackbar } from '../hooks'
import { formatStatisticsData } from '../utils/formatStatisticsData'

const THIRD_SEC = 30 * 1000

const Marks: FC<{ id: string }> = ({ id }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [snackbar, showSnackbar] = useSnackbar()

  const [marksForSubject, setMarksForSubject] =
    useState<PerformanceCurrent | null>(null)
  const [totalNumberOfMarks, setTotalNumberOfMarks] = useState<number | null>(
    null
  )
  const [averageMark, setAverageMark] = useState<number | null>(null)
  const [markCounts, setMarkCounts] = useState<Record<number, number> | null>(
    null
  )

  const saveStatisticsData = (marks: PerformanceCurrent | null) => {
    if (!marks) return

    const data = formatStatisticsData(marks)
    if (data) {
      setTotalNumberOfMarks(data.totalNumberOfMarks)
      setAverageMark(data.averageMark)
      setMarkCounts(data.markCounts)
    }
  }

  const fetchMarks = async (
    isHandle?: boolean
  ): Promise<PerformanceCurrent | 418 | 429 | undefined> => {
    setIsLoading(true)
    try {
      const lastFetchTime = localStorage.getItem('lastFetchTime')

      if (
        !lastFetchTime ||
        Date.now() - Number(lastFetchTime) >= THIRD_SEC ||
        isHandle
      ) {
        const marks = await getPerformance()

        handleResponse(
          marks,
          () => {
            setIsLoading(false)
            saveStatisticsData(marks as PerformanceCurrent)
          },
          () => {
            showSnackbar({
              icon: (
                <Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />
              ),
              title: 'Ошибка при попытке сделать запрос',
              subtitle: 'Сообщите нам об этом',
            })
            setIsLoading(false)
          },
          setIsLoading,
          showSnackbar
        )
        localStorage.setItem('savedMarks', JSON.stringify(marks))
        localStorage.setItem('lastFetchTime', String(Date.now()))
        setMarksForSubject(marks as PerformanceCurrent)
        saveStatisticsData(marks as PerformanceCurrent)
        setIsLoading(false)
        return marks
      }
      setIsLoading(false)
      showSnackbar({
        title: 'Оценки взяты из кеша',
        onActionClick: () => fetchMarks(true),
        action: 'Загрузить новые',
        icon: <Icon28InfoCircle fill="var(--vkui--color_background_accent)" />,
      })
      const savedMarks = localStorage.getItem('savedMarks')
      const marks = savedMarks
        ? (JSON.parse(savedMarks) as PerformanceCurrent)
        : null
      saveStatisticsData(marks)
      return marks ?? undefined
    } catch (error) {
      setIsLoading(false)
      showSnackbar({
        icon: (
          <Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />
        ),
        title: 'Ошибка при попытке загрузить оценки',
        action: 'Попробовать снова',
        onActionClick: () => fetchMarks(true),
      })
      console.error('Ошибка при получении оценок:', error)
      return
    }
  }

  const fetchData = async () => {
    try {
      const marks = await fetchMarks()

      setMarksForSubject(marks as unknown as PerformanceCurrent)
    } catch (error) {
      console.error('Ошибка при получении данных:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Panel nav={id}>
      <PanelHeaderWithBack title="Успеваемость" />
      <PullToRefresh onRefresh={() => fetchMarks(true)} isFetching={isLoading}>
        <Suspense id="UserInfo">
          <UserInfo />
        </Suspense>

        {isLoading ? (
          <Group>
            <PanelSpinner />
          </Group>
        ) : (
          <Summary
            totalNumberOfMarks={totalNumberOfMarks}
            averageMark={averageMark}
            markCounts={markCounts}
          />
        )}
        {isLoading ? (
          <Group>
            <PanelSpinner />
          </Group>
        ) : (
          <Suspense id="MarksByGroup">
            <MarksByGroup marksForSubject={marksForSubject} />
          </Suspense>
        )}
      </PullToRefresh>
      {snackbar}
    </Panel>
  )
}

export default Marks
