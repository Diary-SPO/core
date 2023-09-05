import { CSSProperties, useEffect, useState } from 'react';
import {
  Avatar, Gradient, Group, Header, SimpleCell, Title, Text, Div, Spinner,
} from '@vkontakte/vkui';
import { Icon28SchoolOutline } from '@vkontakte/icons';
import bridge from "@vkontakte/vk-bridge";

import { getVkStorageData, getVkStorageKeys } from "../methods";

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
  
  useEffect(() => {
    
    const getUserInfo = async () => {
      setIsLoading(true);
      
      const keys = await getVkStorageKeys();
      const data = await getVkStorageData(keys);
      
      await bridge.send('VKWebAppGetUserInfo')
        .then((data) => {
          if (data.id) {
            setUserAva(data.photo_100)
          }
        })
        .catch((error) => {
          console.log(error);
        });
      
      const extractedData: Partial<UserData> = data.keys.reduce((acc, item) => {
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
    return <Div>
      <Spinner />
    </Div>
  }
  
  return (
    <div>
      <Group>
        <Gradient mode='tint' style={styles}>
          <Avatar size={96} src={userAva} />
          <Title style={{ marginBottom: 8, marginTop: 20 }} level='2' weight='2'>
            {`${userData.lastName} ${userData.firstName} ${userData.middleName}`}
          </Title>
          <Text
            style={{
              marginBottom: 24,
              color: 'var(--vkui--color_text_secondary)',
            }}
          >
            Студент ({userData.group})
          </Text>
        </Gradient>
        <Group mode='plain'>
          <Header>Учебное заведение</Header>
          <SimpleCell before={<Icon28SchoolOutline />} subtitle={userData.city}>
            {userData.org}
          </SimpleCell>
        </Group>
      </Group>
    </div>
  );
}

export default UserInfo;
