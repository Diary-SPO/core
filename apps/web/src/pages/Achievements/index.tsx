import type { Nullable, PerformanceCurrent } from '@diary-spo/shared'
import { Icon28ErrorCircleOutline, Icon28InfoCircle } from '@vkontakte/icons'
import {
  HorizontalScroll,
  Panel,
  PullToRefresh,
  TabsItem,
  Tabs as VKUITabs
} from '@vkontakte/vkui'
import { type FC, useEffect, useState } from 'react'
import { handleResponse, isApiError, isNeedToUpdateCache } from '../../shared'

import type { Props } from '../types.ts'

import { data } from './data.tsx'
import { formatStatisticsData } from './helpers.ts'
import type { Tabs } from './types.ts'

import { getPerformance } from '../../shared/api'
import { VKUI_ACCENT_BG, VKUI_RED } from '../../shared/config'
import { useRateLimitExceeded, useSnackbar } from '../../shared/hooks'
import {
  ErrorPlaceholder,
  PanelHeaderWithBack,
  Suspense
} from '../../shared/ui'
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

    localStorage.setItem('lastMarksFetchTime', String(Date.now()))
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
    if (savedMarks && !isNeedToUpdateCache('lastMarksFetchTime') && !isHandle) {
      const marks = JSON.parse(savedMarks)

      showSnackbar({
        title: 'Оценки взяты из кеша',
        onActionClick: () => fetchMarks(true),
        action: 'Загрузить новые',
        before: <Icon28InfoCircle fill={VKUI_ACCENT_BG} />
      })
      saveData(marks)

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: all good
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
                aria-controls={item.type}
                id={item.type}
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

      {!isLoading && !isError && <Suspense id='tab'>{activeTab}</Suspense>}

      {isError && <ErrorPlaceholder />}

      {snackbar}
      {rateSnackbar}
    </Panel>
  )
}

export default Achievements
