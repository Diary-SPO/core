import { Day } from 'diary-shared';
import formatDateForRequest from '../../utils/formatDateForRequest';
import { getUserId } from '../bridge/getUserId';
import { getCookie } from '../bridge/getCookie';

export const getLessons = async (startDate?: Date, endDate?: Date): Promise<Day[] | 418 | 429> => {
  const cookie = await getCookie() || localStorage.getItem('cookie');
  const id = await getUserId() || localStorage.getItem('id');

  if (!id) {
    return 418;
  }
  
  if (!cookie) {
    return 418;
  }

  if (!startDate) {
    startDate = new Date();
  }

  if (!endDate) {
    endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
  }

  const formattedStartDate = formatDateForRequest(startDate);
  const formattedEndDate = formatDateForRequest(endDate);

  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/lessons/${id}/${formattedStartDate}/${formattedEndDate}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      secret: cookie,
      origin,
    },
  });

  if (response.status === 429) {
    console.log(response.status);
    return response.status;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch lessons');
  }

  const data = await response.json() as Day[];

  if (!Array.isArray(data)) {
    throw new Error('Invalid data format');
  }

  return data;
};
