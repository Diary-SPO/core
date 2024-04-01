import { Group, Header, Placeholder } from '@vkontakte/vkui'
import type { FunctionalComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import type { AcademicRecord, Nullable } from '@diary-spo/shared'

import { getFinalMarks } from '@api'
import { useRateLimitExceeded } from '@hooks'
import { handleResponse, isApiError, isNeedToUpdateCache } from '@utils'

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
    const fetchData = async () => {
      setIsLoading(true)
      setIsError(false)

      const finalMarksData = localStorage.getItem('finalMarksData')

      try {
        if (finalMarksData && !isNeedToUpdateCache('finalMarksData_time')) {
          setFinalMarksData(JSON.parse(finalMarksData))
          return
        }

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

        setFinalMarksData(finalMarks.data)
        localStorage.setItem('finalMarksData', JSON.stringify(finalMarks.data))
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
