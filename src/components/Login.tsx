import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useBlogContext } from '../hooks/useBlogContext';
import { authenticate } from '../auth/cognito';
import { Providers } from '../auth/types';
import useTwitter from '../auth/useTwitter';
import useFacebook from '../auth/useFacebook';
import useGoogle from '../auth/useGoogle';

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

  const initProviders = async (): Promise<boolean> => {
    const hasFacebook = await facebookInit();
    if (hasFacebook) return true;

    const hasGoogle = await googleInit();
    if (hasGoogle) return true;

    const hasTwitter = await twitterInit();
    if (hasTwitter) return true;

    return false;
  };

  useEffect(() => {
    if (once) return;
    setOnce(true);

    initProviders()
      .then((hasSocialAccount) => {
        if (!hasSocialAccount) {
          authenticate(null, null, null)
            .then(guestCredentials => setCredentials(guestCredentials));
        }
      })
      .catch(error => console.error(error));
  }, [
    initProviders,
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
        <p>Login to comment:</p>
        <ul>
          <li><button onClick={handleFacebookLogin}>Facebook</button></li>
          <li><button onClick={handleGoogleLogin}>Google</button></li>
          <li><button onClick={handleTwitterLogin}>Twitter</button></li>
        </ul>
      </section>
    );
};

export default Login;
