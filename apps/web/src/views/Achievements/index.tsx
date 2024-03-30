import { ErrorPlaceholder, PanelHeaderWithBack, Suspense } from '@components'
import { THIRD_SEC, VKUI_ACCENT_BG, VKUI_RED } from '@config'
import { Nullable, PerformanceCurrent } from '@diary-spo/shared'
import { useRateLimitExceeded, useSnackbar } from '@hooks'
import { handleResponse, isApiError } from '@utils'
import { Icon28ErrorCircleOutline, Icon28InfoCircle } from '@vkontakte/icons'
import {
  HorizontalScroll,
  Panel,
  PullToRefresh,
  Tabs as VKUITabs,
  TabsItem
} from '@vkontakte/vkui'
import { FC, lazy } from 'preact/compat'
import { useEffect, useState } from 'preact/hooks'

import { getPerformance } from '@api'

import { Props } from '../types.ts'

import { data } from './data.tsx'
import { formatStatisticsData } from './helpers.ts'
import { Tabs } from './types.ts'

import LoadingData from './LoadingData.tsx'

const Summary = lazy(() => import('./Summary'))
const FinalMarks = lazy(() => import('./Tabs/FinalMarks'))
const MarksByGroup = lazy(() => import('./Tabs/MarksByGroup'))
const SubjectsList = lazy(() => import('./Tabs/SubjectsList'))

const Achievements: FC<Props> = ({ id }) => {
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(false)
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
    const lastFetchingTime = localStorage.getItem('lastFetchTime')
    const savedMarks = localStorage.getItem('savedMarks')

    /** Проверяем есть ли кеш и не нужно ли его обновить **/
    if (
      savedMarks &&
      Date.now() - Number(lastFetchingTime) <= THIRD_SEC &&
      !isHandle
    ) {
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
      setIsSummaryLoading(true)
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
        setIsSummaryLoading,
        showSnackbar,
        false
      )

      if (isApiError(marks) || !('daysWithMarksForSubject' in marks)) {
        localStorage.removeItem('savedMarks')
        return
      }

      saveData(marks)
    } finally {
      setIsSummaryLoading(false)
    }
  }

  useEffect(() => {
    fetchMarks()
  }, [])

  const [selected, setSelected] = useState<Tabs>('summary')

  const useActiveTab = () => {
    let tab = null

    switch (selected) {
      case 'summary':
        tab = (
          <Suspense id='UserInfo'>
            {isSummaryLoading ? (
              <LoadingData />
            ) : (
              <Summary
                totalNumberOfMarks={totalNumberOfMarks}
                averageMark={averageMark}
                markCounts={markCounts}
              />
            )}
          </Suspense>
        )
        break
      case 'current':
        tab = (
          <Suspense id='MarksByGroup'>
            <MarksByGroup marksForSubject={marksForSubject} />
          </Suspense>
        )
        break
      case 'finalMarks':
        tab = (
          <Suspense id='FinalMarks'>
            <FinalMarks
              setIsError={setIsError}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </Suspense>
        )
        break
      case 'attestation':
        return (
          <Suspense id='AttestationTab'>
            <SubjectsList
              setIsError={setIsError}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </Suspense>
        )
      default:
        return null
    }

    return <main className='activeTabWrapper'>{tab}</main>
  }

  const activeTab = useActiveTab()

  return (
    <Panel nav={id}>
      <PanelHeaderWithBack title='Успеваемость' />
      <PullToRefresh
        onRefresh={() => fetchMarks(true)}
        isFetching={isSummaryLoading}
      >
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

        {activeTab}

        {isLoading && <LoadingData />}
      </PullToRefresh>

      {isError && <ErrorPlaceholder />}

      {snackbar}
      {rateSnackbar}
    </Panel>
  )
}

export default Achievements
