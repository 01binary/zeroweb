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
import { Providers, SetUserHandler } from '../auth/types';

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
      '/me?fields=first_name,last_name',
      ({ first_name, last_name }) => {
        setUser({
          provider: Providers.Facebook,
          id,
          name: `${first_name} ${last_name}`,
          token,
          expires: dayjs().add(expiresIn, 'seconds'),
        });
      });
  }
};

export const facebookInit = (
  setUser: SetUserHandler
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

    FB.getLoginStatus(res => res && handleLogin(setUser, res));
  });
};

export const facebookLogin = (
  setUser: SetUserHandler
) => FB.login(
  res => res && handleLogin(setUser, res),
  {
    scope: 'public_profile'
  }
);
