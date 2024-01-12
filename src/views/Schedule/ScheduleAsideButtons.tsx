import { ExplanationTooltip } from '@components'
import { Day } from '@diary-spo/shared'
import {
  Icon16ArrowLeftOutline,
  Icon16ArrowRightOutline
} from '@vkontakte/icons'
import { Button, ButtonGroup, IconButton } from '@vkontakte/vkui'
import { FC } from 'react'

interface ScheduleAsideButtonsProps {
  debouncedHandleButtonClick: (
    arg: 'prev' | 'next',
    cb: (start: Date, end: Date) => void
  ) => void
  handleGetLesson: (start: Date, end: Date) => Promise<number | Day[]>
  isCurrent: boolean
  getCurrentWeek: () => Promise<void>
}

const ScheduleAsideButtons: FC<ScheduleAsideButtonsProps> = ({
  debouncedHandleButtonClick,
  handleGetLesson,
  isCurrent,
  getCurrentWeek
}) => {
  return (
    <ButtonGroup
      style={{
        alignItems: 'center',
        position: 'relative',
        color: 'var(--vkui--color_stroke_accent_themed)'
      }}
      gap='s'
    >
      <IconButton
        aria-label='Prev'
        onClick={() => debouncedHandleButtonClick('prev', handleGetLesson)}
      >
        <Icon16ArrowLeftOutline />
      </IconButton>
      <Button
        size='s'
        mode='secondary'
        onClick={() => getCurrentWeek()}
        disabled={isCurrent}
      >
        <ExplanationTooltip
          tooltipContent='Вернёт вас на текущую неделю'
          text='Домой'
        />
      </Button>
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
