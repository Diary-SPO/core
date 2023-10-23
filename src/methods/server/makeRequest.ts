
// TODO: move to config
const BASE_URL = import.meta.env.VITE_SERVER_URL as string ?? '';
const SECOND_SERVER_URL = import.meta.env.VITE_SERVER_URL_SECOND as string ?? '';

const makeRequest = async <T>(route: string): Promise< T | 418 | 429> => {
  const cookie = localStorage.getItem('cookie') ?? sessionStorage.getItem('cookie')
  const url = `${BASE_URL}${route}`;

  if (!cookie) {
    return 418;
  }

  try {
    const response = await fetch(BASE_URL + route, {
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

    console.log(response.ok);
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

      return await secondServerResponse.json() as T;
    }

    return await response.json() as T;
  } catch (err) {
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

    console.log(err);
    return await secondServerResponse.json() as T;
  }
};

export default makeRequest;
