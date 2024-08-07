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
import { authenticate } from './cognito';
import {
  Providers,
  SetCredentialsHandler,
  SetErrorHandler,
  SetUserHandler,
} from './types';

const useGoogle = (
  setUser: SetUserHandler,
  setCredentials: SetCredentialsHandler,
  setError: SetErrorHandler
) => {
  const handleLogin = (guser: any) => {
    const profile = guser.getBasicProfile();
    const providerUserId = profile.getId();
    const name = profile.getName();
    const avatarUrl = profile.getImageUrl();
    const { access_token, expires_in } = guser.getAuthResponse(true);

    authenticate(Providers.Google, access_token)
      .then((awsSignature) => {
        console.debug({ provider: Providers.Google, name, awsSignature })
        setCredentials(awsSignature);
        setUser({
          provider: Providers.Google,
          providerUserId,
          name,
          avatarUrl,
          token: access_token,
          expires: dayjs().add(expires_in, 'seconds'),
        });
      })
      .catch((error) => {
        console.error(error);
        setError(
          'Could not sign in with your Google account, please try again later!'
        );
      });
  };

  const googleInit = (): Promise<boolean> =>
    new Promise<boolean>((resolve, reject) => {
      loadScript('googleapi', 'https://apis.google.com/js/platform.js')
        .then(() => {
          if (!gapi) {
            console.error('google api failed to load, cannot initialize');
            return;
          }

          gapi.load('auth2', () => {
            gapi.auth2
              .init({
                client_id:
                  '607582139301-klco132g4ffrvf7mbs7dutcilbqln8vc.apps.googleusercontent.com',
              })
              .then(() => {
                const guser = gapi.auth2.getAuthInstance().currentUser.get();

                if (guser.isSignedIn()) {
                  handleLogin(guser);
                  resolve(true);
                } else {
                  resolve(false);
                }
              })
              .catch((error) => reject(error));
          });
        })
        .catch((error) => reject(error));
    });

  const googleLogin = () => {
    try {
      gapi.auth2
        .getAuthInstance()
        .signIn({
          scope: 'profile',
        })
        .then((guser) => handleLogin(guser));
    } catch (e) {
      console.error('google login error', e);
    }
  };

  const googleLogout = () => {
    try {
      gapi.auth2
        .getAuthInstance()
        .signOut()
        .then(() => {
          setUser(null);
          setCredentials(null);
        });
    } catch (e) {
      console.error('google logout error', e);
    }
  };

  return {
    googleInit,
    googleLogin,
    googleLogout,
  };
};

export default useGoogle;
