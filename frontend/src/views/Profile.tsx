import {
  FC, useEffect, useState,
} from 'react';
import {
  Panel, View,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

import PanelHeaderWithBack from '../components/PanelHeaderWithBack';
import { Day } from '../../../shared/lessons';
import { getLessons } from '../methods/getLessons';
import ScheduleGroup from '../components/ScheduleGroup';

const Profile: FC<{ id: string }> = ({ id }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();
  const [lessonsState, setLessons] = useState<Day[] | null>();

  useEffect(() => {
    const gettedLessons = async () => {
      const data = await getLessons();
      setLessons(data);
    };

    gettedLessons();
  }, []);

  return (
    <View
      id={id}
      history={panelsHistory}
      activePanel={activePanel as string}
      onSwipeBack={() => routeNavigator.back()}
    >
      <Panel nav={id}>
        <PanelHeaderWithBack title='Расписание' />
        <ScheduleGroup lessonsState={lessonsState} />
      </Panel>
    </View>
  );
};

export default Profile;
