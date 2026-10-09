import {
  type AbsenceType,
  AbsenceTypes,
  Grade,
  type Task
} from '@diary-spo/shared'
import { useMarkModal } from '@store'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import type { FC } from 'react'

import type { SubjectMarksItem } from '../../../../../shared'
import { MODAL_PAGE_MARK } from '../../../../../shared/config'
import type { ReturnedMark } from '../../../../../shared/types.ts'
import {
  fetchDaysForDate,
  parseRuDate,
  readCachedDays,
  resolveLesson
} from '../resolveLesson.ts'
import type { MarkSelection } from './helpers'
import { renderMarksOrAbsence } from './helpers'

import './index.css'

interface IMarksList {
  marks: SubjectMarksItem[]
  subjectName: string
}

const toTimeRange = (
  startTime?: string,
  endTime?: string
): string | undefined =>
  startTime && endTime ? `${startTime} — ${endTime}` : undefined

const MarksList: FC<IMarksList> = ({ marks, subjectName }) => {
  const routeNavigator = useRouteNavigator()
  const { setData } = useMarkModal()

  const fallbackMark = (selection: MarkSelection): ReturnedMark | null =>
    (selection.markKey && Grade[selection.markKey]) ||
    (selection.absenceType && AbsenceTypes[selection.absenceType]) ||
    null

  const openMark = async (item: SubjectMarksItem, selection: MarkSelection) => {
    const date = parseRuDate(item.date)
    if (!date) return

    const shown = {
      lessonName: subjectName,
      lessonDate: item.date,
      absenceType: selection.absenceType,
      fallbackMark: fallbackMark(selection)
    }

    const hit = resolveLesson(
      readCachedDays(),
      date,
      subjectName,
      selection.markIndex,
      selection.markKey
    )

    if (hit) {
      const cached = {
        ...shown,
        data: hit.task,
        lessonTime: toTimeRange(hit.startTime, hit.endTime),
        dateISO: hit.dateISO,
        lessonIndex: hit.lessonIndex
      }
      setData({ ...cached, isLoading: true })
      await routeNavigator.showModal(MODAL_PAGE_MARK)
      void refreshInBackground(date, selection, cached)
      return
    }

    setData({ ...shown, data: null, isLoading: true })
    await routeNavigator.showModal(MODAL_PAGE_MARK)

    const days = await fetchDaysForDate(date)
    const fresh = resolveLesson(
      days,
      date,
      subjectName,
      selection.markIndex,
      selection.markKey
    )

    if (fresh) {
      setData({
        ...shown,
        data: fresh.task,
        lessonTime: toTimeRange(fresh.startTime, fresh.endTime),
        dateISO: fresh.dateISO,
        lessonIndex: fresh.lessonIndex
      })
      return
    }

    setData({ ...shown, data: null, isLoading: false, loadError: !days })
  }

  const refreshInBackground = async (
    date: Date,
    selection: MarkSelection,
    cached: {
      lessonName: string
      lessonDate: string
      absenceType: AbsenceType | undefined
      fallbackMark: ReturnedMark | null
      data: Task | null
      lessonTime?: string
      dateISO: string
      lessonIndex: number
    }
  ) => {
    try {
      const days = await fetchDaysForDate(date)
      if (!days) {
        setData({ ...cached, isLoading: false })
        return
      }
      const fresh = resolveLesson(
        days,
        date,
        subjectName,
        selection.markIndex,
        selection.markKey
      )
      if (!fresh) return
      setData({
        lessonName: cached.lessonName,
        lessonDate: cached.lessonDate,
        absenceType: cached.absenceType,
        fallbackMark: cached.fallbackMark,
        data: fresh.task,
        lessonTime: toTimeRange(fresh.startTime, fresh.endTime),
        dateISO: fresh.dateISO,
        lessonIndex: fresh.lessonIndex,
        isLoading: false
      })
    } catch {
      setData({ ...cached, isLoading: false })
    }
  }

  return (
    <div className='marksList'>
      {marks
        .filter((mark) => mark.marks.length > 0)
        .map(({ date, marks: markValues, absenceType }) => (
          <div key={`${date}_${absenceType}`} className='marksList__item'>
            {renderMarksOrAbsence(markValues, absenceType, (selection) =>
              openMark({ date, marks: markValues, absenceType }, selection)
            )}
          </div>
        ))}
    </div>
  )
}

export default MarksList
