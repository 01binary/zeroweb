import React, { FC } from 'react';
import styled from 'styled-components';
import Error from '../components/Error';
import Facebook from '../images/facebook.svg';
import Google from '../images/google.svg';
import Twitter from '../images/twitter.svg';
import Alert from './Alert';

const Container = styled.section<{ inline?: boolean }>`
  ${(props) => !props.inline && `margin-bottom: ${props.theme.spacingHalf}`};
`;

const Prompt = styled.div<{ inline?: boolean }>`
  position: relative;
  display: flex;
  align-items: ${(props) => (props.inline ? 'flex-start' : 'center')};

  ${(props) => props.inline && 'flex-direction:column'};

  font-family: ${(props) =>
    props.inline ? props.theme.smallFont : props.theme.normalFont};
  font-size: ${(props) =>
    props.inline ? props.theme.smallFontSize : props.theme.normalFontSize};
  font-weight: ${(props) =>
    props.inline ? props.theme.smallFontWeight : props.theme.normalFontWeight};
  color: ${(props) => props.theme.secondaryTextColor};
`;

const Text = styled.p<{ inline?: boolean }>`
  font-family: ${(props) =>
    props.inline ? props.theme.smallFont : props.theme.normalFont};
  font-size: ${(props) =>
    props.inline ? props.theme.smallFontSize : props.theme.normalFontSize};
  font-weight: ${(props) =>
    props.inline ? props.theme.smallFontWeight : props.theme.normalFontWeight};
  color: ${(props) => props.theme.secondaryTextColor};
  ${(props) => props.inline && 'margin:0'};
`;

const ProviderList = styled.ul`
  padding: 0;
  margin: 0;
  margin-right: ${(props) => props.theme.spacingHalf};
  display: flex;
`;

const Provider = styled.li`
  display: inline;
`;

type LoginProps = {
  inline?: boolean;
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
  inline,
}) =>
  loginError ? (
    <Error>{loginError}</Error>
  ) : (
    <Container inline={inline}>
      <Alert inline={inline}>
        <Prompt inline={inline}>
          <Text inline={inline}>Please login to comment:</Text>
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
