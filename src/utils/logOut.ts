import { appStorageSet, getVkStorageKeys } from '../methods';

const clearVkStorage = async () => {
  try {
    const keys = await getVkStorageKeys();

    await Promise.all(keys.map(async (key) => {
      await appStorageSet(key, '');
    }));
  } catch (error) {
    console.error(error);
  }
};

const logOut = async () => {
  await clearVkStorage();
  await clearVkStorage();
  localStorage.clear();
  localStorage.clear();
  window.location.reload();
  window.location.reload();
};

export default logOut;
