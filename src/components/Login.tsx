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
  const { user, setUser } = useBlogContext();
  const [ error, setError ] = useState<string>(null);

  useEffect(() => {
    facebookInit(setUser);
    googleInit(setUser);
    twitterInit(setUser, setError);
  }, [
    facebookInit,
    googleInit,
    twitterInit,
    setUser,
    setError,
  ]);

  const handleFacebookLogin = () => facebookLogin(setUser);
  const handleGoogleLogin = () => googleLogin(setUser);
  const handleTwitterLogin = () => twitterLogin();
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
