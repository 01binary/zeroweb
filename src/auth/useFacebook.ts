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
  SetUserHandler,
} from './types';
import { authenticate } from './cognito';

enum LoginStatus {
  Connected = 'connected',
  NotAuthorized = 'not_authorized',
  Unknown = 'unknown',
}

interface AuthResponse {
  userID: string;
  accessToken: string;
  expiresIn: number;
}

interface LoginResponse {
  status: LoginStatus;
  authResponse: AuthResponse;
}

const useFacebook = (
  setUser: SetUserHandler,
  setCredentials: SetCredentialsHandler,
  setError: SetErrorHandler
) => {
  const handleLogin = ({ status, authResponse }: LoginResponse) => {
    if (status === LoginStatus.Connected) {
      const {
        userID: providerUserId,
        accessToken: token,
        expiresIn,
      } = authResponse;

      FB.api(
        '/me?fields=name,picture',
        ({
          name,
          picture: {
            data: { url },
          },
        }) => {
          authenticate(Providers.Facebook, token)
            .then((awsSignature) => {
              console.log({ provider: Providers.Facebook, name, awsSignature })
              setCredentials(awsSignature);
              setUser({
                provider: Providers.Facebook,
                providerUserId,
                name,
                avatarUrl: url,
                token,
                expires: dayjs().add(expiresIn, 'seconds'),
              });
            })
            .catch((error) => {
              console.error(error);
              setError(
                'Could not sign in with your Facebook account, please try again later!'
              );
            });
        }
      );
    }
  };

  const facebookInit = (): Promise<boolean> =>
    new Promise((resolve, reject) => {
      loadScript('facebookapi', 'https://connect.facebook.net/en_US/sdk.js')
        .then(() => {
          FB.init({
            appId: '528437335196727',
            // Persist login in cookie
            cookie: true,
            // Parse social logins
            xfbml: true,
            version: 'v13.0',
          });

          FB.getLoginStatus((res) => {
            if (res && res.status !== 'unknown') {
              handleLogin(res);
              resolve(true);
            } else {
              resolve(false);
            }
          });
        })
        .catch((error) => reject(error));
    });

  const facebookLogin = () => {
    FB.login((res) => res && handleLogin(res), {
      scope: 'public_profile',
    });
  };

  const facebookLogout = () => {
    try {
      FB.logout(() => {
        setUser(null);
        setCredentials(null);
      });
    } catch {
      setUser(null);
      setCredentials(null);
    }
  };

  return {
    facebookInit,
    facebookLogin,
    facebookLogout,
  };
};

export default useFacebook;
