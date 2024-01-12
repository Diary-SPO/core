import { truncateString } from '@utils'
import { Header, HorizontalCell } from '@vkontakte/vkui'
import { FunctionalComponent } from 'preact'
import Mark from '../Mark'

export interface ILessonGrades {
  [lessonName: string]: number[]
}

const LessonGrades: FunctionalComponent<{
  day: string
  lessonGrades: ILessonGrades
}> = ({ day, lessonGrades }) => (
  <div key={day}>
    <Header mode='secondary' className='recentMarks'>
      {day}
    </Header>
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
              />
            </HorizontalCell>
          ))}
        </div>
      ))}
    </div>
  </div>
)

export default LessonGrades
