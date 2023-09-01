import { Day } from '../../../shared/lessons';
import bridge from "@vkontakte/vk-bridge";

export const getLessons = async (): Promise<Day[]> => {
  const cookie = await bridge.send('VKWebAppStorageGet', {
    keys: ['cookie'],
  })
      .then((data) => {
        if (data.keys) {
          return data.keys[0].value
        }
      })
      .catch((error) => {
        return error
      });

  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/lessons`, {
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
