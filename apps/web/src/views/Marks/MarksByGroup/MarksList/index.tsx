import { SubjectMarksMap } from '@utils'
import { FC } from 'preact/compat'
import { renderMarksOrAbsence } from './helpers'

interface IMarksList {
  marks: SubjectMarksMap[string]
}

const MarksList: FC<IMarksList> = ({ marks }) => (
  <div className='marksList'>
    {marks.map(({ date, marks: markValues, absenceType }) => (
      <div key={`${date}_${absenceType}`} className='marksList__item'>
        {renderMarksOrAbsence(markValues, absenceType)}
      </div>
    ))}
  </div>
)

export default MarksList
