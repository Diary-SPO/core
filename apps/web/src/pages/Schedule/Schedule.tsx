import type { Day } from '@diary-spo/shared'
import { useLessonFocus } from '@store'
import { Div, Group, Header, PullToRefresh } from '@vkontakte/vkui'
import { endOfWeek } from 'date-fns/endOfWeek'
import { startOfWeek } from 'date-fns/startOfWeek'
import { type FC, useEffect, useRef, useState } from 'react'

import {
  dayAnchorId,
  ErrorPlaceholder,
  isNeedToUpdateCache,
  lessonAnchorId,
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

  const { focus, clearFocus } = useLessonFocus()
  const flashDone = useRef(false)

  useEffect(() => {
    if (!focus) return
    const date = new Date(`${focus.dateISO}T00:00:00`)
    if (Number.isNaN(date.getTime())) {
      clearFocus()
      return
    }
    const start = startOfWeek(date)
    const end = endOfWeek(date)
    setStartDate(start)
    setEndDate(end)
    void getActualUserLessons(start, end)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus])

  useEffect(() => {
    if (!focus) {
      flashDone.current = false
      return
    }
    if (isLoading || (!lessonsState && !isError)) return
    // View при смене панели сам скроллит в 0 уже после дочерних эффектов,
    // поэтому скроллим отложенно, когда переход завершён.
    const flash = (target: HTMLElement) => {
      const hover = 'var(--vkui--color_transparent--hover)'
      try {
        target.animate(
          [{ backgroundColor: 'transparent' }, { backgroundColor: hover }],
          {
            duration: 600,
            iterations: 4,
            direction: 'alternate',
            easing: 'ease-in-out'
          }
        )
      } catch {
        const prevBackground = target.style.background
        target.style.background = hover
        setTimeout(() => {
          target.style.background = prevBackground
        }, 2400)
      }
    }
    const nearestDay = (): HTMLElement | null => {
      let best: HTMLElement | null = null
      let bestDiff = Number.POSITIVE_INFINITY
      const wanted = new Date(`${focus.dateISO}T00:00:00`).getTime()
      for (const el of document.querySelectorAll<HTMLElement>('[id^="day-"]')) {
        const stamp = new Date(`${el.id.slice(4)}T00:00:00`).getTime()
        if (Number.isNaN(stamp)) continue
        const diff = Math.abs(stamp - wanted)
        if (diff < bestDiff) {
          bestDiff = diff
          best = el
        }
      }
      return bestDiff <= 3 * 24 * 3600 * 1000 ? best : null
    }
    const findTarget = (): HTMLElement | null => {
      const dayEl = document.getElementById(dayAnchorId(focus.dateISO))
      const lessonEl = document.getElementById(
        lessonAnchorId(focus.dateISO, focus.lessonIndex)
      )
      return lessonEl ?? dayEl ?? nearestDay()
    }
    const isReady = (el: HTMLElement | null): el is HTMLElement => {
      if (!el || el.offsetParent === null) return false
      const rect = el.getBoundingClientRect()
      return rect.width > 0 && rect.height > 0
    }
    const attempt = (): boolean => {
      if (flashDone.current) return true
      const target = findTarget()
      console.log('[lessonFocus]', {
        dateISO: focus.dateISO,
        lessonIndex: focus.lessonIndex,
        targetId: target?.id ?? null,
        ready: isReady(target)
      })
      if (!isReady(target)) return false
      flashDone.current = true
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Замеряем заново после скролла: узел мог пересоздаться.
      setTimeout(() => {
        const live = findTarget()
        if (!isReady(live)) return
        flash(live)
      }, 650)
      return true
    }
    const timers = [
      window.setTimeout(() => {
        if (attempt()) clearFocus()
      }, 350),
      window.setTimeout(() => {
        attempt()
        clearFocus()
      }, 1200)
    ]
    return () => timers.forEach((timer) => clearTimeout(timer))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus, lessonsState, isLoading, isError])

  const getDataOnMount = () => {
    if (focus) return

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
    Boolean(lessonsState?.length) &&
    !lessonsState?.some((day) =>
      day.lessons?.some((lesson) => (lesson.gradebook?.tasks?.length ?? 0) > 0)
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
    <Header size='s'>Оценки за неделю{isNoMarks ? ' отсутствуют' : ''}</Header>
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
          <Group
            header={
              <Header
                after={ScheduleGroupAside}
                size='s'
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
        </Div>
        {snackbar}
        {rateSnackbar}
      </PullToRefresh>
    </Layout>
  )
}

export default Schedule
