import type { MarkKeys } from '@diary-spo/shared'
import {
  Icon20IncognitoOutline,
  Icon20StatisticsOutline
} from '@vkontakte/icons'
import { MiniInfoCell } from '@vkontakte/vkui'
import type { FC } from 'preact/compat'

import { Mark } from '@components'

import { calculateAverageMark } from './helpers'

import './index.css'

interface IAverageMarkCell {
  marks: MarkKeys[]
}

const NoMarks = (
  <MiniInfoCell before={<Icon20IncognitoOutline />}>Нет оценок</MiniInfoCell>
)

const AverageMarkCell: FC<IAverageMarkCell> = ({ marks }) => {
  if (!marks.length) {
    return NoMarks
  }

  return (
    <MiniInfoCell
      textWrap='full'
      before={<Icon20StatisticsOutline />}
      className='averageMarkCell'
      after={<Mark mark={calculateAverageMark(marks)} size='s' />}
    >
      Средний балл:
    </MiniInfoCell>
  )
}

export default AverageMarkCell
