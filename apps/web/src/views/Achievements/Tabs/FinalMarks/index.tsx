import { Group, Header } from '@vkontakte/vkui'
import { FunctionalComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import { AcademicRecord, Nullable } from '@diary-spo/shared'

import { getFinalMarks } from '@api'
import { useRateLimitExceeded } from '@hooks'
import { handleResponse, isApiError, isNeedToUpdateCache } from '@utils'

import LoadingData from '../../LoadingData'

import { MarksForSubject } from './MarksForSubject'

interface Props {
  setIsError: (value: boolean) => void
  setIsLoading: (value: boolean) => void
  isLoading: boolean
}

const FinalMarks: FunctionalComponent<Props> = ({
  setIsError,
  setIsLoading,
  isLoading
}) => {
  const [finalMarksData, setFinalMarksData] =
    useState<Nullable<AcademicRecord>>(null)

  useEffect(() => {
    const data = localStorage.getItem('finalMarksData')

    if (data && !isNeedToUpdateCache('finalMarksData_time')) {
      setFinalMarksData(JSON.parse(data))
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        const finalMarks = await getFinalMarks()

        handleResponse(
          finalMarks,
          () => setIsError(true),
          useRateLimitExceeded,
          setIsLoading
        )

        if (isApiError(finalMarks)) {
          setIsError(true)
          return
        }

        setFinalMarksData(finalMarks)
        localStorage.setItem('finalMarksData', JSON.stringify(finalMarks))
        localStorage.setItem('finalMarksData_time', JSON.stringify(Date.now()))
      } catch {
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return
  }

  if (!finalMarksData?.subjects?.length) {
    return <LoadingData text='Обработка данных...' />
  }

  return (
    <Group
      mode='plain'
      className='tableWrapper'
      header={<Header mode='tertiary'>Для подробностей нажми на оценку</Header>}
    >
      <MarksForSubject data={finalMarksData} />
    </Group>
  )
}

export default FinalMarks
