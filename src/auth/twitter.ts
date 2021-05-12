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
import { Providers, SetUserHandler, SetErrorHandler } from '../auth/types';

const AUTH_URL = 'https://v485ud71q9.execute-api.us-west-2.amazonaws.com/Prod';
const TWITTER_COOKIE = 'tw';

type TwitterCookie = {
  oauth_token?: string;
  oauth_token_secret?: string;
  access_token?: string;
  access_token_secret?: string;
  return_url?: string;
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
  document.cookie = `${TWITTER_COOKIE}=${value};path=/`;
};

const deleteTwitterCookie = () => {
  document.cookie = `${TWITTER_COOKIE}=;expires=${new Date(0).toUTCString()}`;
};

const setTwitterUser = (
  oauth_access_token: string,
  oauth_access_token_secret: string,
  setUser: SetUserHandler,
  setError: SetErrorHandler,
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
    .catch((error) => {
      console.error(error);
      setError('Unable to retrieve your user information from Twitter');
    });
};

export const twitterReturn = (
  setUser: SetUserHandler,
  setError: SetErrorHandler,
  setReturnUrl: (url: string) => void,
  navigate: (to: string) => void,
) => {
  const {
    oauth_token,
    oauth_verifier
  } = queryString.parse(window.location.search);

  if (!oauth_token || !oauth_verifier) {
    setError('Received invalid information from Twitter');
    return;
  }

  const twitterCookie = getTwitterCookie();

  if (!twitterCookie) {
    setError('Could not find Twitter login information');
    return;
  }

  const {
    oauth_token_secret,
    oauth_token: expected_oauth_token,
    return_url,
  } = twitterCookie;

  setReturnUrl(return_url);

  if (oauth_token !== expected_oauth_token) {
    setError('Received unexpected information from Twitter');
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
      setTwitterCookie({ return_url, access_token, access_token_secret });
      setTwitterUser(access_token, access_token_secret, setUser, setError);

      window.setTimeout(() => {
        console.log('success, navigating to return url');
        navigate(return_url);
      }, 100);
    })
    .catch((error) => {
      console.error(error);
      setError('Unable to receive your login details from Twitter');
    });
};

export const twitterInit = (
  setUser: SetUserHandler,
  setError: SetErrorHandler,
) => {
  const twitterCookie = getTwitterCookie();
  if (!twitterCookie) return;

  const {
    oauth_token,
    access_token,
    access_token_secret,
  } = twitterCookie;

  if (access_token) {
    setTwitterUser(access_token, access_token_secret, setUser, setError);
  } else if (oauth_token) {
    deleteTwitterCookie();
  }
};

export const twitterLogin = () => {
  axios
    .post(`${AUTH_URL}/twitter/oauth/request_token`)
    .then(({ data: { oauth_token, oauth_token_secret } }) => {
      setTwitterCookie({
        oauth_token,
        oauth_token_secret,
        return_url: window.location.pathname + window.location.search
      });
      setTimeout(() => {
        window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`;
      }, 100);
    })
    .catch((error) => console.error(error));
};

export const twitterLogout = (
  setUser: SetUserHandler
) => {
  deleteTwitterCookie();
  setUser(null);
};
