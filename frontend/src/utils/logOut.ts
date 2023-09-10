import { clearVkStorage } from '../views/Settings.tsx';

const logOut = async () => {
  await clearVkStorage();
  location.reload();
};

export default logOut;
