const AWS = require('aws-sdk');

const IDENTITY_POOL_ID = process.env.IDENTITY_POOL_ID;
const GUEST_IDENTITY_ID = process.env.GUEST_IDENTITY_ID;
const IDENTITY_PROVIDER = 'auth.zeroweb';

let cognito;

exports.initCognito = () => {
  try {
    if (!IDENTITY_POOL_ID) throw new Error('cognito environment variables are not set');

    AWS.config.update({ region: 'us-west-2' });
    cognito = new AWS.CognitoIdentity();
    return true;

  } catch (error) {
    console.error('cognito initialization failed', error);
    return false;
  }
};

const getGuestIdentity = () => (
  new Promise((resolve, reject) => {
    if (GUEST_IDENTITY_ID) {
      resolve(GUEST_IDENTITY_ID);
    } else {
      cognito.getId({
        IdentityPoolId: IDENTITY_POOL_ID
      },
      (error, data) => {
        if (error) {
          console.error('getId failed with', error);
          reject(error);
        } else {
          const { IdentityId } = data;
          resolve(IdentityId);
        }
      });
    }
  })
);

const getGuestCredentials = (IdentityId) => (
  new Promise((resolve, reject) => {
    cognito.getCredentialsForIdentity({
      IdentityId
    },
    (error, data) => {
      if (error) {
        console.error('getCredentialsForIdentity failed with', error);
        reject(error);
      } else {
        const {
          Credentials: {
            AccessKeyId,
            SecretKey,
            SessionToken,
            Expiration,
          }
        } = data;

        resolve({
          accessKeyId: AccessKeyId,
          secretKey: SecretKey,
          sessionToken: SessionToken,
          expires: Expiration,
        });
      }
    });
  })
);

const getUserIdentity = (
  provider,
  providerId
) => (
  new Promise((resolve, reject) => {
    cognito.getOpenIdTokenForDeveloperIdentity({
      IdentityId: null,
      IdentityPoolId: IDENTITY_POOL_ID,
      Logins: {
        [IDENTITY_PROVIDER]: `${provider}:${providerId}`
      }
    },
    (error, data) => {
      if (error) {
        console.error('getOpenIdTokenForDeveloperIdentity failed with', error);
        reject(error);
      } else {
        resolve(data);
      }
    });
  })
);

const getUserCredentials = (
  IdentityId,
  Token
) => (
  new Promise((resolve, reject) => {
    cognito.getCredentialsForIdentity({
      IdentityId,
      Logins: {
        'cognito-identity.amazonaws.com': Token
      }
    },
    (error, data) => {
      if (error) {
        console.error('getCredentialsForIdentity failed with', error);
        reject(error);
      } else {
        const {
          Credentials: {
            AccessKeyId,
            SecretKey,
            SessionToken,
            Expiration,
          }
        } = data;

        resolve({
          accessKeyId: AccessKeyId,
          secretKey: SecretKey,
          sessionToken: SessionToken,
          expires: Expiration,
        });
      }
    });
  })
);

const deleteUserIdentity = (IdentityId) => (
  new Promise((resolve, reject) => {
    cognito.deleteIdentities({
      IdentityIdsToDelete: [ IdentityId ]
    },
    (error, data) => {
      if (error) {
        console.error('deleteIdentities failed with', error);
        reject(error);
      } else {
        const { UnprocessedIdentityIds } = data;

        if (UnprocessedIdentityIds.length > 0)
          reject(new Error(`failed to process identity deletion: ${UnprocessedIdentityIds[0].ErrorCode}`));
        
        resolve(IdentityId);
      }
    });
  })
);

exports.getCognitoGuestCredentials = async () => {
  const identityId = await getGuestIdentity();
  return getGuestCredentials(identityId);
};

exports.getCognitoUserCredentials = async (
  provider,
  providerId
) => {
  const { IdentityId, Token } = await getUserIdentity(provider, providerId);
  return getUserCredentials(IdentityId, Token);
};

exports.deleteCognitoUserIdentity = async (
  provider,
  providerId
) => {
  const { IdentityId } = await getUserIdentity(provider, providerId);
  return deleteUserIdentity(IdentityId);
};
