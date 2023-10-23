import bridge from '@vkontakte/vk-bridge';

export const getVkStorageKeys = async () => {
  try {
    return Object.keys(localStorage)
  } catch (error) {
    console.error(error);
    return [];
  }
};
