import { getCookie } from '../bridge/getCookie';
import { NotificationsResponse } from '../../../../shared';

const getAds = async (): Promise<NotificationsResponse[] | 418 | 429> => {
  const cookie = await getCookie();

  if (!cookie) {
    return 418;
  }

  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/ads`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      secret: cookie,
    },
  });

  if (response.status === 429) {
    console.log(response.status);
    return response.status;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch ads data');
  }

  return await response.json() as NotificationsResponse[];
};

export default getAds;
