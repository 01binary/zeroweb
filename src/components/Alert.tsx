import React, { FC } from 'react';
import styled from 'styled-components';
import FrameLight from '../images/url/frame-light.svg';
import FrameDark from '../images/url/frame-dark.svg';
import { MOBILE } from '../constants';

const AlertBackground = styled.section<{ inline?: boolean }>`
  display: flex;
  background-image: ${(props) =>
    !props.inline
      ? props.theme.isDark
        ? `url(${FrameDark})`
        : `url(${FrameLight})`
      : 'none'};

  margin-left: ${(props) => (props.inline ? 0 : props.theme.spacingHalf)};
  margin-right: ${(props) => (props.inline ? 0 : props.theme.spacingDouble)};

  @media (max-width: ${MOBILE}) {
    margin-right: ${(props) => props.theme.spacingQuarter};
  }
`;

const AlertForeground = styled.div<{ inline?: boolean }>`
  display: flex;
  background: ${(props) => props.theme.backgroundColor};
  margin: ${(props) => (props.inline ? 'none' : props.theme.spacingHalf)};
  ${(props) => props.fullWidth && `width: 100%`};
`;

type AlertProps = {
  inline?: boolean;
  fullWidth?: boolean;
};

const Alert: FC<AlertProps> = ({ inline, fullWidth, children }) => (
  <AlertBackground inline={inline}>
    <AlertForeground inline={inline} fullWidth={fullWidth}>
      {children}
    </AlertForeground>
  </AlertBackground>
);

export default Alert;
