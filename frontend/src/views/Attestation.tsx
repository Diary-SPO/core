import { FC, useEffect, useState } from 'react';
import {
  Div,
  Panel, Spinner, View,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import getAttestation from '../methods/server/getAttestation';
import { Attestation } from '../../../shared';
import PanelHeaderWithBack from '../components/UI/PanelHeaderWithBack';
import { useRateLimitExceeded } from '../hooks';
import SubjectList from '../components/UI/SubjectsList.tsx';

interface IAttestation {
  id: string;
}

const Attestation: FC<IAttestation> = ({ id }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();

  const [attestationData, setAttestationData] = useState<Attestation | null>(null);

  useEffect(() => {
    const getUserAttestation = async () => {
      try {
        const data = await getAttestation();
        if (data === 429) {
          useRateLimitExceeded();
        }
        setAttestationData(data as Attestation);
      } catch (error) {
        console.error('Плоха-плоха:', error);
      }
    };

    getUserAttestation();
  }, []);

  const semesters: Record<string, Attestation['subjects']> = {};
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
          {attestationData ? (
            <SubjectList
              semesters={semesters}
              studentName={studentName}
              year={year}
            />
          ) : (
            <Spinner />
          )}
        </Div>
      </Panel>
    </View>
  );
};

export default Attestation;
