import { FC, useEffect, useState } from 'react';
import {
  Group, Panel, PanelSpinner, PullToRefresh, View,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Icon28ErrorCircleOutline, Icon28InfoCircle } from '@vkontakte/icons';
import { PerformanceCurrent } from 'diary-shared';
import PanelHeaderWithBack from '../components/UI/PanelHeaderWithBack';
import Suspense from '../components/UI/Suspense';
import Summary from '../components/UI/Summary';
import MarksByGroup from '../components/MarksByGroup';
import UserInfo from '../components/UserInfo';
import { getPerformance } from '../methods';
import { handleResponse } from '../utils/handleResponse';
import { useSnackbar } from '../hooks';
import { Grade, TextMark } from '../types';

const THIRD_SEC = 30 * 1000;

const Marks: FC<{ id: string }> = ({ id }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [snackbar, showSnackbar] = useSnackbar();

  const [marksForSubject, setMarksForSubject] = useState<PerformanceCurrent | null>(null);
  const [totalNumberOfMarks, setTotalNumberOfMarks] = useState<string | null>(null);
  const [averageMark, setAverageMark] = useState<number | null>(null);
  const [markCounts, setMarkCounts] = useState<Record<number, number> | null>(null);

  const fetchData = async () => {
    try {
      const marks = await fetchMarks();

      setMarksForSubject(marks as unknown as PerformanceCurrent);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchMarks = async (isHandle?: boolean) => {
    setIsLoading(true);
    try {
      const lastFetchTime = localStorage.getItem('lastFetchTime');

      if (!lastFetchTime || Date.now() - Number(lastFetchTime) >= THIRD_SEC || isHandle) {
        const marks = await getPerformance();

        handleResponse(
          marks,
          () => {
            setIsLoading(false);
            saveStatisticsData(marks as PerformanceCurrent);
          },
          () => {
            showSnackbar({
              icon: <Icon28ErrorCircleOutline fill='var(--vkui--color_icon_negative)' />,
              title: 'Ошибка при попытке сделать запрос',
              subtitle: 'Сообщите нам об этом',
            });
            setIsLoading(false);
          },
          setIsLoading,
          showSnackbar,
        );
        localStorage.setItem('savedMarks', JSON.stringify(marks));
        localStorage.setItem('lastFetchTime', String(Date.now()));
        setMarksForSubject(marks as PerformanceCurrent);
        saveStatisticsData(marks as PerformanceCurrent);
        setIsLoading(false);
        return marks;
      }
      setIsLoading(false);
      showSnackbar({
        title: 'Оценки взяты из кеша',
        onActionClick: () => fetchMarks(true),
        action: 'Загрузить новые',
        icon: <Icon28InfoCircle fill='var(--vkui--color_background_accent)' />,
      });
      const marks = JSON.parse(localStorage.getItem('savedMarks') || '');
      saveStatisticsData(marks as PerformanceCurrent);
      return marks;
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

  const saveStatisticsData = (marks: PerformanceCurrent) => {
    try {
      const allMarks: TextMark[] = marks.daysWithMarksForSubject.reduce(
        (marksArray: TextMark[], subject) => {
          if (subject.daysWithMarks) {
            // @ts-ignore
            subject.daysWithMarks.forEach((day) => marksArray.push(...day.markValues));
          }
          return marksArray;
        },
        [],
      );

      const totalNumberOfMarks: number = allMarks.length;
      const totalSumOfMarks: number = allMarks.reduce(
        (sum, mark) => sum + (Grade[mark] as number),
        0,
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

      setTotalNumberOfMarks(totalNumberOfMarks.toString());
      setAverageMark(Number(averageMark.toFixed(3)));
      setMarkCounts(markCounts);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View
      id={id}
      history={panelsHistory}
      activePanel={activePanel as string}
      onSwipeBack={() => routeNavigator.back()}
    >
      <Panel nav={id}>
        <PanelHeaderWithBack title='Успеваемость' />
        <PullToRefresh onRefresh={() => fetchMarks(true)} isFetching={isLoading}>
          <Suspense id='UserInfo'>
            <UserInfo />
          </Suspense>

          {isLoading
            ? (
              <Group>
                <PanelSpinner />
              </Group>
            )
            : (
              <Summary
                totalNumberOfMarks={totalNumberOfMarks}
                averageMark={averageMark}
                markCounts={markCounts}
              />
            )}
          {isLoading
            ? (
              <Group>
                <PanelSpinner />
              </Group>
            )
            : (
              <Suspense id='MarksByGroup'>
                <MarksByGroup marksForSubject={marksForSubject} />
              </Suspense>
            )}
        </PullToRefresh>
        {snackbar}
      </Panel>
    </View>
  );
};

export default Marks;
