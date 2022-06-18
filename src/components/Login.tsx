import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import Error from '../components/Error';
import { HexList, HexButton } from '../components/HexList';
import FacebookIcon from '../images/facebook.svg';
import GoogleIcon from '../images/google.svg';
import TwitterIcon from '../images/twitter.svg';
import GithubIcon from '../images/github.svg';
import { HideTipHandler, ShowTipForHandler } from '../hooks/useTooltip';
import { MOBILE_NARROW } from '../constants';

const PROVIDERS = [
  {
    name: 'facebook',
    icon: FacebookIcon,
  },
  {
    name: 'google',
    icon: GoogleIcon,
  },
  {
    name: 'twitter',
    icon: TwitterIcon,
  },
  {
    name: 'github',
    icon: GithubIcon,
  },
];

const Prompt = styled.section<{ inline?: boolean }>`
  position: relative;
  display: flex;
  align-items: ${(props) => (props.inline ? 'flex-start' : 'center')};

  ${(props) => !props.inline && `margin-bottom: ${props.theme.spacingHalf}`};
  ${(props) => props.inline && `flex-direction: column`};

  font-family: ${(props) =>
    props.inline ? props.theme.smallFont : props.theme.normalFont};
  font-size: ${(props) =>
    props.inline ? props.theme.smallFontSize : props.theme.normalFontSize};
  font-weight: ${(props) =>
    props.inline ? props.theme.smallFontWeight : props.theme.normalFontWeight};
  color: ${(props) => props.theme.secondaryTextColor};

  margin-right: ${(props) => props.theme.spacingHalf};
`;

const Text = styled.p<{ inline?: boolean }>`
  font-family: ${(props) =>
    props.inline ? props.theme.smallFont : props.theme.normalFont};
  font-size: ${(props) =>
    props.inline ? props.theme.smallFontSize : props.theme.normalFontSize};
  font-weight: ${(props) =>
    props.inline ? props.theme.smallFontWeight : props.theme.normalFontWeight};

  color: ${(props) => props.theme.secondaryTextColor};
  ${(props) => props.inline && `margin: 0`};

  @media (max-width: ${MOBILE_NARROW}) {
    flex: 1;
  }
`;

type LoginProps = {
  inline?: boolean;
  loginError: string;
  action?: string;
  showTipFor: ShowTipForHandler;
  hideTip: HideTipHandler;
  handleFacebookLogin: () => void;
  handleGoogleLogin: () => void;
  handleTwitterLogin: () => void;
  handleGithubLogin: () => void;
};

const Login: FC<LoginProps> = ({
  handleFacebookLogin,
  handleGoogleLogin,
  handleTwitterLogin,
  handleGithubLogin,
  showTipFor,
  hideTip,
  loginError,
  inline,
  action,
}) => {
  const handleLogin = useCallback(
    (providerName: string) => {
      switch (providerName) {
        case 'facebook':
          handleFacebookLogin();
          break;
        case 'google':
          handleGoogleLogin();
          break;
        case 'twitter':
          handleTwitterLogin();
          break;
        case 'github':
          handleGithubLogin();
          break;
      }
    },
    [
      handleFacebookLogin,
      handleGoogleLogin,
      handleTwitterLogin,
      handleGithubLogin,
    ]
  );

  return loginError ? (
    <Error>{loginError}</Error>
  ) : (
    <Prompt inline={inline}>
      <Text inline={inline}>Please login to {action ?? 'comment'}:</Text>
      <HexList>
        {PROVIDERS.map(({ name, icon }, index) => (
          <HexButton
            key={name}
            index={index}
            icon={icon}
            tooltip={name}
            showTipFor={showTipFor}
            hideTip={hideTip}
            onClick={() => {
              hideTip();
              handleLogin(name);
            }}
          />
        ))}
      </HexList>
    </Prompt>
  );
};

export default Login;
