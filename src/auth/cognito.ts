import axios from 'axios';
import { AWSSignature } from './types';
import { AUTH_URL } from '../constants';

export const authenticate = async (
  provider: string,
  access_token: string,
  access_token_secret?: string,
): Promise<AWSSignature> => {
  const payload = provider && access_token
    ? { provider, access_token, access_token_secret }
    : {};

  const {
    data: {
      userId,
      accessKeyId,
      secretKey,
      sessionToken,
      expires,
    }
  } = await axios.post(`${AUTH_URL}/token`, payload);

  return {
    userId,
    accessKeyId,
    secretKey,
    sessionToken,
    expires,
  };
};
