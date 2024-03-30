import { SubjectMarksItem } from '@utils'
import { FC } from 'preact/compat'

import { renderMarksOrAbsence } from './helpers'

import './index.css'

interface IMarksList {
  marks: SubjectMarksItem[]
}

const MarksList: FC<IMarksList> = ({ marks }) => (
  <div className='marksList'>
    {marks
      .filter((mark) => mark.marks.length > 0)
      .map(({ date, marks: markValues, absenceType }) => (
        <div key={`${date}_${absenceType}`} className='marksList__item'>
          {renderMarksOrAbsence(markValues, absenceType)}
        </div>
      ))}
  </div>
)

export default MarksList
