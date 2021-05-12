const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const bodyParser = require('body-parser');
const {
  initTwitter,
  getTwitterRequestToken,
  getTwitterAccessToken,
  getTwitterResource
} = require('./twitter');

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

router.post('/twitter/oauth/request_token', async (req, res) => {
  try {
    if (!initTwitter(res)) return;

    const { oauth_token, oauth_token_secret } = await getTwitterRequestToken();
    res.json({ oauth_token, oauth_token_secret });

  } catch (error) {
    console.error('request token endpoint failure', error);
    res.status(403).json({ error });
  }
});

router.post('/twitter/oauth/access_token', async (req, res) => {
  try {
    if (!initTwitter(res)) return;

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
    if (!initTwitter(res)) return;

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
