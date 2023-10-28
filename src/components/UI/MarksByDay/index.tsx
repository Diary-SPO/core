import { FunctionalComponent } from 'preact'
import {
  Group,
  Header,
  HorizontalCell,
  HorizontalScroll,
} from '@vkontakte/vkui'
import { PerformanceCurrent } from 'diary-shared'
import Mark from '../Mark'
import { Grade } from '../../../types'
import './index.css'
import { extractMarksByDay } from '../../../utils/extractMarksByDay'
import { sortByDay } from '../../../utils/sortByDay'
import { truncateString } from '../../../utils/truncateString'

interface IPerformanceCurrent {
  performanceData: PerformanceCurrent | null
}

export interface IMarksByDay {
  [key: string]: {
    [lessonName: string]: Grade[]
  }
}

const MarksByDay: FunctionalComponent<IPerformanceCurrent> = ({
  performanceData,
}) => {
  const marksByDay = extractMarksByDay(performanceData)

  return (
    <Group header={<Header mode="secondary">Недавние оценки</Header>}>
      <HorizontalScroll
        showArrows
        getScrollToLeft={(i) => i - 120}
        getScrollToRight={(i) => i + 120}
      >
        <div className="marksByName">
          {Object.entries(sortByDay(marksByDay)).map(([day, lessonGrades]) => (
            <div key={day}>
              <Header mode="secondary">{day}</Header>
              <div style={{ display: 'flex' }}>
                {Object.entries(lessonGrades).map(([lessonName, grades]) => (
                  <div style={{ display: 'flex' }} key={`${day}_${lessonName}`}>
                    {grades.map((grade, gradeIndex) => (
                      // @ts-ignore
                      <HorizontalCell
                        style={{ maxWidth: 'unset' }}
                        key={`${day}_${lessonName}_${gradeIndex}`}
                      >
                        <Mark
                          bottom={truncateString(lessonName, 18)}
                          style={{ maxWidth: 90 }}
                          mark={grade || 'Н'}
                          useMargin={false}
                          size="l"
                        />
                      </HorizontalCell>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </HorizontalScroll>
    </Group>
  )
}

export default MarksByDay
