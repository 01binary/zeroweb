/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Google authentication.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import dayjs from 'dayjs';
import loadScript from './loadScript';
import { Providers, SetUserHandler } from '../auth/types';

const handleLogin = (
  setUser: SetUserHandler,
  guser: any
) => {
  const profile = guser.getBasicProfile();
  const id = profile.getId();
  const name = profile.getName();
  const { access_token, expires_in } = guser.getAuthResponse(true);

  setUser({
    provider: Providers.Google,
    id,
    name,
    token: access_token,
    expires: dayjs().add(expires_in, 'seconds'),
  });
};

export const googleInit = (
  setUser: SetUserHandler
) => {
  loadScript('googleapi', 'https://apis.google.com/js/platform.js', () => {
    gapi.load('auth2', () => {
      gapi.auth2
        .init({
          client_id: '574591881102-kg8frj9pqe5rdgsi8eeqe2emkseb4th0.apps.googleusercontent.com'
        })
        .then(() => {
          const auth = gapi.auth2.getAuthInstance();
          const user = auth.currentUser.get();
          if (user.isSignedIn()) handleLogin(setUser, user);
        });
    });
  });
};

export const googleLogin = (
  setUser: SetUserHandler
) => {
  const auth = gapi.auth2.getAuthInstance();
  auth
    .signIn({
      scope: 'profile'
    })
    .then(guser => handleLogin(setUser, guser));
};
