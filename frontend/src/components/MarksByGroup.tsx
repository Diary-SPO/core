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
  AbsenceType, EAbsenceTypes, PerformanceCurrent, TextMark,
} from '/diary-shared';
import { getPerformance } from '../methods';
import calculateAverageMark from '../utils/calculateAverageMark';
import { useSnackbar } from '../hooks';
import Mark from './UI/Mark';
import { handleResponse } from '../utils/handleResponse';
import { Grade } from '../types';

const THIRD_SEC = 30 * 1000;

interface SubjectWithMarks {
  daysWithMarks: {
    markValues: TextMark[];
  }[];
}

interface CachedMarks {
  daysWithMarksForSubject: SubjectWithMarks[];
}

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

        handleResponse(marks, () => {
          setIsLoading(false);
        }, () => {
          showSnackbar({
            icon: <Icon28ErrorCircleOutline fill='var(--vkui--color_icon_negative)' />,
            title: 'Ошибка при попытке сделать запрос',
            subtitle: 'Сообщите нам об этом',
          });
          setIsLoading(false);
        }, setIsLoading, showSnackbar);

        localStorage.setItem('savedMarks', JSON.stringify(marks));
        localStorage.setItem('lastFetchTime', String(Date.now()));

        setMarksForSubject(marks as PerformanceCurrent);
      } else {
        showSnackbar({
          title: 'Оценки взяты из кеша',
          onActionClick: () => fetchMarks(true),
          action: 'Загрузить новые',
          icon: <Icon28InfoCircle fill='var(--vkui--color_background_accent)' />,
        });
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
    const cachedMarks = localStorage.getItem('savedMarks');

    if (cachedMarks) {
      if (cachedMarks) {
        setMarksForSubject(JSON.parse(cachedMarks));
      }
    } else {
      fetchMarks();
    }
  }, []);

  const subjectMarksMap: Record<string, { date: string; marks: TextMark[], absenceType?: AbsenceType }[]> = {};
  marksForSubject?.daysWithMarksForSubject?.map((subject) => {
    const { subjectName, daysWithMarks } = subject;
    if (!subjectMarksMap[subjectName]) {
      subjectMarksMap[subjectName] = [];
    }

    daysWithMarks?.forEach((dayWithMark) => {
      subjectMarksMap[subjectName].push({
        date: new Date(dayWithMark.day).toLocaleDateString(),
        marks: dayWithMark.markValues,
        absenceType: dayWithMark.absenceType,
      });
    });
  });
  
  useEffect(() => {
    const cachedMarksJSON = localStorage.getItem('savedMarks');
    if (!cachedMarksJSON) {
      return;
    }
    
    const cachedMarks: CachedMarks = JSON.parse(cachedMarksJSON);
    const allMarks: TextMark[] = cachedMarks.daysWithMarksForSubject.reduce(
      (marksArray, subject) => {
        subject.daysWithMarks.forEach((day) => {
          // @ts-ignore
          return marksArray.push(...day.markValues);
        });
        return marksArray;
      },
      []
    );
    
    const totalNumberOfMarks: number = allMarks.length;
    const totalSumOfMarks: number = allMarks.reduce(
      (sum, mark) => sum + (Grade[mark] as number),
      0
    );
    const averageMark: number = totalSumOfMarks / totalNumberOfMarks;
    const markCounts: Record<number, number> = {
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    
    allMarks.forEach((textMark: TextMark) => {
      const numericMark: number = Grade[textMark] as number;
      if (numericMark >= 2 && numericMark <= 5) {
        markCounts[numericMark]++;
      }
    });
    
    localStorage.setItem('totalNumberOfMarks', totalNumberOfMarks.toString());
    localStorage.setItem('averageMark', averageMark.toString());
    localStorage.setItem('markCounts', JSON.stringify(markCounts));
  }, []);
  
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
                {subjectMarksMap[subjectName].map(({ date, marks, absenceType }) => (
                  <div key={`${date}_${marks}`} style={{ display: 'flex' }}>
                    {marks.length > 0 && !absenceType ? (
                      marks.map((mark, k) => (
                        <Mark key={k} mark={Grade[mark]} size='s' />
                      ))
                    ) : absenceType ? (
                      <Mark size='s' mark={EAbsenceTypes[absenceType]} />
                    ) : null}
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
                  marksForSubject.daysWithMarksForSubject[i].daysWithMarks?.reduce(
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
