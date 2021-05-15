import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useBlogContext } from '../hooks/useBlogContext';
import { Providers } from '../auth/types';
import { twitterInit, twitterLogin, twitterLogout } from '../auth/twitter';
import { facebookInit, facebookLogin, facebookLogout } from '../auth/facebook';
import { googleInit, googleLogin, googleLogout } from '../auth/google';

const Error = styled.section`
  color: ${props => props.theme.errorColor};
`;

const Login: FC = () => {
  const { user, setUser, setCredentials } = useBlogContext();
  const [ error, setError ] = useState<string>(null);
  const [ once, setOnce ] = useState<boolean>(false);

  useEffect(() => {
    if (once) return;
    facebookInit(setUser, setCredentials, setError);
    googleInit(setUser, setCredentials, setError);
    twitterInit(setUser, setCredentials, setError);
    setOnce(true);
  }, [
    facebookInit,
    googleInit,
    twitterInit,
    setUser,
    setCredentials,
    setError,
    setOnce
  ]);

  const logoutAll = () => {
    facebookLogout(setUser, setCredentials);
    googleLogout(setUser, setCredentials);
    twitterLogout(setUser, setCredentials);
    return true;
  };

  const handleFacebookLogin = () => logoutAll() && facebookLogin(setUser, setCredentials, setError);
  const handleGoogleLogin = () => logoutAll() && googleLogin(setUser, setCredentials, setError);
  const handleTwitterLogin = () => logoutAll() && twitterLogin(setError);
  const handleLogout = () => {
    if (user) {
      switch (user.provider) {
        case Providers.Facebook:
          facebookLogout(setUser, setCredentials);
          break;
        case Providers.Google:
          googleLogout(setUser, setCredentials);
          break;
        case Providers.Twitter:
          twitterLogout(setUser, setCredentials);
          break;
      }
    }
  };

  return user
    ? (
      <section>
        Logged in with {user.provider}
        <button onClick={handleLogout}>Logout</button>
      </section>
    )
    : error
    ? <Error>{error}</Error>
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
