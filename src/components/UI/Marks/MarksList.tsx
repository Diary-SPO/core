import { AbsenceTypes, Grade } from '@diary-spo/shared'
import { SubjectMarksMap } from '@utils'
import { FC } from 'react'
import Mark from '../Mark'

interface IMarksList {
  marks: SubjectMarksMap[string]
}

// TODO: refactor
const MarksList: FC<IMarksList> = ({ marks }) => (
  // TODO: перенести в функцию / разделить логику
  <div style={{ display: 'flex' }}>
    {marks.map(({ date, marks: markValues, absenceType }) => (
      <div
        key={`${date}_${absenceType}`}
        style={{ display: 'flex', gap: 5, marginLeft: 10 }}
      >
        {markValues.length && !absenceType ? (
          markValues.map((mark, k) => (
            <Mark key={k} mark={Grade[mark]} size='s' />
          ))
        ) : absenceType ? (
          <Mark size='s' mark={AbsenceTypes[absenceType]} />
        ) : undefined}
      </div>
    ))}
  </div>
)

export default MarksList
