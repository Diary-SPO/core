import { ErrorPlaceholder, PanelHeaderWithBack } from '@components'
import { AcademicRecord, AttestationResponse } from '@diary-spo/shared'
import { Group, HorizontalScroll, Panel, Tabs, TabsItem } from '@vkontakte/vkui'
import { FC } from 'preact/compat'
import { useEffect, useState } from 'preact/hooks'

import { getAttestation, getFinalMarks } from '../../methods'
import { handleResponse, isApiError } from '@utils'
import { useRateLimitExceeded } from '@hooks'
import { Nullable } from '@types'
import { Props } from '../types.ts'
import { processAttestationData } from './helpers'

import FinalMarks from './FinalMarks'
import SubjectList from './SubjectsList'

import LoadingData from './LoadingData.tsx'

type Tabs = 'finalMarks' | 'attestation'

const Attestation: FC<Props> = ({ id }) => {
  const [isError, setIsError] = useState<boolean>(false)
  const [isDataLoading, setIsLoading] = useState<boolean>(false)

  const [attestationData, setAttestationData] =
    useState<Nullable<AttestationResponse>>(null)
  const [finalMarksData, setFinalMarksData] =
    useState<Nullable<AcademicRecord>>(null)
  const [selected, setSelected] = useState<Tabs>('attestation')

  const data = processAttestationData(attestationData)

  const fetchData = async <T extends object, U>(
    fetchFunction: (...args: U[]) => Promise<T>
  ): Promise<T> => {
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

      if (isApiError(data)) {
        setIsError(true)
        return
      }

      return data
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const setFetchedData = async () => {
    if (selected === 'attestation') {
      const attestation = await fetchData(getAttestation)

      if (isApiError(attestation) || !('year' in attestation)) {
        return
      }

      setAttestationData(attestation)
      return
    }

    const finalMarks = await fetchData(getFinalMarks)

    if (isApiError(finalMarks) || !('subjects' in finalMarks)) {
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
            semesters={data?.semesters}
            studentName={data?.studentName}
            year={data?.year}
          />
        ) : (
          <FinalMarks data={finalMarksData} />
        )}
        {isDataLoading && <LoadingData />}

        {isError && <ErrorPlaceholder />}
      </Group>
    </Panel>
  )
}

export default Attestation
