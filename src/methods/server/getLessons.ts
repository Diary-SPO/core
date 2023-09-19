import { Day } from 'diary-shared';
import formatDateForRequest from '../../utils/formatDateForRequest';
import { getUserId } from '../bridge/getUserId';
import { getCookie } from '../bridge/getCookie';
import makeRequest from './makeRequest';

export const getLessons = async (startDate?: Date, endDate?: Date): Promise<Day[] | 418 | 429> => {
  const cookie = await getCookie() ?? localStorage.getItem('cookie');
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

  return makeRequest(`/lessons/${id}/${formattedStartDate}/${formattedEndDate}`); // Используем makeRequest для выполнения запроса
};
