import type { AttestationResponse, Nullable } from '@diary-spo/shared'
import { Placeholder } from '@vkontakte/vkui'
import type { FunctionalComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import { getAttestation } from '@api'
import { useRateLimitExceeded } from '@hooks'
import { handleResponse, isApiError, isNeedToUpdateCache } from '@utils'

import SubjectGroup from './SubjectGroup'
import { processAttestationData } from './helpers'

interface Props {
  setIsLoading: (value: boolean) => void
  setIsError: (value: boolean) => void
  isLoading: boolean
}

const SubjectList: FunctionalComponent<Props> = ({
  setIsError,
  setIsLoading,
  isLoading
}) => {
  const [attestationData, setAttestationData] =
    useState<Nullable<AttestationResponse>>(null)

  useEffect(() => {
    const data = localStorage.getItem('attestationData')

    if (data && !isNeedToUpdateCache('attestationData_time')) {
      setAttestationData(JSON.parse(data))
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      setIsError(false)

      try {
        const attestation = await getAttestation()

        handleResponse(
          attestation,
          () => setIsError(true),
          useRateLimitExceeded,
          setIsLoading
        )

        if (isApiError(attestation)) {
          setIsError(true)
          return
        }

        setAttestationData(attestation)
        localStorage.setItem('attestationData', JSON.stringify(attestation))
        localStorage.setItem('attestationData_time', JSON.stringify(Date.now()))
      } catch {
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (!isLoading && !attestationData?.subjects?.length) {
    return <Placeholder>Данных нет</Placeholder>
  }

  const data = processAttestationData(attestationData)

  return (
    <div>
      {Object.keys(data?.semesters).map((semesterKey) => (
        <SubjectGroup
          key={semesterKey}
          semesterKey={semesterKey}
          subjects={data?.semesters[semesterKey]}
          studentName={data?.studentName}
          year={data?.year}
        />
      ))}
    </div>
  )
}

export default SubjectList
