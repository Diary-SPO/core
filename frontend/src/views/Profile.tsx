import { FC, useEffect, useState } from 'react';
import { Panel, Snackbar, View } from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Icon28ErrorCircleOutline } from '@vkontakte/icons';
import PanelHeaderWithBack from '../components/PanelHeaderWithBack';
import { Day } from '../../../shared/lessons';
import { getLessons } from '../methods/getLessons';
import ScheduleGroup from '../components/ScheduleGroup';
import CalendarRange from '../components/CalendarRange';

const Profile: FC<{ id: string }> = ({ id }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();
  const [lessonsState, setLessons] = useState<Day[] | null>();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [snackbar, setSnackbar] = useState(null);

  useEffect(() => {
    const gettedLessons = async () => {
      const data = await getLessons();
      setLessons(data);
    };

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
  
  
  const sendToServerIfValid = (start: Date, end: Date) => {
    if (start <= end) {
      const differenceInDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
      if (differenceInDays <= 14) {
        sendToServer(start, end);
      } else {
        console.error('Ошибка: Разница между датами больше 14-и дней');
        
        if (!snackbar) {
          setSnackbar(
            // @ts-ignore
            <Snackbar
              onClose={() => setSnackbar(null)}
              before={<Icon28ErrorCircleOutline fill='var(--vkui--color_icon_negative)' />}
            >
              Разница между датами больше 14-и дней
            </Snackbar>,
          );
        }
      }
    } else {
      console.info('Ошибка: Начальная дата больше конечной');
      
      if (!snackbar) {
        setSnackbar(
          // @ts-ignore
          <Snackbar
            onClose={() => setSnackbar(null)}
            before={<Icon28ErrorCircleOutline fill='var(--vkui--color_icon_negative)' />}
            subtitle='Конечная дата установлена на 5 дней больше начальной'
          >
            Начальная дата больше конечной
          </Snackbar>,
        );
        
        const newEndDate = new Date(start);
        newEndDate.setDate(newEndDate.getDate() + 5);
        setEndDate(newEndDate);
        
        sendToServer(start, newEndDate);
      }
    }
  };
  
  const sendToServer = (start: Date, end: Date) => {
    console.log('Отправка данных на сервер:', start, end);
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
