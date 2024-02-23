import { AcademicRecord } from '@diary-spo/shared'
import { FC } from 'preact/compat'
import { Table } from './Table'

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

  return (
    <div className='tableWrapper'>
      <Table data={data} />
    </div>
  )
}

export default FinalMarks
