import bridge from '@vkontakte/vk-bridge';

interface VKWebAppStorageGetResponse {
  keys: {
    key: string;
    value: string;
  }[]
}

export const getVkStorageData = async (keys: string[]): Promise<VKWebAppStorageGetResponse> => {
  try {
    const data: VKWebAppStorageGetResponse = {
      keys: []
    }
    Object.values(keys).forEach((value) => {
      data.keys.push({
        key: value,
        value: localStorage.getItem(value) ?? ''
      })
    })
    return data
  } catch (error) {
    console.error(error);
    return { keys: [] };
  }
};
