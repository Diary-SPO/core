import { getVkStorageData } from './bridge/getVkStorageData';
import { getVkStorageKeys } from './bridge/getVkStorageKeys';
import { appStorageSet } from './bridge/appStorageSet';
import { getCookie } from './bridge/getCookie';
import { getUserId } from './bridge/getUserId';

import { getPerformance } from './server/getPerformance.ts';
import { getLessons } from './server/getLessons';
// import { getMarks } from './server/getMarks';

export {
  getCookie, getUserId, getLessons, appStorageSet, getPerformance, getVkStorageData, getVkStorageKeys,
};
