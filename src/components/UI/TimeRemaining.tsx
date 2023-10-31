import { getTimeRemaining } from '../../utils'
import { CSSProperties } from 'preact/compat'
import { FunctionComponent } from 'preact'

interface ITimeRemaining {
  lessonDate: Date
  startTime: string
  endTime: Date
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
  lessonDate.setHours(Number(startTime.split(':')[0]))
  lessonDate.setMinutes(Number(startTime.split(':')[1]))

  const timeRemainingText = getTimeRemaining(currentDate, endTime, lessonDate)

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
