import { Day } from '../../../shared/lessons';

export const getLessons = async (): Promise<Day[]> => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/lessons`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      secret: import.meta.env.VITE_COOKIE as string,
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
