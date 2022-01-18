import React, { FC } from 'react';
import styled from 'styled-components';
import Error from '../components/Error';
import Facebook from '../images/facebook.svg';
import Google from '../images/google.svg';
import Twitter from '../images/twitter.svg';
import Alert from './Alert';

const Container = styled.section`
  margin-bottom: ${(props) => props.theme.spacingHalf};
`;

const Prompt = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  font-family: ${(props) => props.theme.normalFont};
  font-size: ${(props) => props.theme.normalFontSize};
  font-weight: ${(props) => props.theme.normalFontWeight};
  color: ${(props) => props.theme.secondaryTextColor};
`;

const Text = styled.p`
  font-family: ${(props) => props.theme.normalFont};
  font-size: ${(props) => props.theme.normalFontSize};
  font-weight: ${(props) => props.theme.normalFontWeight};
  color: ${(props) => props.theme.secondaryTextColor};
`;

const ProviderList = styled.ul`
  padding: 0;
  margin: 0;
  margin-right: ${(props) => props.theme.spacingHalf};
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
}) =>
  loginError ? (
    <Error>{loginError}</Error>
  ) : (
    <Container>
      <Alert>
        <Prompt>
          <Text>Please login to comment:</Text>
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
        </Prompt>
      </Alert>
    </Container>
  );

export default Login;
