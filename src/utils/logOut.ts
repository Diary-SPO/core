import { clearVkStorage } from '../views/Settings';

const logOut = async () => {
  localStorage.clear();
  await clearVkStorage();
};

export default logOut;
