import type { Day } from '@diary-spo/shared'
import { Div, Group, Header, PullToRefresh } from '@vkontakte/vkui'
import { endOfWeek } from 'date-fns/endOfWeek'
import { startOfWeek } from 'date-fns/startOfWeek'
import { type FC, useEffect, useState } from 'react'

import {
  ErrorPlaceholder,
  Suspense,
  isNeedToUpdateCache,
  withSpinner
} from '../../shared'

import { RecentMarks } from '../../widgets'
import type { Props } from '../types.ts'

import { useScheduleData } from './api'
import { Layout } from './layout'
import { getWeekString } from './lib'

import ScheduleAsideButtons from './ui/ScheduleAsideButtons.tsx'
import ScheduleGroup from './ui/ScheduleGroup'

const Schedule: FC<Props> = ({ id }) => {
  /** Управление данными **/
  const newDate = new Date()
  const cachedDate = new Date(localStorage.getItem('currentDate') ?? '')
  const currentDate =
    cachedDate && cachedDate.getFullYear() >= 2023 ? cachedDate : newDate

  const [endDate, setEndDate] = useState<Date>(endOfWeek(currentDate))
  const [startDate, setStartDate] = useState<Date>(startOfWeek(currentDate))

  const {
    getActualUserLessons,
    isLoading,
    isError,
    rateSnackbar,
    data: lessonsState,
    showSnackbar,
    setData,
    snackbar
  } = useScheduleData()

  const getLessons = async () => getActualUserLessons(startDate, endDate)

  const getDataOnMount = () => {
    const savedLessons = localStorage.getItem('savedLessons')

    if (!savedLessons || isNeedToUpdateCache('lastLessonsFetchTime')) {
      getLessons()
      return
    }

    showSnackbar({
      layout: 'vertical',
      action: 'Загрузить новые',
      onActionClick: getLessons,
      title: 'Данные взяты из кеша'
    })

    setData(JSON.parse(savedLessons) as Day[])
  }

  useEffect(getDataOnMount, [])

  const weekString = getWeekString(startDate, endDate)

  const isNoMarks =
    lessonsState?.length &&
    !lessonsState?.some((day) =>
      day.lessons?.some((lesson) =>
        lesson.gradebook?.tasks?.some((task) => task.mark)
      )
    )

  const ScheduleGroupAside = (
    <ScheduleAsideButtons
      handleGetLesson={getActualUserLessons}
      showSnackbar={showSnackbar}
      endDate={endDate}
      startDate={startDate}
      setEndDate={setEndDate}
      setStartDate={setStartDate}
    />
  )

  const RecentMarksWithSpinner = withSpinner(RecentMarks)
  const ScheduleGroupWithSpinner = withSpinner(ScheduleGroup)

  const MarksHeader = (
    <Header mode='secondary'>
      Оценки за неделю {isNoMarks && 'отсутствуют'}
    </Header>
  )

  if (isError) {
    return <ErrorPlaceholder onClick={getLessons} />
  }

  return (
    <Layout id={id}>
      <PullToRefresh onRefresh={getLessons} isFetching={isLoading}>
        <Div>
          <Group header={MarksHeader}>
            <RecentMarksWithSpinner
              lessonsState={lessonsState}
              shouldShowSpinner={isLoading}
              shouldReverse
            />
          </Group>
          <Suspense id='ScheduleGroup' mode='screen'>
            <Group
              header={
                <Header
                  aside={ScheduleGroupAside}
                  mode='secondary'
                  // @TODO: ??
                  style={{ alignItems: 'center' }}
                >
                  {weekString}
                </Header>
              }
            >
              <ScheduleGroupWithSpinner
                shouldShowSpinner={isLoading}
                lessonsState={lessonsState}
              />
            </Group>
          </Suspense>
        </Div>
        {snackbar}
        {rateSnackbar}
      </PullToRefresh>
    </Layout>
  )
}

export default Schedule
