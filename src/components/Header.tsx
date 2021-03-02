import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import HeaderLink from './HeaderLink';
import LogoImage from '../images/Logo.svg';
import ArticlesIcon from "../images/articles.svg"
import ProjectsIcon from "../images/projects.svg"
import AboutIcon from "../images/about.svg"
import ArticlesBackground from "../images/navigation-about.svg"
import ProjectsBackground from "../images/navigation-projects.svg"
import AboutBackground from "../images/navigation-about.svg"

const Banner = styled.header`
  font-family: ${props => props.theme.titleFont};
  background: ${props => props.theme.primaryColor};
  color: ${props => props.theme.primaryTextColor};
  max-width: ${props => props.theme.desktop};
  margin: auto;
  height: 200px;
  position: relative;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, ${props => props.theme.primaryColor} 0%, ${props => props.theme.secondaryColor} 100%);
  transition: margin ${props => props.theme.animationFast} ease-out;

  @media (max-width: 2048px) {
    margin-top: 100px;
  }
  
  @media (max-width: 1024px) {
    margin-top: 50px;
  }

  &:before {
    content: '';
    position: absolute;
    left: 8px;
    bottom: .1px;
    width: 1px;
    height: 12px;
    transform: skewX(45deg);
    box-shadow: 0 0 4px ${props => props.theme.dropShadowDarkColor};
    z-index: 4;
  }

  &:after {
    content: '';
    position: absolute;
    left: 100%;
    top: -6px;
    width: 13px;
    height: 39px;
    background: ${props => props.theme.backgroundColor};
    transform: skewX(45deg);
  }

  .fill-foreground {
    fill: ${props => props.theme.backgroundColor}
  }

  .fill-background {
    fill: ${props => props.theme.primaryColor}
  }
`;

const Title = styled.h1`
  position: absolute;
  left: 103px;
  top: 55px;
  margin: 0;
  font-size: ${props => props.theme.titleFontSize};
  font-weight: ${props => props.theme.titleFontWeight};
`;

const Caret = styled.div`
  position: absolute;
  width: 11pt;
  height: 4pt;
  right: -12pt;
  bottom: -3pt;
  background: ${props => props.theme.primaryTextColor};
  animation: blink 1.1s linear infinite;

  @keyframes blink {
    0% {
      opacity: 0;
    }

    25% {
      opacity: 1;
    }

    75% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
}
`;

const Navigation = styled.nav`
  position: absolute;
  left: 0;
  bottom: 0;
  min-width: 299px;
  width: 100%;
  height: 66px;
  display:flex;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    box-shadow: 0 0 2px ${props => props.theme.dropShadowLightColor};
    z-index: -1;
  }
  
  &:after {
    content: '';
    position: absolute;
    left: -10px;
    bottom: -2px;
    width: 17px;
    height: 17px;
    background: ${props => props.theme.backgroundColor};
    transform: skewX(45deg);
  }
`;

const Logo = styled(LogoImage)`
  position: absolute;
  left: 17px;
  top: 17px;
  width: 73px;
  height: 60px;
  font-size: 48pt;
`;

interface IHeaderProps {
  path: string
}

const Header: FunctionComponent<IHeaderProps> = ({
  path
}) => (
    <Banner>
      <Logo />

      <Title>
        binary: tech art<Caret/>
      </Title>

      <Navigation>
        <HeaderLink to="/" path={path} icon={ArticlesIcon} background={ArticlesBackground}>
          articles
        </HeaderLink>
        <HeaderLink to="/projects" path={path} icon={ProjectsIcon} background={ProjectsBackground}>
          projects
        </HeaderLink>
        <HeaderLink to="/about" path={path} icon={AboutIcon} background={AboutBackground}>
          about
        </HeaderLink>
      </Navigation>
    </Banner>
);

export default Header;
