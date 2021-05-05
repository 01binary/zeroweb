import React, { FC, useEffect } from 'react';
import { useBlogContext } from '../hooks/useBlogContext';
import { Providers } from '../auth/types';
import { twitterInit, twitterLogin, twitterLogout } from '../auth/twitter';
import { facebookInit, facebookLogin, facebookLogout } from '../auth/facebook';
import { googleInit, googleLogin, googleLogout } from '../auth/google';

const Login: FC = () => {
  const { user, setUser } = useBlogContext();

  useEffect(() => {
    facebookInit(setUser);
    googleInit(setUser);
    twitterInit(setUser);
  }, [
    facebookInit,
    googleInit,
    twitterInit,
    setUser,
  ]);

  const handleFacebookLogin = () => facebookLogin(setUser);
  const handleGoogleLogin = () => googleLogin(setUser);
  const handleTwitterLogin = () => twitterLogin(setUser);
  const handleLogout = () => {
    if (user) {
      switch (user.provider) {
        case Providers.Facebook:
          facebookLogout(setUser);
          break;
        case Providers.Google:
          googleLogout(setUser);
          break;
        case Providers.Twitter:
          twitterLogout(setUser);
          break;
      }
    }
  };

  return user
    ? (
      <div>
        Logged in with {user.provider}
        <button onClick={handleLogout}>Logout</button>
      </div>
    )
    : (
      <section>
        Login to comment:
        <ul>
          <li><button onClick={handleFacebookLogin}>Facebook</button></li>
          <li><button onClick={handleGoogleLogin}>Google</button></li>
          <li><button onClick={handleTwitterLogin}>Twitter</button></li>
        </ul>
      </section>
    );
};

export default Login;
