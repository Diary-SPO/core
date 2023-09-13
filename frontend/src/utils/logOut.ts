import { clearVkStorage } from '../views/Settings';

const logOut = async () => {
  localStorage.setItem('savedMarks', '');
  localStorage.setItem('lastRequestTime ', '');
  await clearVkStorage();
  location.reload();
};

export default logOut;
