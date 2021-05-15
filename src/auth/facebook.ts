/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Facebook authentication.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import dayjs from 'dayjs';
import loadScript from './loadScript';
import {
  Providers,
  SetCredentialsHandler,
  SetErrorHandler,
  SetUserHandler
} from '../auth/types';
import { authenticate } from './cognito';

enum LoginStatus {
  Connected = 'connected',
  NotAuthorized = 'not_authorized',
  Unknown = 'unknown'
};

interface AuthResponse {
  userID: string;
  accessToken: string;
  expiresIn: number;
};

interface LoginResponse {
  status: LoginStatus;
  authResponse: AuthResponse;
};

const handleLogin = (
  setUser: SetUserHandler,
  setCredentials: SetCredentialsHandler,
  setError: SetErrorHandler,
  {
    status,
    authResponse
  }: LoginResponse,
) => {
  if (status === LoginStatus.Connected) {
    const {
      userID: id,
      accessToken: token,
      expiresIn
    } = authResponse;

    FB.api(
      '/me?fields=name,picture',
      ({ name, picture: { data: { url }} }) => {
        authenticate(Providers.Facebook, token)
          .then((awsSignature) => {
            setCredentials(awsSignature);
            setUser({
              provider: Providers.Facebook,
              id,
              name,
              imageUrl: url,
              token,
              expires: dayjs().add(expiresIn, 'seconds'),
            });
          })
          .catch((error) => {
            console.error(error);
            setError('Could not sign in with your Facebook account, please try again later!');
          });
      });
  }
};

export const facebookInit = (
  setUser: SetUserHandler,
  setCredentials: SetCredentialsHandler,
  setError: SetErrorHandler,
) => {
  loadScript('facebookapi', 'https://connect.facebook.net/en_US/sdk.js', () => {
    FB.init({
      appId: '528437335196727',
      // Persist login in cookie
      cookie: true,
      // Parse social logins
      xfbml: true,
      version: 'v10.0'
    });

    FB.getLoginStatus(res => res && handleLogin(setUser, setCredentials, setError, res));
  });
};

export const facebookLogin = (
  setUser: SetUserHandler,
  setCredentials: SetCredentialsHandler,
  setError: SetErrorHandler,
) => FB.login(
  res => res && handleLogin(setUser, setCredentials, setError, res),
  {
    scope: 'public_profile'
  }
);

export const facebookLogout = (
  setUser: SetUserHandler,
  setCredentials: SetCredentialsHandler,
) => FB.logout(() => {
  setUser(null);
  setCredentials(null);
});
