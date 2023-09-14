import bridge from '@vkontakte/vk-bridge';

export const getVkStorageKeys = async () => {
  try {
    const data = await bridge.send('VKWebAppStorageGetKeys', {
      count: 20,
      offset: 0,
    });

    return data.keys || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};
