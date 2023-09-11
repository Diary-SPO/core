import { getCookie } from '../bridge/getCookie';
import { AttestationResponse } from '../../../../shared';
import { getUserId } from '../bridge/getUserId';

const getAttestation = async (): Promise<AttestationResponse | 418 | 429> => {
  const cookie = await getCookie();
  const id = await getUserId();

  if (!cookie) {
    return 418;
  }

  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/attestation/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      secret: cookie,
    },
  });

  if (response.status === 429) {
    console.log(response.status);
    return response.status;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch college data');
  }

  return await response.json() as AttestationResponse;
};

export default getAttestation;
