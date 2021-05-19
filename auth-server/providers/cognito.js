const AWS = require('aws-sdk');

const IDENTITY_POOL_ID = process.env.IDENTITY_POOL_ID;
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

exports.getCognitoGuestCredentials = () => (
  new Promise((resolve, reject) => {
    cognito.getId({
      IdentityPoolId: IDENTITY_POOL_ID
    },
    (error, data) => {
      if (error) {
        console.error('getId failed with', error);
        reject(error);
      } else {
        const { IdentityId } = data;

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
      }
    });
  })
)

exports.getCognitoUserCredentials = (
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
        const { IdentityId, Token } = data;

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
      }
    })
  })
);

exports.deleteCognitoIdentity = (
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
        const { IdentityId } = data;
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
      }
    });
  })
);
