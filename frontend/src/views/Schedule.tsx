import {
  FC, lazy, useEffect, useState,
} from 'react';
import {
  Button,
  ButtonGroup, FixedLayout, Group, Header, IconButton, Link,
  Panel, PanelSpinner, Placeholder, View,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import {
  Icon16ArrowRightOutline,
  Icon16ArrowLeftOutline,
} from '@vkontakte/icons';

import { addDays, endOfWeek, startOfWeek } from '@vkontakte/vkui/dist/lib/date';
import { Day } from '../../../shared';
import { getLessons } from '../methods';

import PanelHeaderWithBack from '../components/UI/PanelHeaderWithBack';
import Suspense from '../components/UI/Suspense';

import { useSnackbar, useRateLimitExceeded } from '../hooks';
import ExplanationTooltip from '../components/UI/ExplanationTooltip.tsx';

const CalendarRange = lazy(() => import('../components/CalendarRange'));
const ScheduleGroup = lazy(() => import('../components/ScheduleGroup'));

const Schedule: FC<{ id: string }> = ({ id }) => {
  const currentDate = new Date();

  const [rateSnackbar, handleRateLimitExceeded] = useRateLimitExceeded();
  const [snackbar, showSnackbar] = useSnackbar();
  const [isCurrent, setIsCurrent] = useState<boolean>(() => {
    const storedIsCurrent = localStorage.getItem('isCurrent');
    return storedIsCurrent ? JSON.parse(storedIsCurrent) : true;
  });

  const getError = () => showSnackbar({
    title: 'Ошибка при попытке получить расписание',
    action: 'Повторить',
    onActionClick: handleReloadData,
  });

  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();
  const [lessonsState, setLessons] = useState<Day[] | null>();
  const [startDate, setStartDate] = useState<Date>(startOfWeek(currentDate));
  const [endDate, setEndDate] = useState<Date>(endOfWeek(currentDate));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [clickCount, setClickCount] = useState<number>(0);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const updateDatesFromData = (data: Day[]) => {
    const firstLessonDate = data && data.length > 0 ? new Date(data[0].date) : startDate;
    const lastLessonDate = data && data.length > 0 ? new Date(data[data.length - 1].date) : endDate;
    setStartDate(startOfWeek(firstLessonDate));
    setEndDate(endOfWeek(lastLessonDate));
  };

  const handleReloadData = async () => {
    setIsLoading(true);
    setIsError(false);
    localStorage.setItem('isCurrent', JSON.stringify(true));
    setIsCurrent(true);
    const newEndDate = new Date(endDate);
    newEndDate.setDate(newEndDate.getDate() + 7);

    try {
      const data = await getLessons(startDate, newEndDate);

      if (data === 429) {
        handleRateLimitExceeded();
        setIsLoading(false);
        return;
      }

      setLessons(data as Day[]);
      updateDatesFromData(data as Day[]);

      localStorage.setItem('savedLessons', JSON.stringify(data));
    } catch (error) {
      setIsError(true);
      showSnackbar({
        title: 'Ошибка при попытке получить расписание',
        action: 'Повторить',
        onActionClick: handleReloadData,
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedLessons = localStorage.getItem('savedLessons');
    const getLastRequestTime = localStorage.getItem('lastRequestTime');
    const currentTime = Date.now();
    const lastRequestTime = getLastRequestTime ? parseInt(getLastRequestTime, 10) : 0;
    const timeSinceLastRequest = currentTime - lastRequestTime;

    const gettedLessons = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        if (!savedLessons || timeSinceLastRequest > 30000) {
          const data = await getLessons(startDate, endDate);

          if (data === 429) {
            handleRateLimitExceeded();
            setIsLoading(false);
            return;
          }

          setLessons(data as Day[]);

          localStorage.setItem('savedLessons', JSON.stringify(data));
          localStorage.setItem('lastRequestTime', currentTime.toString());

          updateDatesFromData(data as Day[]);
        } else {
          showSnackbar({
            layout: 'vertical',
            action: 'Загрузить новые',
            onActionClick: handleReloadData,
            title: 'Данные взяты из кеша',
          });
        }
      } catch (error) {
        setIsError(true);
        getError();
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (savedLessons) {
      setLessons(JSON.parse(savedLessons));
      const firstLessonDate = JSON.parse(savedLessons)[0] ? new Date(JSON.parse(savedLessons)[0].date) : startDate;
      const lastLessonDate = JSON.parse(savedLessons)[JSON.parse(savedLessons).length - 1]
        ? new Date(JSON.parse(savedLessons)[JSON.parse(savedLessons).length - 1].date)
        : endDate;
      setStartDate(startOfWeek(firstLessonDate));
      setEndDate(endOfWeek(lastLessonDate));
    }

    gettedLessons();
  }, []);
  const sendToServerIfValid = async (start: Date, end: Date) => {
    setIsLoading(true);
    setIsCurrent(false);
    if (start <= end) {
      const differenceInDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
      if (differenceInDays <= 14) {
        const data = await getLessons(start, end);
        if (data === 429) {
          handleRateLimitExceeded();
          setIsLoading(false);
          return;
        }

        setLessons(data as Day[]);

        localStorage.setItem('savedLessons', JSON.stringify(data));
      } else {
        console.info('Разница между датами больше 14-и дней');

        const newEndDate = new Date(start);
        newEndDate.setDate(newEndDate.getDate() + 14);

        if (newEndDate > end) {
          const newStartDate = new Date(newEndDate);
          newStartDate.setDate(newStartDate.getDate() - 14);
          setStartDate(newStartDate);
          setEndDate(newEndDate);

          if (!snackbar) {
            showSnackbar({
              title: 'Разница между датами больше 14-и дней',
              subtitle: `Начальная дата будет автоматически изменена на ${newStartDate.toLocaleString()}`,
            });
          }
        } else {
          setEndDate(newEndDate);
        }

        if (!snackbar) {
          showSnackbar({
            title: 'Разница между датами больше 14-и дней',
            subtitle: `Конечная дата будет автоматически изменена на ${newEndDate.toLocaleString()}`,
          });
        }

        const data = await getLessons(start, newEndDate);
        if (data === 429) {
          handleRateLimitExceeded();
          setIsLoading(false);
          return;
        }
        setLessons(data as Day[]);

        localStorage.setItem('savedLessons', JSON.stringify(data));
      }
    } else {
      console.info('Начальная дата больше конечной');

      if (!snackbar) {
        showSnackbar({
          subtitle: 'Конечная дата будет автоматически установлена на 5 дней больше начальной',
          title: 'Начальная дата больше конечной',
        });

        const newEndDate = new Date(start);
        newEndDate.setDate(newEndDate.getDate() + 5);
        setEndDate(newEndDate);

        const data = await getLessons(start, newEndDate);
        if (data === 429) {
          handleRateLimitExceeded();
          setIsLoading(false);
          return;
        }
        setLessons(data as Day[]);

        localStorage.setItem('savedLessons', JSON.stringify(data));
      }
    }
    setIsLoading(false);
  };

  const handleStartDateChange = (newStartDate: Date) => {
    if (newStartDate.getTime() === startDate.getTime()) {
      return;
    }
    setStartDate(newStartDate);
    sendToServerIfValid(newStartDate, endDate);
  };

  const handleEndDateChange = (newEndDate: Date) => {
    if (newEndDate.getTime() === endDate.getTime()) {
      return;
    }
    setEndDate(newEndDate);
    sendToServerIfValid(startDate, newEndDate);
  };

  const debouncedChangeWeek = (direction: 'prev' | 'next') => {
    localStorage.setItem('isCurrent', JSON.stringify(false));
    setIsCurrent(false);
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);
    if (clickCount > 0) {
      const weekDifference = clickCount * 7;
      newStartDate.setDate(newStartDate.getDate() + weekDifference);
      newEndDate.setDate(newEndDate.getDate() + weekDifference);
      setClickCount(0);
    } else if (direction === 'prev') {
      newStartDate.setDate(newStartDate.getDate() - 7);
      newEndDate.setDate(newEndDate.getDate() - 7);
    } else if (direction === 'next') {
      newStartDate.setDate(newStartDate.getDate() + 7);
      newEndDate.setDate(newEndDate.getDate() + 7);
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);

    sendToServerIfValid(newStartDate, newEndDate);
  };

  const handleButtonClick = (direction: 'prev' | 'next') => {
    setClickCount((prevCount) => prevCount + 1);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      debouncedChangeWeek(direction);
      setClickCount(0);
    }, 500);

    setTimeoutId(newTimeoutId);
  };

  const getCurrentWeek = async () => {
    const startWeek = startOfWeek(currentDate);
    const startOfCurrWeek = startOfWeek(startDate);
    const endWeek = addDays(endOfWeek(currentDate), 7);

    const startWeekStr = startWeek.toLocaleString('default', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const startOfCurrWeekStr = startOfCurrWeek.toLocaleString('default', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    if (startWeekStr === startOfCurrWeekStr) {
      showSnackbar({
        title: 'Вы уже на текущей неделе',
      });
      localStorage.setItem('isCurrent', JSON.stringify(true));
      setIsCurrent(true);
      return;
    }

    setIsLoading(true);
    try {
      const data = await getLessons(startWeek, endWeek);

      setLessons(data as Day[]);
      setStartDate(startWeek);
      setEndDate(endWeek);

      localStorage.setItem('isCurrent', JSON.stringify(true));
      setIsCurrent(true);
    } catch (e) {
      console.error(e);
      getError();
    } finally {
      setIsLoading(false);
    }
  };

  const Buttons = (
    <ButtonGroup
      style={{
        alignItems: 'center', position: 'relative', top: 20, color: 'var(--vkui--color_stroke_accent_themed)',
      }}
      gap='s'
    >
      <IconButton aria-label='Prev' onClick={() => handleButtonClick('prev')}>
        <Icon16ArrowLeftOutline />
      </IconButton>
      <Button size='s' mode='secondary' onClick={getCurrentWeek} disabled={isCurrent}>
        <ExplanationTooltip tooltipContent='Вернёт вас на текущую неделю' text='Домой' />
      </Button>
      <IconButton aria-label='Next' onClick={() => handleButtonClick('next')}>
        <Icon16ArrowRightOutline />
      </IconButton>
    </ButtonGroup>
  );

  const weekString = `
  ${startDate.getDate() + 1}
  ${startDate.toLocaleString('default', { month: 'long' })
    .slice(0, 3)}
    -
    ${endDate.getDate()}
    ${endDate.toLocaleString('default', { month: 'long' })
    .slice(0, 3)}`;

  return (
    <View
      id={id}
      history={panelsHistory}
      activePanel={activePanel as string}
      onSwipeBack={() => routeNavigator.back()}
    >
      <Panel nav={id}>
        <PanelHeaderWithBack title='Расписание' />
        <Suspense id='Calendar' mode='panel'>
          <CalendarRange
            label='Выбор начальной даты:'
            value={startDate}
            onDateChange={handleStartDateChange}
          />
          <CalendarRange
            label='Выбор конечной даты:'
            value={endDate}
            onDateChange={handleEndDateChange}
          />
        </Suspense>
        <Suspense id='ScheduleGroup' mode='screen'>
          <Group
            header={(
              <FixedLayout vertical='top' filled>
                <Header
                  aside={Buttons}
                  mode='secondary'
                >
                  {weekString}
                </Header>
              </FixedLayout>
            )}
          >
            {isLoading ? <PanelSpinner size='regular' /> : (
              <ScheduleGroup lessonsState={lessonsState} />
            )}
          </Group>
        </Suspense>
        {isError
          && (
            <Placeholder
              header='Ошибка при загрузке'
              action={(
                <ButtonGroup mode='vertical' align='center'>
                  <Button size='s' onClick={handleReloadData}>Попробовать снова</Button>
                  <Link href='https://vk.me/dnevnik_spo' target='_blank'>
                    Сообщить о проблеме
                  </Link>
                </ButtonGroup>
              )}
            />
          )}
        {snackbar}
        {rateSnackbar}
      </Panel>
    </View>
  );
};

export default Schedule;
