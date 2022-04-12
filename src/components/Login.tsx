import React, { FC, useCallback, useRef } from 'react';
import styled from 'styled-components';
import Error from '../components/Error';
import FacebookIcon from '../images/facebook.svg';
import GoogleIcon from '../images/google.svg';
import TwitterIcon from '../images/twitter.svg';
import GithubIcon from '../images/github.svg';
import Cell from '../images/cell.svg';
import {
  CELL_HEIGHT,
  CELL_PATTERN,
  CELL_ROW_WIDTH,
  CELL_STRIP_HEIGHT,
  CELL_WIDTH,
} from '../constants';
import { HideTipHandler, ShowTipForHandler } from '../hooks/useTooltip';

const PROVIDER_ICON_SIZE = 36;

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
  position: relative;
  list-style-type: none;
  margin-block-end: 0;
  overflow: hidden;
  flex-shrink: 0;

  height: ${CELL_STRIP_HEIGHT}px;
  width: ${CELL_ROW_WIDTH}px;

  padding: 0;
  margin: ${(props) => props.theme.spacingHalf};
  margin-left: 0;
`;

const ProviderBorder = styled(Cell)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const ProviderWrapper = styled.li`
  position: absolute;
  left: ${(props) => CELL_PATTERN[props.index].x}px;
  top: ${(props) => CELL_PATTERN[props.index].y - CELL_HEIGHT}px;
  width: ${CELL_WIDTH}px;
  height: ${CELL_HEIGHT}px;
  margin: 0 !important;

  opacity: 0;
  animation: slideIn ${(props) => props.theme.animationFast}
    ${(props) => 0.1 * ((props.index % 2) + 1)}s ease-out 1;
  animation-fill-mode: forwards;
  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translate(8px, 8px);
    }

    100% {
      opacity: 1;
      transform: translate(0px, 0px);
    }
  }

  svg {
    pointer-events: none;
  }
`;

const ProviderButton = styled.button`
  position: absolute;
  width: 100%;
  height: 100%;

  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;

  cursor: pointer;

  .provider__icon {
    position: absolute;
    left: ${(CELL_WIDTH - PROVIDER_ICON_SIZE) / 2}px;
    top: ${(CELL_HEIGHT - PROVIDER_ICON_SIZE) / 2}px;

    opacity: 0.85;
    transition: opacity ${(props) => props.theme.animationFast} ease-out;
  }

  &:hover {
    .provider__icon {
      opacity: 1;
    }
  }

  &:focus {
    z-index: 1;
    outline: none;
    border-radius: initial;
    box-shadow: initial;

    .stroke-border {
      stroke: ${(props) => props.theme.focusColor};
    }
  }
`;

const Provider: FC<{
  providerName: string;
  providerIndex: number;
  ProviderIcon: FC<{ className: string }>;
  onClick: () => void;
  showTipFor: ShowTipForHandler;
  hideTip: HideTipHandler;
}> = ({
  providerIndex,
  providerName,
  ProviderIcon,
  onClick,
  showTipFor,
  hideTip,
}) => {
  const targetRef = useRef<HTMLElement>(null);
  return (
    <ProviderWrapper index={providerIndex}>
      <ProviderButton
        ref={targetRef}
        onClick={onClick}
        onMouseOver={() => showTipFor(`login with ${providerName}`, targetRef)}
        onMouseOut={hideTip}
      >
        <ProviderBorder />
        <ProviderIcon className="provider__icon" />
      </ProviderButton>
    </ProviderWrapper>
  );
};

type LoginProps = {
  inline?: boolean;
  loginError: string;
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
      <Text inline={inline}>Please login to comment:</Text>
      <ProviderList>
        {PROVIDERS.map(
          ({ name: providerName, icon: ProviderIcon }, providerIndex) => (
            <Provider
              key={providerName}
              onClick={() => handleLogin(providerName)}
              {...{
                providerName,
                providerIndex,
                ProviderIcon,
                showTipFor,
                hideTip,
              }}
            />
          )
        )}
      </ProviderList>
    </Prompt>
  );
};

export default Login;
