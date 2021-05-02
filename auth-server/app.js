const serverless = require('serverless-http');
const LoginWithTwitter = require('login-with-twitter');
const express = require('express');
const app = express();

const tw = new LoginWithTwitter({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackUrl: `${process.env.LAMBDA_URL}/twitter/callback`
});

app.get('/twitter', (req, res) => {
  tw.login((err, tokenSecret, url) => {
    if (err) return;

    // Save token secret for use in /twitter/callback route
    req.session.tokenSecret = tokenSecret;

    // Redirect to /twitter/callback route with OAuth responses as query params
    res.redirect(url);
  });
});

app.get('/twitter/callback', (req, res) => {
  tw.callback({
    oauth_token: req.query.oauth_token,
    oauth_verifier: req.query.oauth_verifier
  }, req.session.tokenSecret, (err, user) => {
    if (err) return;

    // Delete tokenSecret securely
    delete req.session.tokenSecret;

    // The user object returns userId, userName, userToken, userTokenSecret
    req.session.user = user;

    // Redirect to route that can handle twitter login details
    res.redirect(process.env.TWITTER_REDIRECT_URL);
  });
});

module.exports.handler = serverless(app);
