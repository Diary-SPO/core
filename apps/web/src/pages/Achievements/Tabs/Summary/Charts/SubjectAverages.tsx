import type { FC } from 'react'
import type { SubjectAverage } from '../chartData'

interface Props {
  subjects: SubjectAverage[]
}

const shortName = (name: string) =>
  name.length > 36 ? `${name.slice(0, 34)}…` : name

const barColor = (average: number) => {
  if (average >= 4.5) return '#56ab2f'
  if (average >= 3.5) return '#8bc34a'
  if (average >= 2.5) return '#e56d1f'
  return '#ff416c'
}

const SubjectAverages: FC<Props> = ({ subjects }) => {
  if (!subjects.length) return null

  // Показываем топ и аутсайдеров, если дисциплин много.
  const list =
    subjects.length <= 8
      ? subjects
      : [...subjects.slice(0, 5), ...subjects.slice(-3)]

  const max = Math.max(...list.map((s) => s.average), 5)

  return (
    <div className='subjectChart' aria-label='Средний балл по дисциплинам'>
      {list.map((subject, index) => {
        const showDivider =
          subjects.length > 8 && index === 5
        return (
          <div key={`${subject.name}-${index}`}>
            {showDivider && (
              <div className='subjectChart__divider'>…</div>
            )}
            <div className='subjectChart__row'>
              <div className='subjectChart__name' title={subject.name}>
                {shortName(subject.name)}
              </div>
              <div className='subjectChart__track'>
                <div
                  className='subjectChart__fill'
                  style={{
                    width: `${(subject.average / max) * 100}%`,
                    background: barColor(subject.average)
                  }}
                />
              </div>
              <div className='subjectChart__value'>
                {subject.average.toFixed(2)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SubjectAverages
