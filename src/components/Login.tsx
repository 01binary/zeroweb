import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useBlogContext } from '../hooks/useBlogContext';
import { authenticate } from '../auth/cognito';
import { Providers } from '../auth/types';
import Error from '../components/Error';
import Avatar from '../components/Avatar';
import useTwitter from '../auth/useTwitter';
import useFacebook from '../auth/useFacebook';
import useGoogle from '../auth/useGoogle';
import Facebook from '../images/facebook.svg';
import Google from '../images/google.svg';
import Twitter from '../images/twitter.svg';

const UserName = styled.span`
  margin: 0 ${props => props.theme.spacingQuarter};
`;

const Container = styled.section`
  position: relative;
  display: flex;
  align-items: center;
`;

const ProviderList = styled.ul`
  padding: 0;
`;

const Provider = styled.li`
  display: inline
`;

const CommentAvatar = styled.div`
  position: absolute;
  left: calc(-24px - 1em);
  top: -.5em;
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
  }, [ initProviders, setOnce ]);

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
      <Container>
        <CommentAvatar>
          <Avatar avatarUrl={user.avatarUrl} />
        </CommentAvatar>
        <UserName>{user.name}</UserName>
        <button onClick={handleLogout}>Logout</button>
      </Container>
    )
    : error
    ? <Error>{error}</Error>
    : (
      <Container>
        <p>Please login to comment</p>
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
