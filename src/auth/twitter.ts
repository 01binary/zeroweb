/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Twitter authentication.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import axios from 'axios';
import queryString from 'query-string';
import { Providers, SetUserHandler } from '../auth/types';

const AUTH_URL = 'https://v485ud71q9.execute-api.us-west-2.amazonaws.com/Prod';
const TWITTER_COOKIE = 'tw';

type TwitterCookie = {
  oauth_token?: string;
  oauth_token_secret?: string;
  access_token?: string;
  access_token_secret?: string;
};

const getTwitterCookie = (): TwitterCookie => (
  document
    .cookie
    .split(';', 10)
    .reduce((acc: TwitterCookie, current) => {
      const [ name, value ] = current.trim().split('=');

      if (name === TWITTER_COOKIE && value && value.length)
        return JSON.parse(decodeURIComponent(value));
      
      return acc;
    }, null)
);

const setTwitterCookie = (twitterCookie: TwitterCookie) => {
  const value = encodeURIComponent(JSON.stringify(twitterCookie));
  document.cookie = `${TWITTER_COOKIE}=${value}`;
};

const deleteTwitterCookie = () => {
  debugger;
  document.cookie = `${TWITTER_COOKIE}=;expires=${new Date(0).toUTCString()}`;
};

const setTwitterUser = (
  oauth_access_token: string,
  oauth_access_token_secret: string,
  setUser: SetUserHandler
) => {
  axios
    .post(`${AUTH_URL}/twitter/user`, {
      oauth_access_token,
      oauth_access_token_secret,
    })
    .then(({ data }) => {
      const { id_str, name, profile_image_url_https } = data;
      setUser({
        provider: Providers.Twitter,
        id: id_str,
        name,
        token: encodeURIComponent(JSON.stringify({
          oauth_access_token,
          oauth_access_token_secret
        })),
        expires: null,
        imageUrl: profile_image_url_https,
      });
    })
    .catch((error) => console.error(error));
};

const errorAndGoBack = (message: string) => {
  // TODO
};

export const twitterReturn = (
  setUser: SetUserHandler
) => {
  const {
    oauth_token,
    oauth_verifier
  } = queryString.parse(window.location.search);

  const twitterCookie = getTwitterCookie();

  if (!twitterCookie) {
    errorAndGoBack('Twitter cookie not found');
    return;
  }

  const {
    oauth_token_secret,
    oauth_token: expected_oauth_token,
    access_token: existing_access_token,
    access_token_secret: existing_access_token_secret,
  } = twitterCookie;

  if (existing_access_token) {
    setTwitterUser(existing_access_token, existing_access_token_secret, setUser);
    return;
  }

  if (!oauth_token || !oauth_verifier) {
    errorAndGoBack('Invalid Twitter cookie');
    return;
  }

  if (oauth_token !== expected_oauth_token) {
    errorAndGoBack('Twitter cookie mismatch');
    return;
  }

  axios
    .post(`${AUTH_URL}/twitter/oauth/access_token`, {
      oauth_token,
      oauth_token_secret,
      oauth_verifier,
    })
    .then(({
      data: {
        oauth_access_token: access_token,
        oauth_access_token_secret: access_token_secret,
      }
    }) => {
      setTwitterCookie({ ...twitterCookie, access_token, access_token_secret });
      setTwitterUser(access_token, access_token_secret, setUser);
    })
    .catch((error) => console.error(error));
};

export const twitterInit = (
  setUser: SetUserHandler
) => {
  const twitterCookie = getTwitterCookie();
  if (!twitterCookie) return;

  const {
    oauth_token,
    access_token,
    access_token_secret,
  } = twitterCookie;

  if (access_token) {
    setTwitterUser(access_token, access_token_secret, setUser);
  } else if (oauth_token) {
    deleteTwitterCookie();
  }
};

export const twitterLogin = (
  setUser: SetUserHandler
) => {
  axios
    .post(`${AUTH_URL}/twitter/oauth/request_token`)
    .then(({ data: { oauth_token, oauth_token_secret } }) => {
      setTimeout(() => setTwitterCookie({ oauth_token, oauth_token_secret }), 0);
      window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`;
    })
    .catch((error) => console.error(error));
};

export const twitterLogout = (
  setUser: SetUserHandler
) => {
  deleteTwitterCookie();
  /*axios
    .post(`${AUTH_URL}/twitter/logout`)
    .then(() => setUser(null))
    .catch((error) => console.error(error));*/
};
