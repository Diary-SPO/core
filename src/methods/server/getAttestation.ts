import { AttestationResponse } from 'diary-shared';
import { getCookie } from '../bridge/getCookie';
import { getUserId } from '../bridge/getUserId';
import makeRequest from './makeRequest';

const getAttestation = async (): Promise<AttestationResponse | 418 | 429> => {
  const cookie = await getCookie();
  const id = await getUserId();

  if (!cookie) {
    return 418;
  }

  return makeRequest(`/attestation/${id}`);
};

export default getAttestation;
