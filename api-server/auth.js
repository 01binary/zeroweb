const getProvider = (providerString) => {
  if (!providerString) return {};

  const [
    idp,
    region,
    poolId,
    provider,
    providerId
  ] = providerString.split(':');

  return { provider, providerId };
};

exports.getUser = (requestContext) => {
  if (!requestContext || !requestContext.identity) return null;

  const {
    identity: {
      cognitoIdentityId: id,
      sourceIp,
      cognitoAuthenticationType,
      cognitoAuthenticationProvider: socialProvider,
    }
  } = requestContext;

  const { provider, providerId } = getProvider(socialProvider);

  return {
    id,
    authenticated: cognitoAuthenticationType === 'authenticated',
    provider,
    providerId,
    sourceIp,
  };
};
