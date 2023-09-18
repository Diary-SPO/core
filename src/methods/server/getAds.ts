import { NotificationsResponse } from 'diary-shared';
import makeRequest from './makeRequest';

const getAds = async (): Promise<NotificationsResponse[] | 418 | 429> => makeRequest('/ads');

export default getAds;
