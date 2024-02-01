import { PanelHeaderWithBack, ErrorPlaceholder } from '@components'
import { AttestationResponse } from '@diary-spo/shared'
import { useRateLimitExceeded } from '@hooks'
import { handleResponse } from '@utils'
import { Group, HorizontalScroll, Panel, Tabs, TabsItem } from '@vkontakte/vkui'
import { FC, lazy } from 'preact/compat'
import { useEffect, useState } from 'preact/hooks'
import { getAttestation } from '../../methods'
import { getFinalMarks } from '../../methods/server/getFinalMarks.ts'

const SubjectList = lazy(() => import('./SubjectsList'))
const FinalMarks = lazy(() => import('./FinalMarks'))

interface IAttestation {
  id: string
}

const Attestation: FC<IAttestation> = ({ id }) => {
  const [isError, setIsError] = useState<boolean>(false)
  const [isDataLoading, setIsLoading] = useState<boolean>(false)
  const [attestationData, setAttestationData] =
    useState<AttestationResponse | null>(null)

  const getUserAttestation = async () => {
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
      setIsError(true)
      console.error('Плоха-плоха:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getUserAttestation()
  }, [])

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

      console.log(data)

      // setAttestationData(data)
    } catch (error) {
      setIsError(true)
      console.error('Плоха-плоха:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getUserFinalMarks()
  }, [])

  const [selected, setSelected] = useState<'finalMarks' | 'attestation'>(
    'attestation'
  )
  return (
    <Panel nav={id}>
      <PanelHeaderWithBack title='Аттестация' />
      <Group>
        <Tabs withScrollToSelectedTab scrollBehaviorToSelectedTab='center'>
          <HorizontalScroll arrowSize='m'>
            <TabsItem
              selected={selected === 'attestation'}
              onClick={() => setSelected('attestation')}
            >
              Ведомость
            </TabsItem>
            <TabsItem
              selected={selected === 'finalMarks'}
              onClick={() => setSelected('finalMarks')}
            >
              Итоговые оценки
            </TabsItem>
          </HorizontalScroll>
        </Tabs>

        {selected === 'attestation' && (
          <SubjectList
            isDataLoading={isDataLoading}
            // @ts-ignore
            semesters={semesters}
            studentName={studentName}
            year={year}
          />
        )}

        {selected === 'finalMarks' && <FinalMarks />}

        {isError && <ErrorPlaceholder onClick={getUserAttestation} />}
      </Group>
    </Panel>
  )
}

// const Scrollable = () => {
//   const [selected, setSelected] = useState('news')
//
//   return (
//
//   )
// }

export default Attestation
