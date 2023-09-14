import bridge from '@vkontakte/vk-bridge';

interface VKWebAppStorageGetResponse {
  keys: {
    key: string;
    value: string;
  }[]
}

export const getVkStorageData = async (keys: string[]): Promise<VKWebAppStorageGetResponse> => {
  try {
    return await bridge.send('VKWebAppStorageGet', {
      keys,
    });
  } catch (error) {
    console.error(error);
    return { keys: [] };
  }
};
