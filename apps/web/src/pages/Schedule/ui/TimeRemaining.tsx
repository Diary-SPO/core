import type { CSSProperties, FC } from 'react'

import { VKUI_RED_BG, VKUI_VIOLET } from '../../../shared/config'

import { convertStringToTime, getTimeRemaining } from '../lib'

interface ITimeRemaining {
  lessonDate: Date
  startTime: string
  endTime: string
}

const timeRemainingStyles: CSSProperties = {
  margin: '5px 0',
  display: 'inline-block',
  padding: '3px 5px',
  borderRadius: '5px'
}

const TimeRemaining: FC<ITimeRemaining> = ({
  lessonDate,
  startTime,
  endTime
}) => {
  if (!lessonDate || !startTime || !endTime) {
    return null
  }

  const currentDate = new Date()

  const lessonEndDate = convertStringToTime(endTime, lessonDate)
  const lessonStartDate = convertStringToTime(startTime, lessonDate)

  if (!lessonEndDate || !lessonStartDate) {
    return null
  }

  const timeRemainingText = getTimeRemaining(
    currentDate,
    lessonEndDate,
    lessonStartDate
  )

  if (!timeRemainingText) {
    return null
  }

  const isRed = Number.parseInt(timeRemainingText, 10) < 30
  const currentColor = isRed ? VKUI_RED_BG : VKUI_VIOLET

  const styles: CSSProperties = {
    ...timeRemainingStyles,
    border: `1px solid ${currentColor}`,
    color: currentColor
  }

  return <div style={styles}>{timeRemainingText}</div>
}

export default TimeRemaining
