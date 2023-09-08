import {
  CSSProperties, ReactNode, useEffect, useState,
} from 'react';
import {
  Avatar, Gradient, Group, Header, SimpleCell, Title, Text, Div, Spinner, Snackbar,
} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Icon28SchoolOutline, Icon32PrometeyCircleFillRed } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';

import { appStorageSet, getVkStorageData, getVkStorageKeys } from '../methods';
import { useModal } from '../modals/ModalContext';
import { getCollegeInfoFromServer } from '../views/Settings';
import { useRateLimitExceeded } from '../hooks';
import { MODAL_COLLEGE_INFO } from '../modals/ModalRoot';
import { Organization } from '../../../shared';

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
  [key: string]: string;
}

const UserInfo = () => {
  const routeNavigator = useRouteNavigator();
  const { openCollegeModal } = useModal();

  const getCollegeInfo = async () => {
    const data = await getCollegeInfoFromServer();

    if (data === 429) {
      useRateLimitExceeded();
      return;
    }

    await routeNavigator.showModal(MODAL_COLLEGE_INFO);
    openCollegeModal(data as Organization);
  };
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    middleName: '',
    org: '',
    groupName: '',
    city: '',
    group: '',
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userAva, setUserAva] = useState<string | undefined>();
  const [snackbar, setSnackbar] = useState<ReactNode | null>(null);

  const autoLogOut = async () => {
    await appStorageSet('cookie', '');
    location.reload();
    setSnackbar(null);
  };

  const openInvalidData = () => {
    setSnackbar(
      <Snackbar
        onClose={autoLogOut}
        before={
          <Icon32PrometeyCircleFillRed fill='#fff' width={32} height={32} />
       }
        subtitle='Через 10 секунд произойдет автоматический выход из аккаунта, поэтому ищите листок с паролем'
      >
        Данные устарели
      </Snackbar>,
    );
  };

  useEffect(() => {
    const getUserInfo = async () => {
      setIsLoading(true);

      const keys = await getVkStorageKeys();
      const data = await getVkStorageData(keys);

      await bridge.send('VKWebAppGetUserInfo')
        .then((data) => {
          if (data.id) {
            setUserAva(data.photo_100);
          }
        })
        .catch((error) => {
          console.log(error);
        });

      const extractedData: Partial<UserData> = data.keys.reduce((acc, item) => {
        // FIXME: при пустом имени не сработало
        if (
          (item.key === 'firstName' && item.value === ' ')
          || (item.key === 'lastName' && item.value === '')
          || (item.key === 'group' && item.value === '')
        ) {
          openInvalidData();
        }

        acc[item.key] = item.value;
        return acc;
      }, {} as UserData);

      setUserData({
        firstName: extractedData.firstName || '',
        lastName: extractedData.lastName || '',
        middleName: extractedData.middleName || '',
        org: extractedData.org || '',
        groupName: extractedData.groupName || '',
        city: extractedData.city || '',
        group: extractedData.group || '',
      });

      setIsLoading(false);
    };

    getUserInfo();
  }, []);

  if (isLoading) {
    return (
      <Div>
        <Spinner />
      </Div>
    );
  }

  return (
    <Group>
      <Gradient mode='tint' style={styles}>
        <Avatar size={96} src={userAva} />
        <Title style={{ marginBottom: 8, marginTop: 20 }} level='2' weight='2'>
          {userData.lastName}
          {' '}
          {userData.firstName}
          {' '}
          {userData.middleName}
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
      <Group mode='plain'>
        <Header>Учебное заведение</Header>
        <SimpleCell before={<Icon28SchoolOutline />} subtitle={userData.city} onClick={() => getCollegeInfo()}>
          {userData.org}
        </SimpleCell>
      </Group>
      {snackbar}
    </Group>
  );
};

export default UserInfo;
