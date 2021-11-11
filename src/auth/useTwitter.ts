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
import {
  Providers,
  SetUserHandler,
  SetErrorHandler,
  SetCredentialsHandler
} from '../auth/types';
import { authenticate } from './cognito';
import { AUTH_URL } from '../constants';

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
  document.cookie = `${TWITTER_COOKIE}=${value};path=/;secure`;
};

const deleteTwitterCookie = () => {
  // Chrome won't delete without domain
  const domain = document.location.hostname;
  document.cookie = `${TWITTER_COOKIE}=;expires=${new Date(0).toUTCString()};path=/;secure;domain=${domain}`;
};

const useTwitter = (
  setUser: SetUserHandler,
  setCredentials: SetCredentialsHandler,
  setError: SetErrorHandler,
) => {
  const handleLogin = (
    oauth_access_token: string,
    oauth_access_token_secret: string,
  ) => {
    axios
      .post(`${AUTH_URL}/twitter/user`, {
        oauth_access_token,
        oauth_access_token_secret,
      })
      .then(({ data }) => {
        const { id_str: providerUserId, name, profile_image_url_https } = data;
        authenticate(
          Providers.Twitter,
          oauth_access_token,
          oauth_access_token_secret
        )
          .then((awsSignature) => {
            setCredentials(awsSignature);
            setUser({
              provider: Providers.Twitter,
              providerUserId,
              name,
              token: oauth_access_token,
              expires: null,
              avatarUrl: profile_image_url_https,
            });
          })
          .catch((error) => {
            console.error(error);
            setError('Could not sign in with your Twitter account, please try again later!');
          });
      })
      .catch((error) => {
        console.error(error);
        setError('Unable to retrieve your user information from Twitter');
      });
  };

  const twitterReturn = (
    setReturnUrl: (url: string) => void,
    navigate: (to: string) => void,
  ) => {
    const {
      oauth_token,
      oauth_verifier
    } = queryString.parse(window.location.search);
  
    if (!oauth_token || !oauth_verifier) {
      setError('Did not receive the information expected from Twitter!');
      return;
    }
  
    const twitterCookie = getTwitterCookie();
  
    if (!twitterCookie) {
      setError('Misplaced Twitter login information!');
      return;
    }
  
    const {
      oauth_token_secret,
      return_url,
    } = twitterCookie;
  
    setReturnUrl(return_url);
  
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
        handleLogin(access_token, access_token_secret);
  
        window.setTimeout(() => navigate(return_url), 100);
      })
      .catch((error) => {
        console.error(error);
        setError('Unable to receive your login details from Twitter!');
      });
  };

  const twitterInit = (): Promise<boolean> => (
    new Promise((resolve, reject) => {
      try {
        const twitterCookie = getTwitterCookie();
        if (!twitterCookie) {
          resolve(false);
          return;
        }
      
        const {
          oauth_token,
          access_token,
          access_token_secret,
        } = twitterCookie;
      
        if (access_token) {
          handleLogin(access_token, access_token_secret);
          resolve(true);
          return;
        } else if (oauth_token) {
          deleteTwitterCookie();
        }

        resolve(false);
      } catch (error) {
        reject(error);
      }
    })
  );

  const twitterLogin = () => {
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
      .catch((error) => {
        setError('Could not initiate Twitter login, please try again later!');
        console.error(error);
      });
  };

  const twitterLogout = () => {
    deleteTwitterCookie();
    setUser(null);
    setCredentials(null);
  };

  return {
    twitterInit,
    twitterReturn,
    twitterLogin,
    twitterLogout
  };
};

export default useTwitter;
