import { FC, useEffect, useState } from 'react';
import { Panel, Snackbar, View } from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Icon28InfoCircle } from '@vkontakte/icons';
import PanelHeaderWithBack from '../components/PanelHeaderWithBack';
import { Day } from '../../../shared/lessons';
import { getLessons } from '../methods/getLessons';
import ScheduleGroup from '../components/ScheduleGroup';
import CalendarRange from '../components/CalendarRange';
import formatDateForRequest from "../utils/formatDateForRequest.ts";

const Profile: FC<{ id: string }> = ({ id }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();
  const [lessonsState, setLessons] = useState<Day[] | null>();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [snackbar, setSnackbar] = useState(null);
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
        
        // setDataFromCache(false);
        setSnackbar(null);
      } else {
        setIsLoading(false);
        setSnackbar(
          // @ts-ignore
          <Snackbar
            layout='vertical'
            onClose={() => setSnackbar(null)}
            before={<Icon28InfoCircle fill='var(--vkui--color_background_accent)' />}
            // subtitle='Данные взяты из кеша'
            title='Данные взяты из кеша'
            action='Загрузить новые'
            onActionClick={() => handleReloadData()}
          />
        );
      }
    };
    
    if (savedLessons) {
      setLessons(JSON.parse(savedLessons));
      // setDataFromCache(true);
    }
    
    if (!snackbar && isLoading) {
      setSnackbar(
        // @ts-ignore
        <Snackbar
          onClose={() => setSnackbar(null)}
          before={<Icon28InfoCircle fill="var(--vkui--color_background_accent)" />}
          subtitle="Скоро расписание появится на экране"
        >
          Загрузка
        </Snackbar>
      );
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
        console.error('Ошибка: Разница между датами больше 14-и дней');
        
        const newEndDate = new Date(start);
        newEndDate.setDate(newEndDate.getDate() + 14);
        setEndDate(newEndDate);
        
        if (!snackbar) {
          setSnackbar(
            // @ts-ignore
            <Snackbar
              onClose={() => setSnackbar(null)}
              before={<Icon28InfoCircle fill={'var(--vkui--color_background_accent)'} />}
              subtitle={`Конечная дата будет изменена ${formatDateForRequest(newEndDate)}`}
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
      console.info('Ошибка: Начальная дата больше конечной');
      
      if (!snackbar) {
        setSnackbar(
          // @ts-ignore
          <Snackbar
            onClose={() => setSnackbar(null)}
            before={<Icon28InfoCircle fill='var(--vkui--color_background_accent)'/>}
            subtitle='Конечная дата установлена на 5 дней больше начальной'
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
    newEndDate.setDate(newEndDate.getDate() + 10);
    const data = await getLessons(startDate, newEndDate);
    setLessons(data);
    setIsLoading(false);
    // setDataFromCache(false);
    
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
        <ScheduleGroup lessonsState={lessonsState} />
        {snackbar}
      </Panel>
    </View>
  );
};

export default Profile;
