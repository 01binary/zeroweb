import React, { FC } from 'react';
import styled from 'styled-components';
import Error from '../components/Error';
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

type LoginProps = {
  loginError: string;
  handleFacebookLogin: () => void;
  handleGoogleLogin: () => void;
  handleTwitterLogin: () => void;
};

const Login: FC<LoginProps> = ({
  handleFacebookLogin,
  handleGoogleLogin,
  handleTwitterLogin,
  loginError,
}) => (
  loginError
    ? <Error>{loginError}</Error>
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
    )
);

export default Login;
