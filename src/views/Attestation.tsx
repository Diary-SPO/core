import {
  Button,
  ButtonGroup,
  Div,
  Link,
  Panel,
  Placeholder,
} from '@vkontakte/vkui'
import { AttestationResponse } from 'diary-shared'
import { FC, lazy } from 'preact/compat'
import { useCallback, useEffect, useState } from 'preact/hooks'
import PanelHeaderWithBack from '../components/UI/PanelHeaderWithBack'
import { useRateLimitExceeded } from '../hooks'
import { handleResponse } from '../utils/handleResponse'
import { getAttestation } from '../methods'

const SubjectList = lazy(() => import('../components/UI/SubjectsList'))

interface IAttestation {
  id: string
}

const Attestation: FC<IAttestation> = ({ id }) => {
  const [isError, setIsError] = useState<boolean>(false)
  const [isDataLoading, setIsLoading] = useState<boolean>(false)
  const [attestationData, setAttestationData] =
    useState<AttestationResponse | null>(null)

  const getUserAttestation = useCallback(async () => {
    setIsLoading(true)
    setIsError(false)
    try {
      const data = await getAttestation()

      handleResponse(
        data,
        () => {
          setIsError(true)
          setIsLoading(false)
        },
        () => {
          useRateLimitExceeded()
          setIsError(true)
          setIsLoading(false)
        },
        (isLoading) => {
          setIsLoading(isLoading)
        }
      )

      setAttestationData(data as AttestationResponse)
    } catch (error) {
      setIsError(true)
      console.error('Плоха-плоха:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    getUserAttestation()
  }, [])

  const semesters: Record<string, AttestationResponse['subjects']> = {}
  let studentName: string | null = null
  let year: number | null = null

  if (attestationData && attestationData.students) {
    year = attestationData.year
    studentName = `
    ${attestationData.students[0].lastName}
    ${attestationData.students[0].firstName.slice(0, 1)}.
    ${attestationData.students[0].middleName.slice(0, 1)}.`
  }

  if (attestationData && attestationData.subjects) {
    attestationData.subjects.forEach((subject) => {
      const semesterKey = `Семестр ${attestationData.termNumber}`
      if (!semesters[semesterKey]) {
        semesters[semesterKey] = []
      }
      semesters[semesterKey].push(subject)
    })
  }

  return (
    <Panel nav={id}>
      <PanelHeaderWithBack title="Аттестация" />
      <Div>
        <SubjectList
          isDataLoading={isDataLoading}
          // @ts-ignore
          semesters={semesters}
          studentName={studentName}
          year={year}
        />
        {isError && <ErrorPlaceholder onClick={getUserAttestation} />}
      </Div>
    </Panel>
  )
}

const ErrorPlaceholder = ({ onClick }: { onClick: () => void }) => (
  <Placeholder
    header="Ошибка при загрузке"
    action={
      <ButtonGroup mode="vertical" align="center">
        <Button size="s" onClick={onClick}>
          Попробовать снова
        </Button>
        <Link href="https://vk.me/dnevnik_spo" target="_blank">
          Сообщить о проблеме
        </Link>
      </ButtonGroup>
    }
  />
)

export default Attestation
