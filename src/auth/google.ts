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
import { Providers,
  SetCredentialsHandler,
  SetErrorHandler,
  SetUserHandler
} from '../auth/types';

const useGoogle = (
  setUser: SetUserHandler,
  setCredentials: SetCredentialsHandler,
  setError: SetErrorHandler,
) => {
  const handleLogin = (guser: any) => {
    const profile = guser.getBasicProfile();
    const id = profile.getId();
    const name = profile.getName();
    const imageUrl = profile.getImageUrl();
    const { access_token, expires_in } = guser.getAuthResponse(true);
  
    authenticate(Providers.Google, access_token)
      .then((awsSignature) => {
        setCredentials(awsSignature);
        setUser({
          provider: Providers.Google,
          id,
          name,
          imageUrl,
          token: access_token,
          expires: dayjs().add(expires_in, 'seconds'),
        });
      })
      .catch((error) => {
        console.error(error);
        setError('Could not sign in with your Google account, please try again later!');
      });
  };

  const googleInit = () => {
    loadScript(
      'googleapi',
      'https://apis.google.com/js/platform.js',
      () => {
        gapi.load('auth2', () => {
          gapi
            .auth2
            .init({
              client_id: '574591881102-kg8frj9pqe5rdgsi8eeqe2emkseb4th0.apps.googleusercontent.com'
            })
            .then(() => {
              const user = gapi
                .auth2
                .getAuthInstance()
                .currentUser
                .get();
    
              if (user.isSignedIn()) handleLogin(user);
            });
        });
    });
  };

  const googleLogin = () => {
    gapi
      .auth2
      .getAuthInstance()
      .signIn({
        scope: 'profile'
      })
      .then(guser => handleLogin(guser));
  };

  const googleLogout = () => {
    gapi
      .auth2
      .getAuthInstance()
      .signOut()
      .then(() => {
        setUser(null);
        setCredentials(null);
      });
  };

  return {
    googleInit,
    googleLogin,
    googleLogout
  };
};

export default useGoogle;
