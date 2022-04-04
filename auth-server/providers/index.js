const { validateFacebookToken } = require('./facebook');
const { validateGoogleToken } = require('./google');
const { validateTwitterToken } = require('./twitter');
const { validateGitHubToken } = require('./github');

const MAX_PROVIDER_LENGTH = 16;

const PROVIDERS = {
  facebook: validateFacebookToken,
  twitter: validateTwitterToken,
  google: validateGoogleToken,
  github: validateGitHubToken,
};

exports.validateProvider = provider => (
  provider.length <= MAX_PROVIDER_LENGTH &&
  Object.keys(PROVIDERS).find(k => k === provider)
);

exports.validateToken = async (provider, token, secret) => {
  const validateToken = PROVIDERS[provider];
  return validateToken(token, secret);
};
