import { AcademicRecord } from '@diary-spo/shared'
import { FC } from 'preact/compat'

import { Table } from './Table'
import './index.css'

interface Props {
  data: AcademicRecord
}

const FinalMarks: FC<Props> = ({ data }) => {
  if (!data) {
    return
  }

  return (
    <div className='tableWrapper'>
      <Table data={data} />
    </div>
  )
}

export default FinalMarks
