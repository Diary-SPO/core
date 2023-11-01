import { convertStringToTime, getTimeRemaining } from '@utils'
import { CSSProperties } from 'preact/compat'
import { FunctionComponent } from 'preact'

interface ITimeRemaining {
  lessonDate: Date
  startTime: string
  endTime: string
}

const timeRemainingStyles: CSSProperties = {
  margin: '5px 0',
  display: 'inline-block',
  padding: '3px 5px',
  borderRadius: '5px',
}

const TimeRemaining: FunctionComponent<ITimeRemaining> = ({
  lessonDate,
  startTime,
  endTime,
}) => {
  if (!lessonDate || !startTime || !endTime) {
    return null
  }

  const currentDate = new Date()

  const lessonEndDate = convertStringToTime(endTime, lessonDate)

  if (!lessonEndDate) {
    // Handle the case where the conversion fails
    return null
  }

  const timeRemainingText = getTimeRemaining(
    currentDate,
    lessonEndDate,
    lessonDate
  )

  if (!timeRemainingText) {
    return null
  }

  const isRed = parseInt(timeRemainingText, 10) < 30

  const styles: CSSProperties = {
    ...timeRemainingStyles,
    border: isRed
      ? '1px solid var(--vkui--color_background_negative)'
      : '1px solid var(--vkui--color_accent_violet)',
    color: isRed
      ? 'var(--vkui--color_background_negative)'
      : 'var(--vkui--color_accent_violet)',
  }

  return <div style={styles}>{timeRemainingText}</div>
}

export default TimeRemaining
