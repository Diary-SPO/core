import {
  memo, ReactNode, useEffect, useState,
} from 'react';
import {
  Card,
  CardGrid,
  Div,
  Group,
  Header,
  HorizontalScroll,
  MiniInfoCell,
  Snackbar,
  Spinner,
  Title,
} from '@vkontakte/vkui';
import { Icon20StatisticsOutline, Icon28ErrorCircleOutline, Icon20IncognitoOutline } from '@vkontakte/icons';

import {
  AbsenceType, Grade, PerformanceCurrent, TextMark, TMark,
} from '../../../shared';
import { getPerformance } from '../methods';

import Mark from './Mark';
import calculateAverageMark from '../utils/calculateAverageMark';

const MarksByGroup = () => {
  const [marksForSubject, setMarksForSubject] = useState<PerformanceCurrent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<ReactNode | null>(null);

  const ErrorSnackbar = (
    <Snackbar
      onClose={() => setSnackbar(null)}
      before={<Icon28ErrorCircleOutline fill='var(--vkui--color_icon_negative)' />}
      subtitle='Попробуйте заного или сообщите об ошибке'
    >
      Ошибка при попытке загрузить оценки
    </Snackbar>
  );

  useEffect(() => {
    setIsLoading(true);
    const fetchMarks = async () => {
      try {
        const marks = await getPerformance();
        setIsLoading(false);
        setMarksForSubject(marks);
      } catch (error) {
        setIsLoading(false);
        setSnackbar(ErrorSnackbar);
        console.error('Ошибка при получении оценок:', error);
      }
    };

    fetchMarks();
  }, []);

  const subjectMarksMap: Record<string, { date: string; marks: TextMark[], absenceType?: AbsenceType }[]> = {};
  marksForSubject?.daysWithMarksForSubject?.map((subject) => {
    const { subjectName, daysWithMarks } = subject;
    if (!subjectMarksMap[subjectName]) {
      subjectMarksMap[subjectName] = [];
    }
    // console.log('daysWithMarks', daysWithMarks)
    daysWithMarks.forEach((dayWithMark) => {
      subjectMarksMap[subjectName].push({
        date: new Date(dayWithMark.day).toLocaleDateString(),
        marks: dayWithMark.markValues,
        absenceType: dayWithMark.absenceType,
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
              <div style={{ display: 'flex' }}>
                {subjectMarksMap[subjectName].map(({ marks }, i) => (
                  <div key={i} style={{ display: 'flex' }}>
                    {(marks.length > 0 ? marks?.map((mark, j) => (
                      <Mark key={j} mark={Grade[subjectMarksMap[subjectName][i].absenceType === 'IsAbsent' ? 'Н' : mark]} size='s' />
                    )) : subjectMarksMap[subjectName]?.map((mark, j) => <Mark key={j} size='s' mark={mark.absenceType === 'IsAbsent' ? 'Н' as TMark : 'Д' as TMark} />)
                      )}
                  </div>
                ))}
              </div>
            </HorizontalScroll>
            {marksForSubject && marksForSubject.daysWithMarksForSubject[i].averageMark ? (
              <MiniInfoCell
                textWrap='full'
                before={<Icon20StatisticsOutline />}
                style={{ marginTop: 5 }}
                after={calculateAverageMark(
                  marksForSubject.daysWithMarksForSubject[i].daysWithMarks.reduce(
                    (allMarks, day) => [...allMarks, ...day.markValues],
                    [] as TextMark[],
                  ),
                )}
              >
                Средний балл:
              </MiniInfoCell>
            ) : (
              <MiniInfoCell before={<Icon20IncognitoOutline />}>Нет оценок</MiniInfoCell>
            )}
          </Card>
        </CardGrid>
      ))}
      {snackbar}
      {isLoading && (
        <Div>
          <Spinner />
        </Div>
      )}
    </Group>
  );
};

export default memo(MarksByGroup);
