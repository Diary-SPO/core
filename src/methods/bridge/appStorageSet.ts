import bridge from '@vkontakte/vk-bridge';

export const appStorageSet = async (key: string, value: string): Promise<boolean | string> => {
  try {
    const data = await bridge.send('VKWebAppStorageSet', {
      key,
      value,
    });

    if (data.result) {
      return data.result;
    }

    return false;
  } catch (error) {
    console.error(error);
    return error as string;
  }
};
