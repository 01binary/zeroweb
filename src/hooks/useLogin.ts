import { useEffect, useState, useCallback } from 'react';
import { authenticate } from '../auth/cognito';
import {
  Providers,
  SetCredentialsHandler,
  SetUserHandler,
  User,
} from '../auth/types';
import useTwitter from '../auth/useTwitter';
import useFacebook from '../auth/useFacebook';
import useGoogle from '../auth/useGoogle';
import useGitHub from '../auth/useGithub';

export const useLogin = (
  user: User,
  setUser: SetUserHandler,
  setCredentials: SetCredentialsHandler
) => {
  const [loginError, setLoginError] = useState<string>(null);

  const { facebookInit, facebookLogin, facebookLogout } = useFacebook(
    setUser,
    setCredentials,
    setLoginError
  );

  const { googleInit, googleLogin, googleLogout } = useGoogle(
    setUser,
    setCredentials,
    setLoginError
  );

  const { twitterInit, twitterLogin, twitterLogout } = useTwitter(
    setUser,
    setCredentials,
    setLoginError
  );

  const { gitHubInit, gitHubLogin, gitHubLogout } = useGitHub(
    setUser,
    setCredentials,
    setLoginError
  );

  useEffect(() => {
    const initProviders = async (): Promise<boolean> => {
      try {
        const hasFacebook = await facebookInit();
        if (hasFacebook) return true;
      } catch (e) {
        console.error('Facebook auth failed to initialize', e);
      }

      try {
        const hasGoogle = await googleInit();
        if (hasGoogle) return true;
      } catch (e) {
        console.error('Google auth failed to initialize', e);
      }

      try {
        const hasTwitter = await twitterInit();
        if (hasTwitter) return true;
      } catch (e) {
        console.error('Twitter auth failed to initialize');
      }

      try {
        const hasGithub = await gitHubInit();
        if (hasGithub) return true;
      } catch (e) {
        console.error('Github auth failed to initialize');
      }

      return false;
    };

    initProviders()
      .then((hasSocialAccount) => {
        if (!hasSocialAccount) {
          authenticate(null, null, null).then((guestCredentials) =>
            setCredentials(guestCredentials)
          );
        }
      })
      .catch((error) => console.error(error));
  }, [setCredentials, authenticate]);

  const handleLogoutAll = useCallback(() => {
    facebookLogout();
    googleLogout();
    twitterLogout();
    gitHubLogout();
    return true;
  }, [facebookLogout, googleLogout, twitterLogout, gitHubLogout]);

  const handleFacebookLogin = useCallback(
    () => handleLogoutAll() && facebookLogin(),
    [handleLogoutAll, facebookLogin]
  );

  const handleGoogleLogin = useCallback(
    () => handleLogoutAll() && googleLogin(),
    [handleLogoutAll, googleLogin]
  );

  const handleTwitterLogin = useCallback(
    () => handleLogoutAll() && twitterLogin(),
    [handleLogoutAll, twitterLogin]
  );

  const handleGithubLogin = useCallback(
    () => handleLogoutAll() && gitHubLogin(),
    [handleLogoutAll, gitHubLogin]
  );

  const handleLogout = () => {
    if (user) {
      try {
        switch (user.provider) {
          case Providers.Facebook:
            facebookLogout();
            break;
          case Providers.Google:
            googleLogout();
            break;
          case Providers.Twitter:
            twitterLogout();
            break;
          case Providers.GitHub:
            gitHubLogout();
            break;
        }
      } catch (e) {
        console.error('logout failed', e);
      }
    }
  };

  return {
    handleFacebookLogin,
    handleGoogleLogin,
    handleTwitterLogin,
    handleGithubLogin,
    handleLogout,
    loginError,
  };
};
