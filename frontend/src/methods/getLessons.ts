import bridge from '@vkontakte/vk-bridge';

import { Day } from '../../../shared';
import formatDateForRequest from '../utils/formatDateForRequest';

export const getLessons = async (startDate?: Date, endDate?: Date): Promise<Day[]> => {
  const cookie = await bridge.send('VKWebAppStorageGet', {
    keys: ['cookie'],
  })
    .then((data) => {
      if (data.keys) {
        return data.keys[0].value;
      }

      return false;
    })
    .catch((error) => console.error(error));

  const id = await bridge.send('VKWebAppStorageGet', {
    keys: ['id'],
  })
    .then((data) => {
      if (data.keys) {
        return data.keys[0].value;
      }

      return false;
    })
    .catch((error) => console.error(error));

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
      secret: cookie as string,
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
