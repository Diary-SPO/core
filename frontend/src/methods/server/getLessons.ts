import { Day } from '../../../../shared';
import formatDateForRequest from '../../utils/formatDateForRequest';

import { getUserId } from '../bridge/getUserId';
import { getCookie } from '../bridge/getCookie';

export const getLessons = async (startDate?: Date, endDate?: Date): Promise<Day[]> => {
  const cookie = await getCookie();
  const id = await getUserId();

  if (!startDate) {
    startDate = new Date();
  }

  if (!endDate) {
    endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
  }
  console.log('origin', origin)
  const formattedStartDate = formatDateForRequest(startDate);
  const formattedEndDate = formatDateForRequest(endDate);
  console.log(cookie)
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/lessons/${id}/${formattedStartDate}/${formattedEndDate}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      secret: cookie as string,
      origin: origin
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch lessons');
  }

  const data = await response.json() as Day[];
  if (!Array.isArray(data)) {
    throw new Error('Invalid data format');
  }

  return data;
};
