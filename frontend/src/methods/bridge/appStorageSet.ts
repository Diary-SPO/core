import bridge from '@vkontakte/vk-bridge';

export const appStorageSet = async (key: string, value: string): Promise<boolean | unknown> => {
  try {
    const data = await bridge.send('VKWebAppStorageSet', {
      key,
      value,
    });

    if (data.result) {
      return data.result;
    }
  } catch (error) {
    console.error(error);
    return error;
  }
};
