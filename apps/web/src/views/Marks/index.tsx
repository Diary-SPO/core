import { PanelHeaderWithBack, Suspense } from '@components'
import { THIRD_SEC, VKUI_ACCENT_BG, VKUI_RED } from '@config'
import { PerformanceCurrent } from '@diary-spo/shared'
import { useRateLimitExceeded, useSnackbar } from '@hooks'
import { Nullable } from '@types'
import { handleResponse } from '@utils'
import { Icon28ErrorCircleOutline, Icon28InfoCircle } from '@vkontakte/icons'
import { Group, Panel, PanelSpinner, PullToRefresh } from '@vkontakte/vkui'
import { FC } from 'preact/compat'
import { useEffect, useState } from 'preact/hooks'
import { getPerformance } from '../../methods'
import { Props } from '../types.ts'
import MarksByGroup from './MarksByGroup'
import Summary from './Summary'
import UserInfo from './UserInfo'
import { formatStatisticsData } from './helpers.ts'

const Marks: FC<Props> = ({ id }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [snackbar, showSnackbar] = useSnackbar()
  const [rateSnackbar, handleRateLimitExceeded] = useRateLimitExceeded()

  const [marksForSubject, setMarksForSubject] =
    useState<Nullable<PerformanceCurrent>>(null)
  const [totalNumberOfMarks, setTotalNumberOfMarks] =
    useState<Nullable<number>>(null)
  const [averageMark, setAverageMark] = useState<Nullable<number>>(null)
  const [markCounts, setMarkCounts] =
    useState<Nullable<Record<number, number>>>(null)

  const saveData = (marks: PerformanceCurrent) => {
    if (!marks.daysWithMarksForSubject.length) {
      return
    }

    saveStatisticsData(marks)
    setMarksForSubject(marks)

    localStorage.setItem('lastFetchTime', String(Date.now()))
    localStorage.setItem('savedMarks', JSON.stringify(marks))
  }

  const saveStatisticsData = (marks: PerformanceCurrent) => {
    const data = formatStatisticsData(marks)

    setTotalNumberOfMarks(data.totalNumberOfMarks)
    setAverageMark(data.averageMark)
    setMarkCounts(data.markCounts)
  }

  const fetchMarks = async (isHandle?: boolean) => {
    const lastFetchTime = localStorage.getItem('lastFetchTime')
    const savedMarks = localStorage.getItem('savedMarks')

    /** Проверяем есть ли кеш и не нужно ли его обновить **/
    if (
      savedMarks &&
      (lastFetchTime || Date.now() - Number(lastFetchTime) >= THIRD_SEC) &&
      !isHandle
    ) {
      const marks = savedMarks ? JSON.parse(savedMarks) : null

      saveData(marks)

      showSnackbar({
        title: 'Оценки взяты из кеша',
        onActionClick: () => fetchMarks(true),
        action: 'Загрузить новые',
        before: <Icon28InfoCircle fill={VKUI_ACCENT_BG} />
      })
      return
    }

    try {
      setIsLoading(true)
      const marks = await getPerformance()

      handleResponse(
        marks,
        () => {
          showSnackbar({
            before: <Icon28ErrorCircleOutline fill={VKUI_RED} />,
            title: 'Ошибка при попытке загрузить оценки',
            action: 'Попробовать снова',
            onActionClick: () => fetchMarks(true)
          })
        },
        handleRateLimitExceeded,
        setIsLoading,
        showSnackbar,
        false
      )

      if (!('daysWithMarksForSubject' in marks)) {
        localStorage.removeItem('savedMarks')
        return
      }

      saveData(marks)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMarks()
  }, [])

  return (
    <Panel nav={id}>
      <PanelHeaderWithBack title='Успеваемость' />
      <PullToRefresh onRefresh={() => fetchMarks(true)} isFetching={isLoading}>
        <Suspense id='UserInfo'>
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
          <Suspense id='MarksByGroup'>
            <MarksByGroup marksForSubject={marksForSubject} />
          </Suspense>
        )}
      </PullToRefresh>
      {snackbar}
      {rateSnackbar}
    </Panel>
  )
}

export default Marks
