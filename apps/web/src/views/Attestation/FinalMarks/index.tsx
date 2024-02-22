import { AcademicRecord } from '@diary-spo/shared'
import { FC } from 'preact/compat'
import { Table } from './Table'
import { buildSubjectMatrix } from './Table/buildSubjectMatrix.ts'
import { ScreenSpinner } from '@vkontakte/vkui'

import './index.css'

interface Props {
  data: AcademicRecord
  isDataLoading: boolean
}

const FinalMarks: FC<Props> = ({ isDataLoading, data }) => {
  if (isDataLoading) {
    return <ScreenSpinner />
  }

  if (!data) {
    return
  }

  const subjectMatrix = buildSubjectMatrix(data)

  return (
    <div className='tableWrapper'>
      <Table subjectMatrix={subjectMatrix} />
    </div>
  )
}

export default FinalMarks
