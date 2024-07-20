/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  GitHub authentication.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import axios from 'axios';
import queryString from 'query-string';
import {
  Providers,
  SetUserHandler,
  SetErrorHandler,
  SetCredentialsHandler,
} from './types';
import { authenticate } from './cognito';
import { AUTH_URL } from '../constants';

const GITHUB_CLIENT_ID = 'cab115b1924e0c6f67c0';
const GITHUB_REDIRECT_URL = 'https://www.01binary.us/github';
const GITHUB_COOKIE = 'gh';

type GitHubCookie = {
  return_url: string;
  access_token?: string;
  refresh_token?: string;
};

const getGitHubCookie = (): GitHubCookie =>
  document.cookie.split(';', 10).reduce((acc: GitHubCookie, current) => {
    const [name, value] = current.trim().split('=');

    if (name === GITHUB_COOKIE && value && value.length)
      return JSON.parse(decodeURIComponent(value));

    return acc;
  }, null);

const setGitHubCookie = (gitHubCookie: GitHubCookie) => {
  const value = encodeURIComponent(JSON.stringify(gitHubCookie));
  document.cookie = `${GITHUB_COOKIE}=${value};path=/;secure`;
};

const deleteGitHubCookie = () => {
  // Chrome won't delete without domain
  const domain = document.location.hostname;
  document.cookie = `${GITHUB_COOKIE}=;expires=${new Date(
    0
  ).toUTCString()};path=/;secure;domain=${domain}`;
};

const useGitHub = (
  setUser: SetUserHandler,
  setCredentials: SetCredentialsHandler,
  setError: SetErrorHandler
) => {
  const handleLogin = (
    oauth_access_token: string,
    oauth_refresh_token: string
  ) => {
    axios
      .post(`${AUTH_URL}/github/user`, {
        oauth_access_token,
        oauth_refresh_token,
      })
      .then(({ data }) => {
        const { id: providerUserId, login: name, avatar_url: avatarUrl } = data;
        authenticate(Providers.GitHub, oauth_access_token)
          .then((awsSignature) => {
            console.debug({ provider: Providers.GitHub, name, awsSignature })
            setCredentials(awsSignature);
            setUser({
              provider: Providers.GitHub,
              providerUserId,
              name,
              token: oauth_access_token,
              refreshToken: oauth_refresh_token,
              expires: null,
              avatarUrl,
            });
          })
          .catch((error) => {
            console.error(error);
            setError(
              'Could not sign in with your GitHub account, please try again later!'
            );
          });
      })
      .catch((error) => {
        console.error(error);
        setError('Unable to retrieve your user information from GitHub');
      });
  };

  const gitHubReturn = (
    setReturnUrl: (url: string) => void,
    navigate: (to: string) => void
  ) => {
    const { code: oauth_token } = queryString.parse(window.location.search);

    if (!oauth_token) {
      setError('Did not receive the information expected from GitHub!');
      return;
    }

    const gitHubCookie = getGitHubCookie();

    if (!gitHubCookie) {
      setError('Misplaced GitHub login information!');
      return;
    }

    const { return_url } = gitHubCookie;
    setReturnUrl(return_url);

    axios
      .post(`${AUTH_URL}/github/oauth/access_token`, {
        oauth_token,
      })
      .then(
        ({
          data: {
            oauth_access_token: access_token,
            oauth_refresh_token: refresh_token,
          },
        }) => {
          setGitHubCookie({ return_url, access_token, refresh_token });
          handleLogin(access_token, refresh_token);

          window.setTimeout(() => navigate(return_url), 100);
        }
      )
      .catch((error) => {
        console.error(error);
        setError('Unable to receive your login details from GitHub!');
      });
  };

  const gitHubInit = (): Promise<boolean> =>
    new Promise((resolve, reject) => {
      try {
        const gitHubCookie = getGitHubCookie();
        if (!gitHubCookie) {
          resolve(false);
          return;
        }

        const { access_token, refresh_token } = gitHubCookie;

        if (access_token) {
          handleLogin(access_token, refresh_token);
          resolve(true);
          return;
        } else {
          deleteGitHubCookie();
        }

        resolve(false);
      } catch (error) {
        reject(error);
      }
    });

  const gitHubLogin = () => {
    setGitHubCookie({
      return_url: window.location.href,
    });
    setTimeout(() => {
      window.location.href = `https://github.com/login/oauth/authorize?scope=user&client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URL}`;
    }, 100);
  };

  const gitHubLogout = () => {
    deleteGitHubCookie();
    setUser(null);
    setCredentials(null);
  };

  return {
    gitHubInit,
    gitHubReturn,
    gitHubLogin,
    gitHubLogout,
  };
};

export default useGitHub;
