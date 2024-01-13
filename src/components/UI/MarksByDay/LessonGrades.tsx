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
const handleMarkClick = (day: string, lessonName: string, id: number) => {
    console.log(day, lessonName, id)
}
const LessonGrades: FunctionalComponent<LessonGradesProps> = ({
  day,
  lessonGrades
}) => {
    console.error('===========')
    console.log(day)
    console.log(lessonGrades)
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
                            // @ignore Типы не совместимы
                            <HorizontalCell
                                onClick={() => handleMarkClick(day, lessonName, gradeIndex)}
                                style={{ maxWidth: 'unset' }}
                                key={`${day}_${lessonName}_${gradeIndex}`}
                            >
                                <Mark
                                    bottom={truncateString(lessonName, 18)}
                                    style={{ maxWidth: 80 }}
                                    mark={grade || 'Н'}
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
