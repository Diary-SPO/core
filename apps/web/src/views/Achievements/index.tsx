import { ErrorPlaceholder, PanelHeaderWithBack } from '@components'
import { VKUI_ACCENT_BG, VKUI_RED } from '@config'
import type { Nullable, PerformanceCurrent } from '@diary-spo/shared'
import { useRateLimitExceeded, useSnackbar } from '@hooks'
import { handleResponse, isApiError, isNeedToUpdateCache } from '@utils'
import { Icon28ErrorCircleOutline, Icon28InfoCircle } from '@vkontakte/icons'
import {
  HorizontalScroll,
  Panel,
  PullToRefresh,
  TabsItem,
  Tabs as VKUITabs
} from '@vkontakte/vkui'
import { type FC, Suspense } from 'preact/compat'
import { useEffect, useState } from 'preact/hooks'

import { getPerformance } from '@api'

import type { Props } from '../types.ts'

import { data } from './data.tsx'
import { formatStatisticsData } from './helpers.ts'
import type { Tabs } from './types.ts'

import LoadingData from './LoadingData.tsx'
import { useActiveTab } from './hooks/useActiveTab.tsx'

const Achievements: FC<Props> = ({ id }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

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
    const savedMarks = localStorage.getItem('savedMarks')

    /** Проверяем есть ли кеш и не нужно ли его обновить **/
    if (savedMarks && !isNeedToUpdateCache('lastFetchTime') && !isHandle) {
      const marks = JSON.parse(savedMarks)

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
      setIsError(false)
      setIsLoading(true)
      const { data: marks } = await getPerformance()

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

      if (isApiError(marks) || !('daysWithMarksForSubject' in marks)) {
        localStorage.removeItem('savedMarks')
        return
      }

      saveData(marks)
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMarks()
  }, [])

  const [selected, setSelected] = useState<Tabs>('summary')

  const activeTab = useActiveTab(
    selected,
    totalNumberOfMarks,
    averageMark,
    markCounts,
    marksForSubject,
    setIsError,
    isLoading,
    setIsLoading
  )

  return (
    <Panel nav={id}>
      <PanelHeaderWithBack title='Успеваемость' />
      <PullToRefresh onRefresh={() => fetchMarks(true)} isFetching={isLoading}>
        <VKUITabs mode='default'>
          <HorizontalScroll arrowSize='l'>
            {data.map((item) => (
              <TabsItem
                key={item.type}
                before={item.icon}
                disabled={selected === item.type}
                selected={selected === item.type}
                onClick={() => setSelected(item.type)}
              >
                {item.text}
              </TabsItem>
            ))}
          </HorizontalScroll>
        </VKUITabs>

        {isLoading && <LoadingData />}
      </PullToRefresh>

      {!isLoading && !isError && (
        <Suspense fallback='Загрузка...'>{activeTab}</Suspense>
      )}

      {isError && <ErrorPlaceholder />}

      {snackbar}
      {rateSnackbar}
    </Panel>
  )
}

export default Achievements
