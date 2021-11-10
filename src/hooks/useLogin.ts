import { useEffect, useState, useRef, useCallback } from 'react';
import { authenticate } from '../auth/cognito';
import { Providers } from '../auth/types';
import { useBlogContext } from '../hooks/useBlogContext';
import useTwitter from '../auth/useTwitter';
import useFacebook from '../auth/useFacebook';
import useGoogle from '../auth/useGoogle';

export const useLogin = () => {
  const { user, setUser, setCredentials } = useBlogContext();
  const [ loginError, setLoginError ] = useState<string>(null);
  const onceRef = useRef<boolean>(false);

  const {
    facebookInit,
    facebookLogin,
    facebookLogout
  } = useFacebook(setUser, setCredentials, setLoginError);

  const {
    googleInit,
    googleLogin,
    googleLogout,
  } = useGoogle(setUser, setCredentials, setLoginError);

  const {
    twitterInit,
    twitterLogin,
    twitterLogout,
  } = useTwitter(setUser, setCredentials, setLoginError);

  useEffect(() => {
    if (onceRef.current) return;
    onceRef.current = true;

    const initProviders = async (): Promise<boolean> => {
      const hasFacebook = await facebookInit();
      if (hasFacebook) return true;
  
      const hasGoogle = await googleInit();
      if (hasGoogle) return true;
  
      const hasTwitter = await twitterInit();
      if (hasTwitter) return true;
  
      return false;
    };

    initProviders()
      .then((hasSocialAccount) => {
        if (!hasSocialAccount) {
          authenticate(null, null, null)
            .then(guestCredentials => setCredentials(guestCredentials));
        }
      })
      .catch(error => console.error(error));
  }, [setCredentials]);

  const handleLogoutAll = useCallback(() => {
    facebookLogout();
    googleLogout();
    twitterLogout();
    return true;
  }, [facebookLogout, googleLogout, twitterLogout]);

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

  const handleLogout = () => {
    if (user) {
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
      }
    }
  };

  return {
    handleFacebookLogin,
    handleGoogleLogin,
    handleTwitterLogin,
    handleLogout,
    loginError,
  };
};
