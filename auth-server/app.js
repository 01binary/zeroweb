const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { validateProvider, validateToken } = require('./providers');
const { initCognito, authenticateCognito } = require('./providers/cognito');
const {
  initTwitter,
  getTwitterRequestToken,
  getTwitterAccessToken,
  getTwitterResource,
} = require('./providers/twitter');

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

router.post('/token', async (req, res) => {
  try {
    if (!initCognito()) throw new Error('failed to initialize cognito auth');

    const { provider, access_token, access_token_secret } = req.body;

    if (!validateProvider(provider)) throw new Error('invalid provider');

    const { id, valid } = await validateToken(
      provider,
      access_token,
      access_token_secret
    );

    if (!valid) throw new Error(`invalid ${provider} token`);
    if (!id) throw new Error('invalid provider id');

    const authRes = await authenticateCognito(provider, id);
    res.status(200).json(authRes);

  } catch (error) {
    console.error('login endpoint failure', error);
    res.status(403).json({ message: error.message });
  }
});

router.post('/twitter/oauth/request_token', async (req, res) => {
  try {
    if (!initTwitter()) throw new Error('failed to initialize twitter auth');

    const { oauth_token, oauth_token_secret } = await getTwitterRequestToken();
    res.json({ oauth_token, oauth_token_secret });

  } catch (error) {
    console.error('request token endpoint failure', error);
    res.status(403).json({ message: error.message });
  }
});

router.post('/twitter/oauth/access_token', async (req, res) => {
  try {
    if (!initTwitter()) throw new Error('failed to initialize twitter auth');

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
    if (!initTwitter()) throw new Error('failed to initialize twitter auth');

    const { oauth_access_token, oauth_access_token_secret } = req.body;

    const { data } = await getTwitterResource(
      'https://api.twitter.com/1.1/account/verify_credentials.json',
      oauth_access_token,
      oauth_access_token_secret
    );

    res.status(200).send(data);
  } catch (error) {
    console.error('user endpoint failed to retrieve user', error);
    res.status(403).json({ message: error.message });
  }
});

app.use(router);

exports.handler = serverless(app);
