import bridge from '@vkontakte/vk-bridge';

export const appStorageSet = async (key: string, value: string): Promise<boolean | string> => {
  try {
    localStorage.setItem(key, value)

    return true;
  } catch (error) {
    console.error(error);
    return error as string;
  }
};
