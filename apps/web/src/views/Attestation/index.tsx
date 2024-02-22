import { ErrorPlaceholder, PanelHeaderWithBack } from '@components'
import { AcademicRecord, AttestationResponse } from '@diary-spo/shared'
import { useRateLimitExceeded } from '@hooks'
import { handleResponse } from '@utils'
import { Group, HorizontalScroll, Panel, Tabs, TabsItem } from '@vkontakte/vkui'
import { FC } from 'preact/compat'
import { useEffect, useState } from 'preact/hooks'
import { getFinalMarks, getAttestation } from '../../methods'

import FinalMarks from './FinalMarks'
import SubjectList from './SubjectsList'
import { Nullable } from '@types'

interface IAttestation {
  id: string
}

const Attestation: FC<IAttestation> = ({ id }) => {
  const [isError, setIsError] = useState<boolean>(false)
  const [isDataLoading, setIsLoading] = useState<boolean>(false)

  const [attestationData, setAttestationData] =
    useState<Nullable<AttestationResponse>>(null)
  const [finalMarksData, setFinalMarksData] =
    useState<Nullable<AcademicRecord>>(null)
  const [selected, setSelected] = useState<'finalMarks' | 'attestation'>(
    'attestation'
  )

  const getUserAttestation = async () => {
    if (selected !== 'attestation') return

    setIsLoading(true)
    setIsError(false)

    try {
      const data = await getAttestation()

      handleResponse(
        data,
        () => setIsError(true),
        useRateLimitExceeded,
        setIsLoading
      )

      if (data instanceof Response) {
        return
      }

      setAttestationData(data)
    } catch (error) {
      console.error('Плоха-плоха:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const semesters: Record<string, AttestationResponse['subjects']> = {}
  let studentName: string | null = null
  let year: number | null = null

  if (attestationData?.students) {
    year = attestationData.year
    studentName = `
    ${attestationData.students[0].lastName}
    ${attestationData.students[0].firstName.slice(0, 1)}.
    ${attestationData.students[0].middleName.slice(0, 1)}.`
  }

  if (attestationData?.subjects) {
    const semesterKey = `Семестр ${attestationData.termNumber}`

    if (!semesters[semesterKey]) {
      semesters[semesterKey] = []
    }

    for (const subject of attestationData.subjects) {
      semesters[semesterKey].push(subject)
    }
  }

  const getUserFinalMarks = async () => {
    if (selected !== 'finalMarks') return

    setIsLoading(true)
    setIsError(false)
    try {
      const data = await getFinalMarks()

      handleResponse(
        data,
        () => setIsError(true),
        useRateLimitExceeded,
        setIsLoading
      )

      if (data instanceof Response) {
        return
      }

      setFinalMarksData(data)
    } catch (error) {
      setIsError(true)
      console.error('Плоха-плоха:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getUserAttestation()
    getUserFinalMarks()
  }, [selected])

  return (
    <Panel nav={id}>
      <PanelHeaderWithBack title='Аттестация' />
      <Group>
        <Tabs withScrollToSelectedTab scrollBehaviorToSelectedTab='center'>
          <HorizontalScroll arrowSize='m'>
            <TabsItem
              disabled={selected === 'attestation'}
              selected={selected === 'attestation'}
              onClick={() => setSelected('attestation')}
            >
              Ведомость
            </TabsItem>
            <TabsItem
              disabled={selected === 'finalMarks'}
              selected={selected === 'finalMarks'}
              onClick={() => setSelected('finalMarks')}
            >
              Итоговые оценки
            </TabsItem>
          </HorizontalScroll>
        </Tabs>

        {selected === 'attestation' ? (
          <SubjectList
            isDataLoading={isDataLoading}
            semesters={semesters}
            studentName={studentName}
            year={year}
          />
        ) : (
          <FinalMarks isDataLoading={isDataLoading} data={finalMarksData} />
        )}

        {isError && <ErrorPlaceholder onClick={getUserAttestation} />}
      </Group>
    </Panel>
  )
}

export default Attestation
