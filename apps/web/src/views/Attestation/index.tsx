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
import { processAttestationData } from './utils'
import { Props } from '../types.ts'

const Attestation: FC<Props> = ({ id }) => {
  const [isError, setIsError] = useState<boolean>(false)
  const [isDataLoading, setIsLoading] = useState<boolean>(false)

  const [attestationData, setAttestationData] =
    useState<Nullable<AttestationResponse>>(null)
  const [finalMarksData, setFinalMarksData] =
    useState<Nullable<AcademicRecord>>(null)
  const [selected, setSelected] = useState<'finalMarks' | 'attestation'>(
    'attestation'
  )

  const { semesters, studentName, year } =
    processAttestationData(attestationData)

  const fetchData = async <T extends object, U>(
    fetchFunction: (...args: U[]) => Promise<T | Response>
  ): Promise<T | undefined> => {
    setIsLoading(true)
    setIsError(false)

    try {
      const data = await fetchFunction()

      handleResponse(
        data,
        () => setIsError(true),
        useRateLimitExceeded,
        setIsLoading
      )

      if (data instanceof Response) {
        return
      }

      return data
    } catch (error) {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const setFetchedData = async () => {
    if (selected === 'attestation') {
      const attestation = await fetchData(getAttestation)

      if (!attestation.year) {
        return
      }

      setAttestationData(attestation)
      return
    }

    const finalMarks = await fetchData(getFinalMarks)

    if (!finalMarks.subjects.length) {
      return
    }

    setFinalMarksData(finalMarks)
  }

  useEffect(() => {
    setFetchedData()
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

        {isError && <ErrorPlaceholder />}
      </Group>
    </Panel>
  )
}

export default Attestation
