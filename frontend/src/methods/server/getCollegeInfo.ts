import { Organization } from '../../../../shared';
import { getCookie } from '../bridge/getCookie.ts';

const getCollegeInfo = async (): Promise<Organization | number> => {
  const cookie = await getCookie();

  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/organization`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      secret: cookie as string,
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
