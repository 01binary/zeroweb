import React, { FC, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useBlogContext } from '../hooks/useBlogContext';
import { authenticate } from '../auth/cognito';
import { Providers } from '../auth/types';
import Error from '../components/Error';
import Avatar from '../components/Avatar';
import MetaLink from '../components/MetaLink';
import useTwitter from '../auth/useTwitter';
import useFacebook from '../auth/useFacebook';
import useGoogle from '../auth/useGoogle';
import Facebook from '../images/facebook.svg';
import Google from '../images/google.svg';
import Twitter from '../images/twitter.svg';

const Container = styled.section`
  position: relative;
  display: flex;
  align-items: center;
  font-family: ${props => props.theme.normalFont};
  font-size: ${props => props.theme.normalFontSize};
  font-weight: ${props => props.theme.normalFontWeight};
  color: ${props => props.theme.secondaryTextColor};
  line-height: 1.7em;
  margin-top: -1em;
`;

const ProviderList = styled.ul`
  padding: 0;
`;

const Provider = styled.li`
  display: inline;
`;

const Login: FC = () => {
  const { user, setUser, setCredentials } = useBlogContext();
  const [ error, setError ] = useState<string>(null);
  const onceRef = useRef<boolean>(false);

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
    if (onceRef.current) return;
    onceRef.current = true;

    initProviders()
      .then((hasSocialAccount) => {
        if (!hasSocialAccount) {
          authenticate(null, null, null)
            .then(guestCredentials => setCredentials(guestCredentials));
        }
      })
      .catch(error => console.error(error));
  }, [ initProviders ]);

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
    ? null
    : error
    ? <Error>{error}</Error>
    : (
      <Container>
        <p>Please login to comment:</p>
        <ProviderList>
          <Provider>
            <button onClick={handleFacebookLogin}>
              <Facebook />
              Facebook
            </button>
          </Provider>
          <Provider>
            <button onClick={handleGoogleLogin}>
              <Google />
              Google
            </button>
          </Provider>
          <Provider>
            <button onClick={handleTwitterLogin}>
              <Twitter />
              Twitter
            </button>
          </Provider>
        </ProviderList>
      </Container>
    );
};

export default Login;
