import {
  FC, lazy, ReactNode, useEffect, useState,
} from 'react';
import {
  Button,
  ButtonGroup, Group, Header, IconButton, Link,
  Panel, PanelSpinner, Placeholder, Snackbar, View,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import {
  Icon28ErrorCircleOutline,
  Icon28InfoCircle,
  Icon16ArrowRightOutline,
  Icon16ArrowLeftOutline,
} from '@vkontakte/icons';

import { endOfWeek, startOfWeek } from '@vkontakte/vkui/dist/lib/date';
import { Day } from '../../../shared';
import { getLessons } from '../methods';

import PanelHeaderWithBack from '../components/PanelHeaderWithBack';
import Suspense from '../components/Suspense';

const CalendarRange = lazy(() => import('../components/CalendarRange'));
const ScheduleGroup = lazy(() => import('../components/ScheduleGroup'));

const Schedule: FC<{ id: string }> = ({ id }) => {
  const [snackbar, setSnackbar] = useState<null | ReactNode>(null);

  const DataFromCache = (
    <Snackbar
      layout='vertical'
      onClose={() => setSnackbar(null)}
      before={<Icon28InfoCircle fill='var(--vkui--color_background_accent)' />}
      action='Загрузить новые'
      onActionClick={() => handleReloadData()}
    >
      Данные взяты из кеша
    </Snackbar>
  );

  const StartBiggerThenEnd = (
    <Snackbar
      onClose={() => setSnackbar(null)}
      before={<Icon28InfoCircle fill='var(--vkui--color_background_accent)' />}
      subtitle='Конечная дата будет автоматически установлена на 5 дней больше начальной'
    >
      Начальная дата больше конечной
    </Snackbar>
  );

  const ErrorSnackbar = !snackbar && (
    <Snackbar
      onClose={() => setSnackbar(null)}
      layout='vertical'
      before={<Icon28ErrorCircleOutline fill='var(--vkui--color_icon_negative)' />}
    >
      Ошибка при попытке получить расписание
    </Snackbar>
  );

  const currentDate = new Date();

  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();
  const [lessonsState, setLessons] = useState<Day[] | null>();
  const [startDate, setStartDate] = useState<Date>(startOfWeek(currentDate));
  const [endDate, setEndDate] = useState<Date>(endOfWeek(currentDate));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  // @ts-ignore
  const updateDatesFromData = (data) => {
    const firstLessonDate = data && data.length > 0 ? new Date(data[0].date) : startDate;
    const lastLessonDate = data && data.length > 0 ? new Date(data[data.length - 1].date) : endDate;
    setStartDate(startOfWeek(firstLessonDate));
    setEndDate(endOfWeek(lastLessonDate));
  };

  const handleReloadData = async () => {
    setSnackbar(null);
    setIsError(false);
    setIsLoading(true);
    const newEndDate = new Date(endDate);
    newEndDate.setDate(newEndDate.getDate() + 7);

    try {
      const data = await getLessons(startDate, newEndDate);
      console.log(data);
      if (typeof data === 'string') {
        setSnackbar(
          <Snackbar
            layout='vertical'
            onClose={() => setSnackbar(null)}
            before={<Icon28InfoCircle fill='var(--vkui--color_background_accent)' />}
            action='Вы временно заблокированы. Если вы считаете, что это ошибка, то сообщите нам'
            onActionClick={() => handleReloadData()}
          >
            Слишком частые запросы
          </Snackbar>,
        );
        return;
      }
      setLessons(data);
      setIsLoading(false);

      updateDatesFromData(data);

      localStorage.setItem('savedLessons', JSON.stringify(data));
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      setSnackbar(ErrorSnackbar);
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
          console.log(data);
          if (typeof data === 'string') {
            setSnackbar(
              <Snackbar
                layout='vertical'
                onClose={() => setSnackbar(null)}
                before={<Icon28InfoCircle fill='var(--vkui--color_background_accent)' />}
                action='Вы временно заблокированы. Если вы считаете, что это ошибка, то сообщите нам'
                onActionClick={() => handleReloadData()}
              >
                Слишком частые запросы
              </Snackbar>,
            );
            return;
          }
          setLessons(data);
          setIsLoading(false);

          localStorage.setItem('savedLessons', JSON.stringify(data));
          localStorage.setItem('lastRequestTime', currentTime.toString());

          setSnackbar(null);

          updateDatesFromData(data);
        } else {
          setIsLoading(false);
          if (!snackbar) {
            setSnackbar(DataFromCache);
          }
        }
      } catch (error) {
        setIsLoading(false);
        setIsError(true);
        setSnackbar(ErrorSnackbar);
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
        console.log(data);
        if (typeof data === 'string') {
          setSnackbar(
            <Snackbar
              layout='vertical'
              onClose={() => setSnackbar(null)}
              before={<Icon28InfoCircle fill='var(--vkui--color_background_accent)' />}
              action='Вы временно заблокированы. Если вы считаете, что это ошибка, то сообщите нам'
              onActionClick={() => handleReloadData()}
            >
              Слишком частые запросы
            </Snackbar>,
          );
          return;
        }

        setLessons(data);

        localStorage.setItem('savedLessons', JSON.stringify(data));
      } else {
        console.info('Разница между датами больше 14-и дней');

        const newEndDate = new Date(start);
        newEndDate.setDate(newEndDate.getDate() + 14);
        setEndDate(newEndDate);

        const BigDifference = (
          <Snackbar
            onClose={() => setSnackbar(null)}
            before={<Icon28InfoCircle fill='var(--vkui--color_background_accent)' />}
            subtitle={`Конечная дата будет автоматически изменена на ${newEndDate.toLocaleString()}`}
          >
            Разница между датами больше 14-и дней
          </Snackbar>
        );

        if (!snackbar) {
          setSnackbar(BigDifference);
        }

        const data = await getLessons(start, newEndDate);
        if (typeof data === 'string') {
          setSnackbar(
            <Snackbar
              layout='vertical'
              onClose={() => setSnackbar(null)}
              before={<Icon28InfoCircle fill='var(--vkui--color_background_accent)' />}
              action='Вы временно заблокированы. Если вы считаете, что это ошибка, то сообщите нам'
              onActionClick={() => handleReloadData()}
            >
              Слишком частые запросы
            </Snackbar>,
          );
          return;
        }
        setLessons(data);

        localStorage.setItem('savedLessons', JSON.stringify(data));
      }
    } else {
      console.info('Начальная дата больше конечной');

      if (!snackbar) {
        setSnackbar(StartBiggerThenEnd);

        const newEndDate = new Date(start);
        newEndDate.setDate(newEndDate.getDate() + 5);
        setEndDate(newEndDate);

        const data = await getLessons(start, newEndDate);
        if (typeof data === 'string') {
          setSnackbar(
            <Snackbar
              layout='vertical'
              onClose={() => setSnackbar(null)}
              before={<Icon28InfoCircle fill='var(--vkui--color_background_accent)' />}
              action='Вы временно заблокированы. Если вы считаете, что это ошибка, то сообщите нам'
              onActionClick={() => handleReloadData()}
            >
              Слишком частые запросы
            </Snackbar>,
          );
          return;
        }
        setLessons(data);

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

  const weekString = `${startDate.getDate()} ${startDate.toLocaleString('default', { month: 'long' }).slice(0, 4)} - ${endDate.getDate()} ${endDate.toLocaleString('default', { month: 'long' }).slice(0, 4)}`;
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
        {isLoading && (
          <Snackbar
            onClose={() => setSnackbar(null)}
            before={<Icon28InfoCircle fill='var(--vkui--color_background_accent)' />}
            subtitle='Скоро расписание появится на экране'
          >
            Загрузка
          </Snackbar>
        )}
        {snackbar}
      </Panel>
    </View>
  );
};

export default Schedule;
