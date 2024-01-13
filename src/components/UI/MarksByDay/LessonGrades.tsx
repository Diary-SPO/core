import { truncateString } from '@utils'
import { Header, HorizontalCell } from '@vkontakte/vkui'
import { FunctionalComponent } from 'preact'
import { CSSProperties } from 'preact/compat'
import Mark from '../Mark'

export interface ILessonGrades {
  [lessonName: string]: number[]
}

interface LessonGradesProps {
  day: string
  lessonGrades: ILessonGrades
}

const marksGap: CSSProperties = { display: 'flex' }

const LessonGrades: FunctionalComponent<LessonGradesProps> = ({
  day,
  lessonGrades
}) => {
  return (
    <div key={day}>
      <Header mode='secondary' className='recentMarks'>
        {day}
      </Header>
      <div style={marksGap}>
        {Object.entries(lessonGrades).map(([lessonName, grades]) => (
          <div
            className='marksWrapper'
            style={marksGap}
            key={`${day}_${lessonName}`}
          >
            {grades.map((grade, gradeIndex) => (
              // @ts-expect-error Типы не совместимы
              <HorizontalCell
                style={{ maxWidth: 'unset' }}
                key={`${day}_${lessonName}_${gradeIndex}`}
              >
                <Mark
                  bottom={truncateString(lessonName, 18)}
                  style={{ maxWidth: 80 }}
                  mark={grade}
                />
              </HorizontalCell>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default LessonGrades
