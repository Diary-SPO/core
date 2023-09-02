import {
  FC, lazy, ReactNode, useEffect, useState,
} from 'react';
import {
  Panel, PanelSpinner, Snackbar, View,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Icon28InfoCircle } from '@vkontakte/icons';

import { Day } from '../../../shared';
import { getLessons } from '../methods/getLessons';
import formatDateForRequest from '../utils/formatDateForRequest';

import PanelHeaderWithBack from '../components/PanelHeaderWithBack';
import Suspense from '../components/Suspense';

const CalendarRange = lazy(() => import('../components/CalendarRange'));
const ScheduleGroup = lazy(() => import('../components/ScheduleGroup'));

const Schedule: FC<{ id: string }> = ({ id }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();
  const [lessonsState, setLessons] = useState<Day[] | null>();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [snackbar, setSnackbar] = useState<null | ReactNode>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const savedLessons = localStorage.getItem('savedLessons');
    const getLastRequestTime = localStorage.getItem('lastRequestTime');
    const currentTime = Date.now();
    const lastRequestTime = getLastRequestTime ? parseInt(getLastRequestTime, 10) : 0;
    const timeSinceLastRequest = currentTime - lastRequestTime;
    
    const gettedLessons = async () => {
      setIsLoading(true);
      
      if (!savedLessons || timeSinceLastRequest > 30000) {
        const data = await getLessons();
        setLessons(data);
        setIsLoading(false);
        
        localStorage.setItem('savedLessons', JSON.stringify(data));
        localStorage.setItem('lastRequestTime', currentTime.toString());
        
        setSnackbar(null);
      } else {
        setIsLoading(false);
        setSnackbar(
          <Snackbar
            layout='vertical'
            onClose={() => setSnackbar(null)}
            before={<Icon28InfoCircle fill='var(--vkui--color_background_accent)' />}
            action='Загрузить новые'
            onActionClick={() => handleReloadData()}
          >
            Данные взяты из кеша
          </Snackbar>,
        );
      }
    };
    
    if (savedLessons) {
      setLessons(JSON.parse(savedLessons));
    }
    
    gettedLessons();
  }, []);
  
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
  
  const sendToServerIfValid = async (start: Date, end: Date) => {
    if (start <= end) {
      const differenceInDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
      if (differenceInDays <= 14) {
        const data = await getLessons(start, end);
        setLessons(data);
        
        localStorage.setItem('savedLessons', JSON.stringify(data));
      } else {
        console.info('Разница между датами больше 14-и дней');
        
        const newEndDate = new Date(start);
        newEndDate.setDate(newEndDate.getDate() + 7);
        setEndDate(newEndDate);
        
        if (!snackbar) {
          setSnackbar(
            <Snackbar
              onClose={() => setSnackbar(null)}
              before={<Icon28InfoCircle fill='var(--vkui--color_background_accent)' />}
              subtitle={`Конечная дата будет автоматически изменена ${formatDateForRequest(newEndDate)}`}
            >
              Разница между датами больше 14-и дней
            </Snackbar>,
          );
        }
        
        const data = await getLessons(start, newEndDate);
        setLessons(data);
        
        localStorage.setItem('savedLessons', JSON.stringify(data));
      }
    } else {
      console.info('Начальная дата больше конечной');
      
      if (!snackbar) {
        setSnackbar(
          <Snackbar
            onClose={() => setSnackbar(null)}
            before={<Icon28InfoCircle fill='var(--vkui--color_background_accent)' />}
            subtitle='Конечная дата будет автоматически установлена на 5 дней больше начальной'
          >
            Начальная дата больше конечной
          </Snackbar>,
        );
        
        const newEndDate = new Date(start);
        newEndDate.setDate(newEndDate.getDate() + 5);
        setEndDate(newEndDate);
        
        const data = await getLessons(start, newEndDate);
        setLessons(data);
        
        localStorage.setItem('savedLessons', JSON.stringify(data));
      }
    }
  };
  
  const handleReloadData = async () => {
    setSnackbar(null);
    
    setIsLoading(true);
    const newEndDate = new Date(endDate);
    newEndDate.setDate(newEndDate.getDate() + 7);
    const data = await getLessons(startDate, newEndDate);
    setLessons(data);
    setIsLoading(false);
    
    localStorage.setItem('savedLessons', JSON.stringify(data));
  };
  
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
            <ScheduleGroup lessonsState={lessonsState} />
          </Suspense>
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
