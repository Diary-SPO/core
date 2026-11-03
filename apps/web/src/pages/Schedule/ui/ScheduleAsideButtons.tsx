import {
  Icon16ArrowLeftOutline,
  Icon16ArrowRightOutline
} from '@vkontakte/icons'
import { useWeekPicker } from '@store'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { IconButton } from '@vkontakte/vkui'
import { endOfWeek } from 'date-fns/endOfWeek'
import { startOfWeek } from 'date-fns/startOfWeek'
import { type FC, useEffect, useState } from 'react'

import type { SnackbarData } from '../../../shared/hooks'
import { MODAL_PAGE_WEEK_PICKER } from '../../../shared/config'
import { useDebouncedChangeWeek } from '../hooks'

import './WeekNav.css'

export type WeekDirection = 'prev' | 'next'

export interface WeekNavApi {
  changeWeek: (direction: WeekDirection) => void
}

interface ScheduleAsideButtonsProps {
  handleGetLesson: (start: Date, end: Date) => void
  showSnackbar: (data: SnackbarData) => void
  startDate: Date
  endDate: Date
  setStartDate: (startWeek: Date) => void
  setEndDate: (endWeek: Date) => void
  weekString: string
  onWeekChange?: (direction: WeekDirection) => void
  onReady?: (api: WeekNavApi) => void
}

const localeOptions: { year: 'numeric'; month: 'short'; day: 'numeric' } = {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
}

const sameWeek = (a: Date, b: Date) =>
  startOfWeek(a).toLocaleString('default', localeOptions) ===
  startOfWeek(b).toLocaleString('default', localeOptions)

const ScheduleAsideButtons: FC<ScheduleAsideButtonsProps> = ({
  handleGetLesson,
  startDate,
  endDate,
  showSnackbar,
  setStartDate,
  setEndDate,
  weekString,
  onWeekChange,
  onReady
}) => {
  const routeNavigator = useRouteNavigator()
  const { setWeekPicker } = useWeekPicker()
  const [isCurrent, setIsCurrent] = useState(false)
  const { changeWeekNow } = useDebouncedChangeWeek(
    startDate,
    endDate,
    setIsCurrent,
    setStartDate,
    setEndDate
  )

  useEffect(() => {
    const current = sameWeek(startDate, new Date())
    localStorage.setItem('isCurrent', JSON.stringify(current))
    localStorage.setItem('currentDate', startDate.toString())
    setIsCurrent(current)
  }, [startDate])

  useEffect(() => {
    onReady?.({
      changeWeek: (direction) => {
        onWeekChange?.(direction)
        changeWeekNow(direction, handleGetLesson)
      }
    })
  }, [onReady, onWeekChange, changeWeekNow, handleGetLesson])

  const applyWeek = (start: Date, end: Date) => {
    handleGetLesson(start, end)
    setStartDate(start)
    setEndDate(end)
    const current = sameWeek(start, new Date())
    localStorage.setItem('isCurrent', JSON.stringify(current))
    localStorage.setItem('currentDate', start.toString())
    setIsCurrent(current)
  }

  const goCurrentWeek = () => {
    if (isCurrent) {
      showSnackbar({ title: 'Вы уже на текущей неделе' })
      return
    }
    applyWeek(startOfWeek(new Date()), endOfWeek(new Date()))
  }

  const openWeekPicker = () => {
    setWeekPicker({
      startDate,
      endDate,
      isCurrent,
      onSelectWeek: (start, end) => applyWeek(start, end),
      onCurrentWeek: goCurrentWeek
    })
    void routeNavigator.showModal(MODAL_PAGE_WEEK_PICKER)
  }

  return (
    <div className='diary-week-nav diary-home-controls'>
      <IconButton
        aria-label='Предыдущая неделя'
        onClick={() => {
          onWeekChange?.('prev')
          changeWeekNow('prev', handleGetLesson)
        }}
      >
        <Icon16ArrowLeftOutline />
      </IconButton>
      <button
        type='button'
        className='diary-week-nav__label'
        onClick={openWeekPicker}
      >
        {weekString}
      </button>
      <IconButton
        aria-label='Следующая неделя'
        onClick={() => {
          onWeekChange?.('next')
          changeWeekNow('next', handleGetLesson)
        }}
      >
        <Icon16ArrowRightOutline />
      </IconButton>
    </div>
  )
}

export default ScheduleAsideButtons
