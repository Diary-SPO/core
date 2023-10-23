import bridge from '@vkontakte/vk-bridge';

export const getCookie = async () => {
  try {
    return localStorage.getItem('cookie')
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
