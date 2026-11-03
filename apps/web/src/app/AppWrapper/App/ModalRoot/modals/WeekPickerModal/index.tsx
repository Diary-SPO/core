import { Icon24ChevronLeft, Icon24ChevronRight } from '@vkontakte/icons'
import { useWeekPicker } from '@store'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import {
  Button,
  Div,
  IconButton,
  ModalPage,
  ModalPageHeader
} from '@vkontakte/vkui'
import { endOfWeek } from 'date-fns/endOfWeek'
import { isSameDay } from 'date-fns/isSameDay'
import { startOfWeek } from 'date-fns/startOfWeek'
import { type FC, useEffect, useMemo, useState } from 'react'

import { getWeekString } from '../../../../../../pages/Schedule/lib'

import './index.css'

interface WeekPickerModalProps {
  id: string
}

interface WeekItem {
  start: Date
  end: Date
  days: Date[]
}

const weeksForMonth = (view: Date): WeekItem[] => {
  const year = view.getFullYear()
  const month = view.getMonth()
  let cursor = startOfWeek(new Date(year, month, 1))
  const last = endOfWeek(new Date(year, month + 1, 0))
  const weeks: WeekItem[] = []

  while (cursor <= last) {
    const start = new Date(cursor)
    const end = endOfWeek(start)
    if (end.getMonth() === month || start.getMonth() === month) {
      const days: Date[] = []
      for (let i = 0; i < 7; i++) {
        const day = new Date(start)
        day.setDate(start.getDate() + i)
        days.push(day)
      }
      weeks.push({ start, end, days })
    }
    cursor = new Date(start)
    cursor.setDate(cursor.getDate() + 7)
  }

  return weeks
}

const monthTitle = (view: Date) =>
  view
    .toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
    .replace(/\s?г\.$/, '')

const WeekPickerModal: FC<WeekPickerModalProps> = ({ id }) => {
  const routeNavigator = useRouteNavigator()
  const { startDate, isCurrent, onSelectWeek, onCurrentWeek } = useWeekPicker()
  const [viewMonth, setViewMonth] = useState(
    () => new Date(startDate.getFullYear(), startDate.getMonth(), 1)
  )

  useEffect(() => {
    setViewMonth(new Date(startDate.getFullYear(), startDate.getMonth(), 1))
  }, [startDate])

  const weeks = useMemo(() => weeksForMonth(viewMonth), [viewMonth])
  const selectedStart = startOfWeek(startDate)
  const today = useMemo(() => new Date(), [])
  const viewMonthIndex = viewMonth.getMonth()

  const shiftMonth = (delta: number) => {
    setViewMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1)
    )
  }

  return (
    <ModalPage id={id} dynamicContentHeight>
      <ModalPageHeader>Выбор недели</ModalPageHeader>
      <Div className='diary-week-picker-modal'>
        <div className='diary-week-picker-modal__month'>
          <IconButton
            aria-label='Предыдущий месяц'
            onClick={() => shiftMonth(-1)}
          >
            <Icon24ChevronLeft />
          </IconButton>
          <span className='diary-week-picker-modal__month-title'>
            {monthTitle(viewMonth)}
          </span>
          <IconButton
            aria-label='Следующий месяц'
            onClick={() => shiftMonth(1)}
          >
            <Icon24ChevronRight />
          </IconButton>
        </div>

        <div className='diary-week-picker-modal__dow' aria-hidden>
          {['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'].map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className='diary-week-picker-modal__list'>
          {weeks.map((week) => {
            const selected = isSameDay(week.start, selectedStart)
            const current = isSameDay(week.start, startOfWeek(today))
            return (
              <button
                key={week.start.toISOString()}
                type='button'
                className={
                  selected
                    ? 'diary-week-picker-modal__week diary-week-picker-modal__week--selected'
                    : 'diary-week-picker-modal__week'
                }
                onClick={() => {
                  onSelectWeek?.(week.start, week.end)
                  routeNavigator.hideModal()
                }}
              >
                <span className='diary-week-picker-modal__week-label'>
                  {getWeekString(week.start, week.end)}
                  {current ? ' · текущая' : ''}
                </span>
                <span className='diary-week-picker-modal__days'>
                  {week.days.map((day) => {
                    const outside = day.getMonth() !== viewMonthIndex
                    const isToday = isSameDay(day, today)
                    return (
                      <span
                        key={day.toISOString()}
                        className={[
                          'diary-week-picker-modal__day',
                          outside
                            ? 'diary-week-picker-modal__day--muted'
                            : '',
                          isToday
                            ? 'diary-week-picker-modal__day--today'
                            : ''
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {day.getDate()}
                      </span>
                    )
                  })}
                </span>
              </button>
            )
          })}
        </div>

        <Button
          className='diary-home-button'
          size='l'
          mode='secondary'
          appearance='neutral'
          stretched
          disabled={isCurrent}
          onClick={() => {
            onCurrentWeek?.()
            routeNavigator.hideModal()
          }}
        >
          К текущей неделе
        </Button>
      </Div>
    </ModalPage>
  )
}

export default WeekPickerModal
