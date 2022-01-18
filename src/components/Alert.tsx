import React, { FC } from 'react';
import styled from 'styled-components';
import FrameLight from '../images/url/frame-light.svg';
import FrameDark from '../images/url/frame-dark.svg';

const AlertBackground = styled.section`
  display: flex;
  background-image: ${(props) =>
    props.theme.isDark ? `url(${FrameDark})` : `url(${FrameLight})`};

  margin-left: ${(props) => props.theme.spacingHalf};
  margin-right: ${(props) => props.theme.spacingDouble};

  @media (max-width: ${(props) => props.theme.mobile}) {
    margin-right: ${(props) => props.theme.spacingQuarter};
  }
`;

const AlertForeground = styled.div`
  display: flex;
  background: ${(props) => props.theme.backgroundColor};
  margin: ${(props) => props.theme.spacingHalf};
  ${(props) => props.fullWidth && `width: 100%`};
`;

type AlertProps = {
  fullWidth?: boolean;
};

const Alert: FC<AlertProps> = ({ fullWidth, children }) => (
  <AlertBackground>
    <AlertForeground fullWidth={fullWidth}>{children}</AlertForeground>
  </AlertBackground>
);

export default Alert;
