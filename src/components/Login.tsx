import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useBlogContext } from '../hooks/useBlogContext';
import { Providers } from '../auth/types';
import useTwitter from '../auth/twitter';
import useFacebook from '../auth/facebook';
import useGoogle from '../auth/google';

const Error = styled.section`
  color: ${props => props.theme.errorColor};
`;

const Login: FC = () => {
  const { user, setUser, setCredentials } = useBlogContext();
  const [ error, setError ] = useState<string>(null);
  const [ once, setOnce ] = useState<boolean>(false);

  const {
    facebookInit,
    facebookLogin,
    facebookLogout
  } = useFacebook(setUser, setCredentials, setError);

  const {
    googleInit,
    googleLogin,
    googleLogout,
  } = useGoogle(setUser, setCredentials, setError);

  const {
    twitterInit,
    twitterLogin,
    twitterLogout,
  } = useTwitter(setUser, setCredentials, setError);

  useEffect(() => {
    if (once) return;
    facebookInit();
    googleInit();
    twitterInit();
    setOnce(true);
  }, [
    facebookInit,
    googleInit,
    twitterInit,
    setOnce
  ]);

  const logoutAll = () => {
    facebookLogout();
    googleLogout();
    twitterLogout();
    return true;
  };

  const handleFacebookLogin = () => logoutAll() && facebookLogin();
  const handleGoogleLogin = () => logoutAll() && googleLogin();
  const handleTwitterLogin = () => logoutAll() && twitterLogin();
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
