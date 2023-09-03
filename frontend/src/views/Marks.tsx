import React, { FC, useState } from 'react';
import {
  Card,
  CardGrid,
  Div,
  Group,
  Header,
  HorizontalCell,
  HorizontalScroll, MiniInfoCell,
  Panel,
  Title,
  View,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

import { Icon20StatisticsOutline } from '@vkontakte/icons';
import { MarksForSubject } from '../../../shared';

import PanelHeaderWithBack from '../components/PanelHeaderWithBack';
import BestWorstMarks from '../components/BestWorstMarks';
import Mark from '../components/Mark.tsx';
import {Grade, TextMarks} from '../types';

const data: MarksForSubject[] = [
  {
    subjectName: 'МДК.04.01 Внедрение и поддержка компьютерных систем/1 подгруппа',
    averageMark: 'Five',
    daysWithMarks: [
      {
        day: '2023-09-01T00:00:00.0000000',
        markValues: ['Five'],
      },
    ],
  },
  {
    subjectName: 'МДК.04.01 Внедрение и поддержка компьютерных систем/1 подгруппа',
    averageMark: 'Five',
    daysWithMarks: [
      {
        day: '2023-09-01T00:00:00.0000000',
        markValues: ['Five'],
      },
    ],
  },
  {
    subjectName: 'МДК.11.01 Технология разработки и защиты баз данных/1 подгруппа',
    averageMark: 'Five',
    daysWithMarks: [
      {
        day: '2023-09-01T00:00:00.0000000',
        markValues: ['Five'],
      },
    ],
  },
];

const Marks: FC<{ id: string }> = ({ id }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();
  const [marksForSubject, setMarksForSubject] = useState<MarksForSubject[] | null>(data);

  const subjectMarksMap: Record<string, { date: string; marks: TextMarks }[]> = {};

  marksForSubject?.forEach((subject) => {
    const { subjectName } = subject;

    if (!subjectMarksMap[subjectName]) {
      subjectMarksMap[subjectName] = [];
    }

    subject.daysWithMarks.forEach((dayWithMark) => {
      subjectMarksMap[subjectName].push({
        date: new Date(dayWithMark.day).toLocaleDateString(),
        marks: dayWithMark.markValues.join(', '),
      });
    });
  });

  return (
    <View
      id={id}
      history={panelsHistory}
      activePanel={activePanel as string}
      onSwipeBack={() => routeNavigator.back()}
    >
      <Panel nav={id}>
        <PanelHeaderWithBack title='Оценки' />
        <BestWorstMarks />
        <Group mode='plain' header={<Header mode='secondary'>Оценки по дисциплинам</Header>}>
          {Object.keys(subjectMarksMap).map((subjectName, i) => (
            <CardGrid key={i} size='l'>
              <Card mode='shadow'>
                <Div>
                  <Title level='3'>{subjectName}</Title>
                </Div>
                <HorizontalScroll>
                  <div style={{ display: 'flex', gap: 10, marginLeft: 10 }}>
                    {subjectMarksMap[subjectName].map(({ marks }) => {
                      return (
                        <Mark mark={Grade[marks]} size='s' />
                      );
                    })}
                  </div>
                </HorizontalScroll>
                <MiniInfoCell
                  before={<Icon20StatisticsOutline />}
                  after={marksForSubject && Grade[marksForSubject[i].averageMark] || '-1'}
                  style={{ marginTop: 5 }}
                >
                  Средний балл
                </MiniInfoCell>
              </Card>
            </CardGrid>
          ))}
        </Group>
      </Panel>
    </View>
  );
};

export default Marks;
