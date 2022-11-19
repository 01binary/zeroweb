const oauth = require('oauth');
const axios = require('axios');

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_REDIRECT_URL = process.env.GITHUB_REDIRECT_URL;

let oauthClient;

exports.initGitHub = () => {
  try {
    if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !GITHUB_REDIRECT_URL) {
      console.error('github environment variables are not set');
      return false;
    }

    oauthClient = new oauth.OAuth2(
      GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET,
      'https://github.com/',
      'login/oauth/authorize',
      'login/oauth/access_token',
    );

    return true;

  } catch (error) {
    console.error('github initialization failed', error);
    return false;
  }
};

exports.getGitHubAccessToken = (
  oauth_token,
) => (
  new Promise((resolve, reject) => {
    oauthClient.getOAuthAccessToken(
      oauth_token,
      { redirect_uri: GITHUB_REDIRECT_URL },
      (error, access_token, refresh_token) => {
        if (error) {
          console.error('getOAuthAccessToken failure', error);
          reject(error);
        } else {
          resolve({
            oauth_access_token: access_token,
            oauth_refersh_token: refresh_token
          });
        }
      }
    );
  })
);

exports.getGitHubResource = (url, access_token) => {
  return axios({
    method: 'get',
    url,
    headers: {
      Authorization: `token ${access_token}`,
    },
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

exports.validateGitHubToken = async (access_token) => (
  new Promise((resolve, reject) => {
    try {
      if (!this.initGitHub()) throw new Error('failed to initialize github auth');

      this.getGitHubResource(
        `https://api.github.com/user`,
        access_token
      )
        .then(({ data: { id } }) => {
          resolve({
            id,
            valid: true
          });
        })
        .catch((error) => reject(error));
    } catch (error) {
      console.error('validateGitHubToken failure', error);
      reject(error);
    }
  })
);
