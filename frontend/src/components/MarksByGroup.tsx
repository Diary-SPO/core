import { memo, useEffect, useState } from 'react';
import {
  Card, CardGrid, Div, Group, Header, HorizontalScroll, MiniInfoCell, Spinner, Title,
} from '@vkontakte/vkui';
import { Icon20StatisticsOutline } from '@vkontakte/icons';

import { Grade } from '../types';
import { PerformanceCurrent, TextMarks } from '../../../shared';

import Mark from './Mark';
import { getPerformance } from '../methods/getPerfomance';

const MarksByGroup = () => {
  const [marksForSubject, setMarksForSubject] = useState<PerformanceCurrent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchMarks = async () => {
      try {
        const marks = await getPerformance();
        setIsLoading(false);
        setMarksForSubject(marks);
      } catch (error) {
        setIsLoading(false);
        console.error('Ошибка при получении оценок:', error);
      }
    };

    fetchMarks();
  }, []);

  const subjectMarksMap: Record<string, { date: string; marks: TextMarks }[]> = {};
  // TODO: Возможно эта функция не нужна
  marksForSubject?.daysWithMarksForSubject?.map((subject) => {
    const { subjectName, daysWithMarks } = subject;
    if (!subjectMarksMap[subjectName]) {
      subjectMarksMap[subjectName] = [];
    }
    daysWithMarks.forEach((dayWithMark) => {
      subjectMarksMap[subjectName].push({
        date: new Date(dayWithMark.day).toLocaleDateString(),
        marks: dayWithMark.markValues.join(', ') as TextMarks,
      });
    });
  });

  return (
    <Group mode='plain' header={<Header mode='secondary'>Оценки по дисциплинам</Header>}>
      {Object.keys(subjectMarksMap).map((subjectName, i) => (
        <CardGrid key={i} size='l'>
          <Card mode='shadow'>
            <Div>
              <Title level='3'>{subjectName}</Title>
            </Div>
            <HorizontalScroll>
              <div style={{ display: 'flex', gap: 10, marginLeft: 10 }}>
                {subjectMarksMap[subjectName].map(({ marks }, i) => (
                  <Mark key={i} mark={Grade[marks]} size='s' />
                ))}
              </div>
            </HorizontalScroll>
            <MiniInfoCell
              before={<Icon20StatisticsOutline />}
              after={marksForSubject && Grade[marksForSubject.daysWithMarksForSubject[i].averageMark] || '-1'}
              style={{ marginTop: 5 }}
            >
              Средний балл
            </MiniInfoCell>
          </Card>
        </CardGrid>
      ))}
      {isLoading &&  <Div>
        <Spinner />
      </Div>}
    </Group>
  );
};

export default memo(MarksByGroup);
