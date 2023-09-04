import bridge from '@vkontakte/vk-bridge';

export const appStorageSet = async (key: string, value: string) => {
  try {
    const data = await bridge.send('VKWebAppStorageSet', {
      key,
      value,
    });

    if (data.result) {
      console.log(data);
      return data;
    }
  } catch (error) {
    console.error(error);
    return error;
  }
};
