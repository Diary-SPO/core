import { clearVkStorage } from '../views/Settings';

const logOut = async () => {
  await clearVkStorage();
  location.reload();
};

export default logOut;
