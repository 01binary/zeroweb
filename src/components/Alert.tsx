import React, { FC } from 'react';
import styled from 'styled-components';
import FrameLight from '../images/url/frame-light.svg';
import FrameDark from '../images/url/frame-dark.svg';

const AlertBackground = styled.section`
  display: flex;
  background-image: ${(props) =>
    props.theme.isDark ? `url(${FrameDark})` : `url(${FrameLight})`};
`;

const AlertForeground = styled.div`
  display: flex;
  background: ${(props) => props.theme.backgroundColor};
  margin-top: ${(props) => props.theme.spacingHalf};
  margin-bottom: ${(props) => props.theme.spacingHalf};
  margin-left: ${(props) => props.theme.spacingHalf};
  margin-right: ${(props) => props.theme.spacingHalf};
`;

const Alert: FC = ({ children }) => (
  <AlertBackground>
    <AlertForeground>{children}</AlertForeground>
  </AlertBackground>
);

export default Alert;
