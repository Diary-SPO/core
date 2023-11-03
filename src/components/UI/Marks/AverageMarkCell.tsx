import { FC } from 'react'
import { MiniInfoCell } from '@vkontakte/vkui'
import {
  Icon20IncognitoOutline,
  Icon20StatisticsOutline,
} from '@vkontakte/icons'
import { calculateAverageMark } from '@utils'

interface IAverageMarkCell {
  marks: string[]
}

const NoMarks = (
  <MiniInfoCell before={<Icon20IncognitoOutline />}>Нет оценок</MiniInfoCell>
)

const AverageMarkCell: FC<IAverageMarkCell> = ({ marks }) => {
  if (!marks) {
    return NoMarks
  }

  return (
    <MiniInfoCell
      textWrap="full"
      before={<Icon20StatisticsOutline />}
      style={{ marginTop: 5 }}
      after={calculateAverageMark(marks)}
    >
      Средний балл:
    </MiniInfoCell>
  )
}

export default AverageMarkCell
