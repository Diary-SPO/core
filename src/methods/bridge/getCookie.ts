import bridge from '@vkontakte/vk-bridge';

export const getCookie = async () => {
  try {
    const data = await bridge.send('VKWebAppStorageGet', {
      keys: ['cookie'],
    });
    if (data.keys) {
      return data.keys[0].value;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
