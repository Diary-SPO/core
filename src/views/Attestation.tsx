import {
  FC, lazy, useEffect, useState,
} from 'react';
import {
  Button, ButtonGroup, Div, Link, Panel, Placeholder, ScreenSpinner, View,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { AttestationResponse } from 'diary-shared';
import getAttestation from '../methods/server/getAttestation';
import PanelHeaderWithBack from '../components/UI/PanelHeaderWithBack';
import { useRateLimitExceeded } from '../hooks';
import { handleResponse } from '../utils/handleResponse';

const SubjectList = lazy(() => import('../components/UI/SubjectsList'));

interface IAttestation {
  id: string;
}

const Attestation: FC<IAttestation> = ({ id }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();

  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attestationData, setAttestationData] = useState<AttestationResponse | null>(null);

  useEffect(() => {
    getUserAttestation();
  }, []);

  const getUserAttestation = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await getAttestation();

      handleResponse(
        data,
        () => {
          setIsError(true);
          setIsLoading(false);
        },
        () => {
          useRateLimitExceeded();
          setIsError(true);
          setIsLoading(false);
        },
        (isLoading) => {
          setIsLoading(isLoading);
        },
      );

      setAttestationData(data as AttestationResponse);
    } catch (error) {
      setIsError(true);
      console.error('Плоха-плоха:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const semesters: Record<string, AttestationResponse['subjects']> = {};
  let year: number | null = null;
  let studentName: string | null = null;

  if (attestationData && attestationData.students) {
    year = attestationData.year;
    studentName = `${attestationData.students[0].lastName} ${attestationData.students[0].firstName.slice(0, 1)}. ${attestationData.students[0].middleName.slice(0, 1)}.`;
  }

  if (attestationData && attestationData.subjects) {
    attestationData.subjects.forEach((subject) => {
      const semesterKey = `Семестр ${attestationData.termNumber}`;
      if (!semesters[semesterKey]) {
        semesters[semesterKey] = [];
      }
      semesters[semesterKey].push(subject);
    });
  }

  return (
    <View
      id={id}
      history={panelsHistory}
      activePanel={activePanel as string}
      onSwipeBack={() => routeNavigator.back()}
    >
      <Panel nav={id}>
        <PanelHeaderWithBack title='Аттестация' />
        <Div>
          {attestationData
            && (
            <SubjectList
              semesters={semesters}
              studentName={studentName}
              year={year}
            />
            )}
          {isLoading && <ScreenSpinner />}
          {isError
            && (
              <Placeholder
                header='Ошибка при загрузке'
                action={(
                  <ButtonGroup mode='vertical' align='center'>
                    <Button size='s' onClick={getUserAttestation}>Попробовать снова</Button>
                    <Link href='https://vk.me/dnevnik_spo' target='_blank'>
                      Сообщить о проблеме
                    </Link>
                  </ButtonGroup>
                )}
              />
            )}
        </Div>
      </Panel>
    </View>
  );
};

export default Attestation;
