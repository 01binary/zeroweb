const oauth = require('oauth');

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
const TWITTER_REDIRECT_URL = process.env.TWITTER_REDIRECT_URL;

let oauthClient;

exports.initTwitter = () => {
  try {
    if (!TWITTER_CONSUMER_KEY || !TWITTER_CONSUMER_SECRET || !TWITTER_REDIRECT_URL) {
      console.error('twitter environment variables are not set');
      return false;
    }

    oauthClient = new oauth.OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      TWITTER_CONSUMER_KEY,
      TWITTER_CONSUMER_SECRET,
      '1.0',
      TWITTER_REDIRECT_URL,
      'HMAC-SHA1'
    );

    return true;

  } catch (error) {
    console.error('twitter initialization failed', error);
    return false;
  }
};

exports.getTwitterRequestToken = () => (
  new Promise((resolve, reject) => {
    oauthClient.getOAuthRequestToken((error, oauth_token, oauth_token_secret, results) => {
      if (error) {
        console.error('getOAuthRequestToken failure', error);
        reject(error);
      } else {
        resolve({ oauth_token, oauth_token_secret, results });
      }
    });
  })
);

exports.getTwitterAccessToken = (
  oauth_token,
  oauth_token_secret,
  oauth_verifier
) => (
  new Promise((resolve, reject) => {
    oauthClient.getOAuthAccessToken(
      oauth_token,
      oauth_token_secret,
      oauth_verifier,
      (error, oauth_access_token, oauth_access_token_secret, results) => {
        if (error) {
          console.error('getOAuthAccessToken failure', error);
          reject(error);
        } else {
          resolve({ oauth_access_token, oauth_access_token_secret, results });
        }
      }
    );
  })
);

exports.getTwitterResource = (
  url,
  oauth_access_token,
  oauth_access_token_secret
) => (
  new Promise((resolve, reject) => {
    oauthClient.get(
      url,
      oauth_access_token,
      oauth_access_token_secret,
      (error, data, response) => {
        if (error) {
          console.error('get resource failure', error);
          reject(error);
        } else {
          resolve({ data, response });
        }
      });
  })
);

exports.validateTwitterToken = async (access_token, access_token_secret) => (
  new Promise((resolve, reject) => {
    try {
      if (!this.initTwitter()) throw new Error('failed to initialize twitter auth');

      this.getTwitterResource(
        'https://api.twitter.com/1.1/account/verify_credentials.json',
        access_token,
        access_token_secret
      )
        .then(({ data }) => {
          const { id_str } = JSON.parse(data);
          resolve({
            id: id_str,
            valid: true
          });
        })
        .catch((error) => reject(error));
    } catch (error) {
      console.error('validateTwitterToken failure', error);
      reject(error);
    }
  })
);
