import { getCookie } from '../bridge/getCookie';

const BASE_URL = import.meta.env.VITE_SERVER_URL;
const SECOND_SERVER_URL = import.meta.env.VITE_SERVER_URL_SECOND;

const makeRequest = async (route: string): Promise<any> => {
  const cookie = await getCookie();
  const url = `${BASE_URL}${route}`;

  if (!cookie) {
    return 418;
  }

  const response = await fetch(url, {
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
    const secondServerResponse = await fetch(SECOND_SERVER_URL + route, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        secret: cookie,
      },
    });

    if (secondServerResponse.status === 429) {
      console.log(secondServerResponse.status);
      return secondServerResponse.status;
    }

    if (!secondServerResponse.ok) {
      throw new Error(`Failed to fetch data from ${url} and SECOND_SERVER`);
    }

    return secondServerResponse.json();
  }

  return response.json();
};

export default makeRequest;
