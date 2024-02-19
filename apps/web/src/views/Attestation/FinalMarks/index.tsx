import { AcademicRecord } from '@diary-spo/shared'
import { FC } from 'preact/compat'
import { Table } from './Table'
import { buildSubjectMatrix } from './Table/utils.ts'
import { ScreenSpinner } from '@vkontakte/vkui'

interface Props {
  data: AcademicRecord
  isDataLoading: boolean
}

const FinalMarks: FC<Props> = ({ isDataLoading, data }) => {
  if (isDataLoading) {
    return <ScreenSpinner />
  }

  if (!data) {
    return null
  }

  const subjectMatrix = buildSubjectMatrix(data)

  return (
    <div style={{ height: '80vh', overflowX: 'auto' }}>
      <Table subjectMatrix={subjectMatrix} />
    </div>
  )
}

export default FinalMarks
