const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const oauth = require('oauth');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
const TWITTER_REDIRECT_URL = process.env.TWITTER_REDIRECT_URL;
const TWITTER_COOKIE = 'twitter';

const oauthClient = new oauth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  '1.0',
  TWITTER_REDIRECT_URL,
  'HMAC-SHA1'
);

const getTwitterRequestToken = () => {
  return new Promise((resolve, reject) => {
    oauthClient.getOAuthRequestToken((error, oauth_token, oauth_token_secret, results) => {
      if (error)
        reject(error);
      else
        resolve({ oauth_token, oauth_token_secret, results });
    });
  });
};

const getTwitterAccessToken = (oauth_token, oauth_token_secret, oauth_verifier) => {
  return new Promise((resolve, reject) => {
    oauthClient.getOAuthAccessToken(
      oauth_token,
      oauth_token_secret,
      oauth_verifier,
      (error, oauth_access_token, oauth_access_token_secret, results) => {
        if (error)
          reject(error);
        else
          resolve({ oauth_access_token, oauth_access_token_secret, results });
      }
    );
  });
};

const getTwitterResource = (url, method, oauth_access_token, oauth_access_token_secret) => {
  return new Promise((resolve, reject) => {
    oauthClient.getProtectedResource(
      url,
      method,
      oauth_access_token,
      oauth_access_token_secret),
      (error, data, response) => {
        if (error)
          reject(error);
        else
          resolve({ data, response });
      }
    });
};

const app = express();

let tokens = {};

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ healthy: true });
});

router.post('/twitter/oauth/request_token', async (req, res) => {
  const { oauth_token, oauth_token_secret } = await getTwitterRequestToken();

  res.cookie(TWITTER_COOKIE, oauth_token, {
    // 15 minutes
    maxAge: 15 * 60 * 1000,
    secure: true,
    httpOnly: true,
    sameSite: true,
  });

  tokens[oauth_token] = { oauth_token_secret };
  
  res.json({ oauth_token });
});

router.post('/twitter/oauth/access_token', async (req, res) => {
  try {
    const { oauth_token: req_oauth_token, oauth_verifier } = req.body;
    const oauth_token = req.cookies[TWITTER_COOKIE];
    const oauth_token_secret = tokens[oauth_token].oauth_token_secret;

    if (oauth_token !== req_oauth_token) {
      res.status(403).json({ message: "Request tokens do not match "});
      return;
    }

    const {
      oauth_access_token,
      oauth_access_token_secret
    } = await getTwitterAccessToken(
      oauth_token,
      oauth_token_secret,
      oauth_verifier
    );

    tokens[oauth_token] = {
      ...tokens[oauth_token],
      oauth_access_token,
      oauth_access_token_secret
    };

    res.json({ success: true });
  } catch (error) {
    res.status(403).json({ message: "Missing access token "});
  }
});

router.get('/twitter/user', async (req, res) => {
  try {
    const oauth_token = req.cookies[TWITTER_COOKIE];
    const {
      oauth_access_token,
      oauth_access_token_secret
    } = tokens[oauth_token];

    const response = await getTwitterResource(
      'https://api.twitter.com/1.1/account/verify_credentials.json',
      'GET',
      oauth_access_token,
      oauth_access_token_secret
    );

    res.status(200).send(response.data);
  } catch (error) {
    res.status(403).json({
      message: "Missing, invalid, or expired tokens"
    });
  }
});

router.post('/twitter/logout', async (req, res) => {
  try {
    const oauth_token = req.cookies(TWITTER_COOKIE);
    delete tokens[oauth_token];

    res.cookie(TWITTER_COOKIE, {}, { maxAge: -1 });
    res.json({ success: true });
  } catch(error) {
    res.status(403).json({
      message: "Missing, invalid, or expired tokens"
    });
  }
});

app.use(router);

exports.handler = serverless(app);
