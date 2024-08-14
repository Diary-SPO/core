import { Group, Header, Placeholder } from '@vkontakte/vkui'
import { type FC, useEffect, useState } from 'react'

import type { AcademicRecord, Nullable } from '@diary-spo/shared'

import {
  handleResponse,
  isApiError,
  isNeedToUpdateCache
} from '../../../../shared'

import { getFinalMarks } from '../../../../shared/api'
import { useRateLimitExceeded } from '../../../../shared/hooks'
import { MarksForSubject } from './MarksForSubject'

interface Props {
  setIsError: (value: boolean) => void
  setIsLoading: (value: boolean) => void
  isLoading: boolean
}

const FinalMarks: FC<Props> = ({ setIsError, setIsLoading, isLoading }) => {
  const [finalMarksData, setFinalMarksData] =
    useState<Nullable<AcademicRecord>>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setIsError(false)

      const data = localStorage.getItem('finalMarksData')

      try {
        if (data && !isNeedToUpdateCache('finalMarksData_time')) {
          setFinalMarksData(JSON.parse(data))
          return
        }

        const { data: finalMarks } = await getFinalMarks()

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
        setIsError(true)
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
    return <Placeholder>Данных нет</Placeholder>
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
