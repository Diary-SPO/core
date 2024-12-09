import type { Nullable, PerformanceCurrent } from '@diary-spo/shared'
import {
  Icon16Dropdown,
  Icon24Done,
  Icon28ErrorCircleOutline,
  Icon28InfoCircle
} from '@vkontakte/icons'
import {
  Panel,
  PanelHeader,
  PanelHeaderBack,
  PanelHeaderContent,
  PanelHeaderContext,
  PullToRefresh,
  SimpleCell,
  SplitLayout,
  usePlatform
} from '@vkontakte/vkui'
import React, { type FC, useEffect, useState } from 'react'
import {
  PanelHeaderWithBack,
  handleResponse,
  isApiError,
  isNeedToUpdateCache
} from '../../shared'

import type { Props } from '../types.ts'

import { data } from './data.tsx'
import { formatStatisticsData } from './helpers.ts'
import type { Tabs } from './types.ts'

import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { getPerformance } from '../../shared/api'
import { VKUI_ACCENT_BG, VKUI_RED } from '../../shared/config'
import { useRateLimitExceeded, useSnackbar } from '../../shared/hooks'
import { ErrorPlaceholder, Suspense } from '../../shared/ui'
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
  const [contextOpened, setContextOpened] = React.useState(false)
  const [mode, setMode] = React.useState(selected)
  const platform = usePlatform()
  const hasHeader = platform !== 'vkcom'
  const routeNavigator = useRouteNavigator()

  const toggleContext = () => {
    setContextOpened((prev) => !prev)
  }
  const select = (e) => {
    const mode = e.currentTarget.dataset.mode
    setSelected(mode)
    setMode(mode)
    requestAnimationFrame(toggleContext)
  }

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
      <PullToRefresh onRefresh={() => fetchMarks(true)} isFetching={isLoading}>
        {/*<VKUITabs mode='default'>*/}
        {/*  <HorizontalScroll arrowSize='l'>*/}
        {/*    {data.map((item) => (*/}
        {/*      <TabsItem*/}
        {/*        aria-controls={item.type}*/}
        {/*        id={item.type}*/}
        {/*        key={item.type}*/}
        {/*        before={item.icon}*/}
        {/*        disabled={selected === item.type}*/}
        {/*        selected={selected === item.type}*/}
        {/*        onClick={() => setSelected(item.type)}*/}
        {/*      >*/}
        {/*        {item.text}*/}
        {/*      </TabsItem>*/}
        {/*    ))}*/}
        {/*  </HorizontalScroll>*/}
        {/*</VKUITabs>*/}

        <SplitLayout
          center
          header={hasHeader && <PanelHeader delimiter='none' />}
        >
          <Panel id='context'>
            <PanelHeader
              before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}
            >
              <PanelHeaderContent
                aside={
                  <Icon16Dropdown
                    style={{
                      transform: `rotate(${contextOpened ? '180deg' : '0'})`
                    }}
                  />
                }
                onClick={toggleContext}
              >
                {data.map((tab) => (
                  <div key={tab.type} hidden={mode !== tab.type}>
                    {tab.text}
                  </div>
                ))}
              </PanelHeaderContent>
            </PanelHeader>
            <PanelHeaderContext opened={contextOpened} onClose={toggleContext}>
              {data.map((tab) => (
                <SimpleCell
                  before={tab.icon}
                  after={
                    mode === tab.type ? (
                      <Icon24Done fill='var(--vkui--color_icon_accent)' />
                    ) : null
                  }
                  onClick={select}
                  data-mode={tab.type}
                  key={tab.type}
                >
                  {tab.text}
                </SimpleCell>
              ))}
            </PanelHeaderContext>
            {!isLoading && !isError && (
              <Suspense id='tab'>{activeTab}</Suspense>
            )}

            {isError && <ErrorPlaceholder />}
          </Panel>
        </SplitLayout>

        {snackbar}
        {rateSnackbar}

        {isLoading && <LoadingData />}
      </PullToRefresh>
    </Panel>
  )
}

export default Achievements
