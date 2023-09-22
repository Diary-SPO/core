import { clearVkStorage } from '../views/Settings';

const logOut = async () => {
  localStorage.clear()
  await clearVkStorage();
  location.reload();
};

export default logOut;
