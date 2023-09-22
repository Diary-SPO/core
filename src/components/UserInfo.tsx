import { CSSProperties, useEffect, useState } from 'react';
import {
  Avatar, Button, Div, Gradient, Group, Header, ScreenSpinner, SimpleCell, Spinner, Text, Title,
} from '@vkontakte/vkui';
import { Icon28SchoolOutline, Icon20RefreshOutline } from '@vkontakte/icons';

import bridge from '@vkontakte/vk-bridge';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Organization } from 'diary-shared';
import { getVkStorageData } from '../methods';
import { useModal } from '../modals/ModalContext';
import { useRateLimitExceeded } from '../hooks';
import { MODAL_COLLEGE_INFO } from '../modals/ModalRoot';
import getCollegeInfo from '../methods/server/getCollegeInfo';

const styles: CSSProperties = {
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: 32,
};

interface UserData {
  city: string
  group: string
  name: string
  org: string
}

const getUserAva = async (): Promise<string | null> => {
  try {
    const data = await bridge.send('VKWebAppGetUserInfo');
    if (data.id) {
      localStorage.setItem('ava', data.photo_100);
      return data.photo_100;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const UserInfo = () => {
  const routeNavigator = useRouteNavigator();

  const { openCollegeModal } = useModal();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCollegeLoading, setIsCollegeLoading] = useState<boolean>(false);
  const [userAva, setUserAva] = useState<string | undefined>();

  const getCollegeInfoFromServer = async () => {
    setIsCollegeLoading(true);
    try {
      const data = await getCollegeInfo();

      if (data === 429) {
        useRateLimitExceeded();
        return;
      }

      await routeNavigator.showModal(MODAL_COLLEGE_INFO);
      openCollegeModal(data as Organization);
      setIsCollegeLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const [userData, setUserData] = useState<UserData>({
    name: '',
    org: '',
    city: '',
    group: '',
  });

  const getUserInfo = async (handle?: boolean) => {
    setIsLoading(true);

    const localData = localStorage.getItem('userData');
    const avaFromStorage = localStorage.getItem('ava');

    if (localData && !handle) {
      const parsedData: UserData = JSON.parse(localData);
      if (parsedData.name && parsedData.group) {
        setUserData(parsedData);
        if (avaFromStorage) {
          setUserAva(avaFromStorage);
        }
        setIsLoading(false);
        return;
      }
    }

    const newUserData = await getVkStorageData(['data']);
    const parsedUserData: UserData = JSON.parse(newUserData.keys[0].value);

    const ava = await getUserAva();

    if (ava) {
      setUserAva(ava);
    }

    setUserData({
      name: parsedUserData.name || '',
      org: parsedUserData.org || '',
      city: parsedUserData.city || '',
      group: parsedUserData.group || '',
    });

    localStorage.setItem('userData', JSON.stringify(newUserData));

    setIsLoading(false);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  if (isLoading) {
    return (
      <Div>
        <Spinner />
      </Div>
    );
  }
  const header = (
    <Header
      aside={(
        <Button
          size='s'
          after={<Icon20RefreshOutline />}
          aria-label='Обновить'
          mode='tertiary'
          onClick={() => getUserInfo(true)}
        />
    )}
      mode='tertiary'
    >
      Личная информация
    </Header>
  );

  return (
    <Group
      mode='plain'
      header={header}
    >
      <Gradient mode='tint' style={styles}>
        <Avatar size={96} src={userAva} />
        <Title style={{ marginBottom: 8, marginTop: 20 }} level='2' weight='2'>
          {userData.name}
        </Title>
        <Text
          style={{
            marginBottom: 24,
            color: 'var(--vkui--color_text_secondary)',
          }}
        >
          Студент (
          {userData.group}
          )
        </Text>
      </Gradient>
      <Group mode='plain' header={<Header mode='tertiary'>Учебное заведение</Header>}>
        {isCollegeLoading && <ScreenSpinner />}
        <SimpleCell before={<Icon28SchoolOutline />} subtitle={userData.city} onClick={getCollegeInfoFromServer}>
          {userData.org}
        </SimpleCell>
      </Group>
    </Group>
  );
};

export default UserInfo;
