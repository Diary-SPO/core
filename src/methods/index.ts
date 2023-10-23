import { getVkStorageData } from './bridge/getVkStorageData';
import { getVkStorageKeys } from './bridge/getVkStorageKeys';
import { appStorageSet } from './bridge/appStorageSet';
import { getUserId } from './bridge/getUserId';

import { getPerformance } from './server/getPerformance';
import { getLessons } from './server/getLessons';

export {
  getUserId, getLessons, appStorageSet, getPerformance, getVkStorageData, getVkStorageKeys,
};
