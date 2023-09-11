import { Organization } from '../../../../shared';
import { getCookie } from '../bridge/getCookie';

const getCollegeInfo = async (): Promise<Organization | 418 | 429> => {
  const cookie = await getCookie();

  if (!cookie) {
    return 418;
  }

  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/organization`, {
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
    throw new Error('Failed to fetch college data');
  }

  return await response.json() as Organization;
};

export default getCollegeInfo;
