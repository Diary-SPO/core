import { AcademicRecord } from '@diary-spo/shared'
import { FC } from 'preact/compat'
import { Table } from './Table.tsx'
import { buildSubjectMatrix } from './utils.ts'

interface Props {
  data: AcademicRecord
}

const FinalMarks: FC<Props> = ({ data }) => {
  if (!data) {
    return null
  }

  const subjectMatrix = buildSubjectMatrix(data)
  console.log('subjectMatrix', subjectMatrix)
  return (
    <div style={{ height: '80vh', overflowX: 'auto' }}>
      <Table subjectMatrix={subjectMatrix} />
    </div>
  )
}

export default FinalMarks
