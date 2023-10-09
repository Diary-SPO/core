import { Organization } from 'diary-shared';
import makeRequest from './makeRequest';

const getCollegeInfo = async (): Promise<Organization | 418 | 429> => makeRequest<Organization>('/organization');

export default getCollegeInfo;
