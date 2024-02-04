import { FC } from 'preact/compat'
import { AcademicRecord } from '@diary-spo/shared'
import { Table } from './Table.tsx'
import { buildSubjectMatrix, collectUniqueKeys } from './utils.ts'

interface Props {
  data: AcademicRecord
}

const FinalMarks: FC<Props> = ({ data }) => {
  if (!data) {
    return null
  }

  const subjectMatrix = buildSubjectMatrix(data)
  const uniqueKeys = collectUniqueKeys(subjectMatrix)

  return (
    <div style={{ height: '90vh', overflowX: 'auto' }}>
      <Table subjectMatrix={subjectMatrix} uniqueKeys={uniqueKeys} />
    </div>
  )
}

export default FinalMarks
