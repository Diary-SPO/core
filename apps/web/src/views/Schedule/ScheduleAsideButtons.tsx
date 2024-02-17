import { ExplanationTooltip } from '@components'
import { SnackbarData } from '@hooks'
import {
  Icon16ArrowLeftOutline,
  Icon16ArrowRightOutline
} from '@vkontakte/icons'
import { Button, ButtonGroup, IconButton } from '@vkontakte/vkui'
import { endOfWeek, startOfWeek } from '@vkontakte/vkui/dist/lib/date'
import { FC, useEffect, useState } from 'preact/compat'
import useDebouncedChangeWeek from './hooks/useDebouncedChangeWeek.tsx'

interface ScheduleAsideButtonsProps {
  handleGetLesson: (start: Date, end: Date) => void
  showSnackbar: (data: SnackbarData) => void
  startDate: Date
  endDate: Date
  setStartDate: (startWeek: Date) => void
  setEndDate: (endWeek: Date) => void
}

const localeOptions: { year: 'numeric'; month: 'short'; day: 'numeric' } = {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
}

const ScheduleAsideButtons: FC<ScheduleAsideButtonsProps> = ({
  handleGetLesson,
  startDate,
  endDate,
  showSnackbar,
  setStartDate,
  setEndDate
}) => {
  const [isCurrent, setIsCurrent] = useState(false)
  const debouncedChangeWeekHook = useDebouncedChangeWeek(
    startDate,
    endDate,
    setIsCurrent,
    setStartDate,
    setEndDate
  )
  const { handleButtonClick: debouncedHandleButtonClick } =
    debouncedChangeWeekHook

  const newDate = new Date()

  /** Для обновления текущей недели **/
  useEffect(() => {
    const startWeek = startOfWeek(startDate)
    const startOfCurrWeek = startOfWeek(newDate)

    const startWeekStr = startWeek.toLocaleString('default', localeOptions)

    const startOfCurrWeekStr = startOfCurrWeek.toLocaleString(
      'default',
      localeOptions
    )

    if (startWeekStr === startOfCurrWeekStr) {
      localStorage.setItem('isCurrent', JSON.stringify(true))
      localStorage.setItem('currentDate', startDate.toString())
      setIsCurrent(true)
      return
    }

    localStorage.setItem('isCurrent', JSON.stringify(false))
    localStorage.setItem('currentDate', startDate.toString())
    setIsCurrent(false)
  }, [startDate])

  const getCurrentWeek = async () => {
    const startWeek = startOfWeek(newDate)
    const startOfCurrWeek = startOfWeek(startDate)
    const endWeek = endOfWeek(newDate)

    const startWeekStr = startWeek.toLocaleString('default', localeOptions)

    const startOfCurrWeekStr = startOfCurrWeek.toLocaleString(
      'default',
      localeOptions
    )

    if (startWeekStr === startOfCurrWeekStr) {
      showSnackbar({
        title: 'Вы уже на текущей неделе'
      })
      localStorage.setItem('isCurrent', JSON.stringify(true))
      setIsCurrent(true)
      return
    }

    try {
      handleGetLesson(startWeek, endWeek)
      setStartDate(startWeek)
      setEndDate(endWeek)

      localStorage.setItem('isCurrent', JSON.stringify(true))
      setIsCurrent(true)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <ButtonGroup
      style={{
        alignItems: 'center',
        position: 'relative',
        color: 'var(--vkui--color_stroke_accent_themed)'
      }}
      gap='s'
    >
      {/*// @ts-ignore Типы React не совместимы с Preact*/}
      <IconButton
        aria-label='Prev'
        onClick={() => debouncedHandleButtonClick('prev', handleGetLesson)}
      >
        <Icon16ArrowLeftOutline />
      </IconButton>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/*// @ts-ignore Типы React не совместимы с Preact*/}
        <Button
          size='m'
          mode='secondary'
          onClick={() => getCurrentWeek()}
          disabled={isCurrent}
        >
          Домой
        </Button>
        <ExplanationTooltip tooltipContent='Вернёт вас на текущую неделю' />
      </div>

      {/*// @ts-ignore Типы React не совместимы с Preact*/}
      <IconButton
        aria-label='Next'
        onClick={() => debouncedHandleButtonClick('next', handleGetLesson)}
      >
        <Icon16ArrowRightOutline />
      </IconButton>
    </ButtonGroup>
  )
}

export default ScheduleAsideButtons
