import { calculateAverageMark } from '@utils'
import {
  Icon20IncognitoOutline,
  Icon20StatisticsOutline
} from '@vkontakte/icons'
import { MiniInfoCell } from '@vkontakte/vkui'
import { FC } from 'react'

interface IAverageMarkCell {
  marks: string[]
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
      style={{ marginTop: 5 }}
      after={calculateAverageMark(marks)}
    >
      Средний балл:
    </MiniInfoCell>
  )
}

export default AverageMarkCell
