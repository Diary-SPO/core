import { SubjectMarksMap } from '@utils'
import { FC } from 'preact/compat'
import { renderMarksOrAbsence, styles } from './helpers'

interface IMarksList {
  marks: SubjectMarksMap[string]
}

const MarksList: FC<IMarksList> = ({ marks }) => (
  <div style={{ display: 'flex' }}>
    {marks.map(({ date, marks: markValues, absenceType }) => (
      <div key={`${date}_${absenceType}`} style={styles}>
        {renderMarksOrAbsence(markValues, absenceType)}
      </div>
    ))}
  </div>
)

export default MarksList
