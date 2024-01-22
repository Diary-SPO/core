import { PanelHeaderWithBack } from '@components'
import { AttestationResponse } from '@diary-spo/shared'
import { handleResponse } from '@utils'
import {
  Button,
  ButtonGroup,
  Div,
  Link,
  Panel,
  Placeholder
} from '@vkontakte/vkui'
import { FC, lazy } from 'preact/compat'
import { useEffect, useState } from 'preact/hooks'
import { useRateLimitExceeded } from '../../hooks'
import { getAttestation } from '../../methods'

const SubjectList = lazy(() => import('./SubjectsList'))

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

  return (
    <Panel nav={id}>
      <PanelHeaderWithBack title='Аттестация' />
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
    header='Ошибка при загрузке'
    action={
      <ButtonGroup mode='vertical' align='center'>
        {/*// @ts-ignore Типы не совместимы */}
        <Button size='s' onClick={onClick}>
          Попробовать снова
        </Button>
        {/*// @ts-ignore Типы не совместимы */}
        <Link href='https://vk.me/dnevnik_spo' target='_blank'>
          Сообщить о проблеме
        </Link>
      </ButtonGroup>
    }
  />
)

export default Attestation
