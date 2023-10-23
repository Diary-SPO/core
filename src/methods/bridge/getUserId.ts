import bridge from '@vkontakte/vk-bridge';

export const getUserId = async () => {
  try {
    return localStorage.getItem('id') ?? 0
    return 'no id';
  } catch (error) {
    console.error(error);
    return false;
  }
};
