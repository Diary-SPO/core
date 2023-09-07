import {
  memo, useEffect, useState,
} from 'react';
import {
  Card,
  CardGrid,
  Div,
  Group,
  Header,
  HorizontalScroll,
  MiniInfoCell,
  Spinner,
  Title,
} from '@vkontakte/vkui';
import {
  Icon20IncognitoOutline,
  Icon20StatisticsOutline,
  Icon28ErrorCircleOutline,
  Icon28InfoCircle,
} from '@vkontakte/icons';

import {
  AbsenceType, Grade, PerformanceCurrent, TextMark, TMark,
} from '../../../shared';
import { getPerformance } from '../methods';

import Mark from './UI/Mark';
import calculateAverageMark from '../utils/calculateAverageMark';
import { useSnackbar } from '../hooks';

const THIRD_SEC = 30 * 1000;

const MarksByGroup = () => {
  const [marksForSubject, setMarksForSubject] = useState<PerformanceCurrent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [snackbar, showSnackbar] = useSnackbar();

  const fetchMarks = async (isHandle?: boolean) => {
    setIsLoading(true);
    try {
      const lastFetchTime = localStorage.getItem('lastFetchTime');

      if (!lastFetchTime || Date.now() - Number(lastFetchTime) >= THIRD_SEC || isHandle) {
        const marks = await getPerformance();

        localStorage.setItem('marks', JSON.stringify(marks));
        localStorage.setItem('lastFetchTime', String(Date.now()));

        setMarksForSubject(marks);
      } else {
        showSnackbar({
          title: 'Оценки взяты из кеша',
          onActionClick: () => fetchMarks(true),
          action: 'Загрузить новые',
          icon: <Icon28InfoCircle fill='var(--vkui--color_background_accent)' />,
        });
        const cachedMarks = localStorage.getItem('marks');
        if (cachedMarks) {
          setMarksForSubject(JSON.parse(cachedMarks));
        }
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showSnackbar({
        icon: <Icon28ErrorCircleOutline fill='var(--vkui--color_icon_negative)' />,
        title: 'Ошибка при попытке загрузить оценки',
        action: 'Попробовать снова',
        onActionClick: () => fetchMarks(true),
      });
      console.error('Ошибка при получении оценок:', error);
    }
  };

  useEffect(() => {
    fetchMarks();
  }, []);

  const subjectMarksMap: Record<string, { date: string; marks: TextMark[], absenceType?: AbsenceType }[]> = {};
  marksForSubject?.daysWithMarksForSubject?.map((subject) => {
    const { subjectName, daysWithMarks } = subject;
    if (!subjectMarksMap[subjectName]) {
      subjectMarksMap[subjectName] = [];
    }

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
                      // FIXME: Тут встречается баг, что ставится Д, когда нет долга и студент был на паре
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
