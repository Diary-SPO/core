import { FC } from 'react'
import { MiniInfoCell } from '@vkontakte/vkui'
import {
  Icon20IncognitoOutline,
  Icon20StatisticsOutline,
} from '@vkontakte/icons'
import { calculateAverageMark } from '../../../utils'

const NoMarks = (
  <MiniInfoCell before={<Icon20IncognitoOutline />}>Нет оценок</MiniInfoCell>
)

const AverageMarkCell: FC<{ averageMark: number | null; marks: string[] }> = ({
  averageMark,
  marks,
}) => {
  if (averageMark !== null) {
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
  return NoMarks
}
export default AverageMarkCell
