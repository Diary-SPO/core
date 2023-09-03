import { PerformanceCurrent } from '../../../shared';

import { getCookie } from './getCookie';
import { getUserId } from './getUserId';

export const getPerformance = async (): Promise<PerformanceCurrent> => {
  const cookie = await getCookie();
  const id = await getUserId();

  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/performance.current/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      secret: cookie as string,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch lessons');
  }

  return await response.json() as PerformanceCurrent;
};
