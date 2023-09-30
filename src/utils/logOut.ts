import { appStorageSet, getVkStorageKeys } from '../methods';

const clearVkStorage = async () => {
  try {
    const keys = await getVkStorageKeys();

    for (const key of keys) {
      appStorageSet(key, '');
    }
  } catch (error) {
    console.error(error);
  }
};

const logOut = async () => {
  await clearVkStorage();
  localStorage.clear();
};

export default logOut;
