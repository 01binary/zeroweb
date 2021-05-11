const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const oauth = require('oauth');
const bodyParser = require('body-parser');

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
const TWITTER_REDIRECT_URL = process.env.TWITTER_REDIRECT_URL;

let oauthClient;

const initialize = (res) => {
  try {
    if (!TWITTER_CONSUMER_KEY || !TWITTER_CONSUMER_SECRET || !TWITTER_REDIRECT_URL) {
      console.error('Lambda environment variables are not set');
      res.status(500).json({ message: 'Lambda environment variables not set' });
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
    console.error('lambda initialization failed', error);
    return false;
  }
};

const getTwitterRequestToken = () => (
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

const getTwitterAccessToken = (oauth_token, oauth_token_secret, oauth_verifier) => (
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

const getTwitterResource = (url, oauth_access_token, oauth_access_token_secret) => (
  new Promise((resolve, reject) => {
    oauthClient.get(
      url,
      oauth_access_token,
      oauth_access_token_secret,
      (error, data, response) => {
        if (error) {
          console.error('getProtectedResource failure', error);
          reject(error);
        } else {
          resolve({ data, response });
        }
      });
    })
);

const app = express();

app.use(cors());
app.use(bodyParser.json());

const router = express.Router();

router.post('/twitter/oauth/request_token', async (req, res) => {
  try {
    if (!initialize(res)) return;

    const { oauth_token, oauth_token_secret } = await getTwitterRequestToken();
    res.json({ oauth_token, oauth_token_secret });

  } catch (error) {
    console.error('request token endpoint failure', error);
    res.status(403).json({ error });
  }
});

router.post('/twitter/oauth/access_token', async (req, res) => {
  try {
    if (!initialize(res)) return;

    const { oauth_token, oauth_token_secret, oauth_verifier } = req.body;

    const {
      oauth_access_token,
      oauth_access_token_secret
    } = await getTwitterAccessToken(
      oauth_token,
      oauth_token_secret,
      oauth_verifier
    );

    res.json({ oauth_access_token, oauth_access_token_secret });

  } catch ({ errors }) {
    console.error('access token endpoint failure', error);
    res.status(403).json({ errors });
  }
});

router.post('/twitter/user', async (req, res) => {
  try {
    if (!initialize(res)) return;

    const { oauth_access_token, oauth_access_token_secret } = req.body;

    const response = await getTwitterResource(
      'https://api.twitter.com/1.1/account/verify_credentials.json',
      oauth_access_token,
      oauth_access_token_secret
    );

    res.status(200).send(response.data);
  } catch (error) {
    console.error('user endpoint failed to retrieve user', error);
    res.status(403).json(error);
  }
});

app.use(router);

exports.handler = serverless(app);
