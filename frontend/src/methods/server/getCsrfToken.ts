export const getCsrfToken = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/secret/getCsrfToken`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch CSRF token');
    }

    const data = await response.json();
    const { csrfToken } = data;

    return csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
};
