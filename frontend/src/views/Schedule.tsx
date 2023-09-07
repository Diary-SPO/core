import {
  FC, lazy, useEffect, useState,
} from 'react';
import {
  Button,
  ButtonGroup, Group, Header, IconButton, Link,
  Panel, PanelSpinner, Placeholder, View,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import {
  Icon28InfoCircle,
  Icon16ArrowRightOutline,
  Icon16ArrowLeftOutline,
} from '@vkontakte/icons';

import { endOfWeek, startOfWeek } from '@vkontakte/vkui/dist/lib/date';
import { Day } from '../../../shared';
import { getLessons } from '../methods';

import PanelHeaderWithBack from '../components/PanelHeaderWithBack';
import Suspense from '../components/Suspense';

import { useSnackbar, useRateLimitExceeded } from '../hooks';

const CalendarRange = lazy(() => import('../components/CalendarRange'));
const ScheduleGroup = lazy(() => import('../components/ScheduleGroup'));

const Schedule: FC<{ id: string }> = ({ id }) => {
  const [rateSnackbar, handleRateLimitExceeded] = useRateLimitExceeded();
  const [snackbar, showSnackbar] = useSnackbar();
  const currentDate = new Date();

  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();
  const [lessonsState, setLessons] = useState<Day[] | null>();
  const [startDate, setStartDate] = useState<Date>(startOfWeek(currentDate));
  const [endDate, setEndDate] = useState<Date>(endOfWeek(currentDate));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const updateDatesFromData = (data: Day[]) => {
    const firstLessonDate = data && data.length > 0 ? new Date(data[0].date) : startDate;
    const lastLessonDate = data && data.length > 0 ? new Date(data[data.length - 1].date) : endDate;
    setStartDate(startOfWeek(firstLessonDate));
    setEndDate(endOfWeek(lastLessonDate));
  };

  const handleReloadData = async () => {
    setIsError(false);
    setIsLoading(true);
    const newEndDate = new Date(endDate);
    newEndDate.setDate(newEndDate.getDate() + 7);

    try {
      const data = await getLessons(startDate, newEndDate);

      if (data === 429) {
        handleRateLimitExceeded();
        return;
      }

      setLessons(data as Day[]);
      updateDatesFromData(data as Day[]);
      setIsLoading(false);

      localStorage.setItem('savedLessons', JSON.stringify(data));
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      showSnackbar({
        title: 'Ошибка при попытке получить расписание',
        action: 'Повторить',
        onActionClick: handleReloadData,
      });
      console.error(error);
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
            return;
          }
          setLessons(data as Day[]);
          setIsLoading(false);

          localStorage.setItem('savedLessons', JSON.stringify(data));
          localStorage.setItem('lastRequestTime', currentTime.toString());

          updateDatesFromData(data as Day[]);
        } else {
          setIsLoading(false);
          showSnackbar({
            layout: 'vertical',
            icon: <Icon28InfoCircle fill='var(--vkui--color_background_accent)' />,
            action: 'Загрузить новые',
            onActionClick: handleReloadData,
            title: 'Данные взяты из кеша',
          });
        }
      } catch (error) {
        setIsLoading(false);
        setIsError(true);
        showSnackbar({
          title: 'Ошибка при попытке получить расписание',
          action: 'Повторить',
          onActionClick: handleReloadData,
        });
        console.error(error);
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
    if (start <= end) {
      const differenceInDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
      if (differenceInDays <= 14) {
        const data = await getLessons(start, end);
        if (data === 429) {
          handleRateLimitExceeded();
          return;
        }

        setLessons(data as Day[]);

        localStorage.setItem('savedLessons', JSON.stringify(data));
      } else {
        console.info('Разница между датами больше 14-и дней');

        const newEndDate = new Date(start);
        newEndDate.setDate(newEndDate.getDate() + 14);
        setEndDate(newEndDate);

        showSnackbar({
          icon: <Icon28InfoCircle fill='var(--vkui--color_background_accent)' />,
          title: 'Разница между датами больше 14-и дней',
          subtitle: `Конечная дата будет автоматически изменена на ${newEndDate.toLocaleString()}, вы также можете поменять начальную дату`,
        });

        const data = await getLessons(start, newEndDate);
        if (data === 429) {
          handleRateLimitExceeded();
          return;
        }
        setLessons(data as Day[]);

        localStorage.setItem('savedLessons', JSON.stringify(data));
      }
    } else {
      console.info('Начальная дата больше конечной');

      if (!snackbar) {
        showSnackbar({
          icon: <Icon28InfoCircle fill='var(--vkui--color_background_accent)' />,
          subtitle: 'Конечная дата будет автоматически установлена на 5 дней больше начальной',
          title: 'Начальная дата больше конечной',
        });

        const newEndDate = new Date(start);
        newEndDate.setDate(newEndDate.getDate() + 5);
        setEndDate(newEndDate);

        const data = await getLessons(start, newEndDate);
        if (data === 429) {
          handleRateLimitExceeded();
          return;
        }
        setLessons(data as Day[]);

        localStorage.setItem('savedLessons', JSON.stringify(data));
      }
    }
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

  const [lastClickTime, setLastClickTime] = useState<number | null>(null);

  const debouncedChangeWeek = (direction: 'prev' | 'next') => {
    if (lastClickTime && Date.now() - lastClickTime <= 500) {
      setTimeout(() => {
        debouncedChangeWeek(direction);
      }, 800);
    } else {
      setLastClickTime(Date.now());
      const newStartDate = new Date(startDate);
      const newEndDate = new Date(endDate);
      if (direction === 'prev') {
        newStartDate.setDate(newStartDate.getDate() - 7);
        newEndDate.setDate(newEndDate.getDate() - 7);
      } else if (direction === 'next') {
        newStartDate.setDate(newStartDate.getDate() + 7);
        newEndDate.setDate(newEndDate.getDate() + 7);
      }
      setStartDate(newStartDate);
      setEndDate(newEndDate);
      sendToServerIfValid(newStartDate, newEndDate);
    }
  };

  const Buttons = (
    <ButtonGroup>
      <IconButton aria-label='Prev' onClick={() => debouncedChangeWeek('prev')}>
        <Icon16ArrowLeftOutline />
      </IconButton>
      <IconButton aria-label='Next' onClick={() => debouncedChangeWeek('next')}>
        <Icon16ArrowRightOutline />
      </IconButton>
    </ButtonGroup>
  );

  const weekString = `
  ${startDate.getDate()}
  ${startDate.toLocaleString('default', { month: 'long' })
    .slice(0, 4)}
    -
    ${endDate.getDate()}
    ${endDate.toLocaleString('default', { month: 'long' })
    .slice(0, 4)}`;

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
        {isLoading ? <PanelSpinner size='medium' /> : (
          <Suspense id='ScheduleGroup' mode='screen'>
            <Group
              header={(
                <Header
                  aside={Buttons}
                  mode='secondary'
                >
                  Период
                  {' '}
                  {weekString}
                </Header>
              )}
            >
              <ScheduleGroup lessonsState={lessonsState} />
            </Group>
          </Suspense>
        )}
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
