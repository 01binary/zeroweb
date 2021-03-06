import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import HeaderLink from './HeaderLink';
import LogoImage from '../images/Logo.svg';
import ArticlesIcon from "../images/articles.svg"
import ProjectsIcon from "../images/projects.svg"
import AboutIcon from "../images/about.svg"
import ArticlesBackground from "../images/navigation-articles.svg"
import ProjectsBackground from "../images/navigation-projects.svg"
import AboutBackground from "../images/navigation-about.svg"

const Hero = styled.header`
  font-family: ${props => props.theme.titleFont};
  background: ${props => props.theme.primaryColor};
  color: ${props => props.theme.primaryTextColor};
  max-width: ${props => props.theme.desktop};
  margin: auto;
  height: 250px;
  position: relative;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, ${props => props.theme.primaryColor} 0%, ${props => props.theme.secondaryColor} 100%);
  transition: margin ${props => props.theme.animationFast} ease-out;
  margin-top: 0;

  @media (min-width: ${props => props.theme.desktop}) {
    margin-top: ${props => props.theme.spacingTriple};
  }

  &:before {
    content: '';
    position: absolute;
    left: 10px;
    bottom: .1px;
    width: 1px;
    height: 15px;
    transform: skewX(45deg);
    box-shadow: 0 0 5px ${props => props.theme.dropShadowDarkColor};
    z-index: 4;
  }

  &:after {
    content: '';
    position: absolute;
    left: 100%;
    top: -7.5px;
    width: 16px;
    height: 49px;
    background: ${props => props.theme.backgroundColor};
    transform: skewX(45deg);
  }

  .fill-foreground {
    fill: ${props => props.theme.backgroundColor}
  }

  .fill-background {
    fill: ${props => props.theme.primaryColor}
  }

  .stroke-foreground {
    stroke: ${props => props.theme.accentTextColor}
  }
`;

const Title = styled.h1`
  position: absolute;
  left: 128px;
  top: 68px;
  margin: 0;
  font-size: ${props => props.theme.titleFontSize};
  font-weight: ${props => props.theme.titleFontWeight};
`;

const Caret = styled.div`
  position: absolute;
  width: 13.75pt;
  height: 5pt;
  right: -15pt;
  bottom: -3.75pt;
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
  bottom: 1px;
  min-width: 373px;
  width: 100%;
  height: 82px;
  display:flex;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    box-shadow: 0 0 3px ${props => props.theme.dropShadowLightColor};
    z-index: -1;
  }
  
  &:after {
    content: '';
    position: absolute;
    left: -13px;
    bottom: -3px;
    width: 23px;
    height: 22px;
    background: ${props => props.theme.backgroundColor};
    transform: skewX(45deg);
  }
`;

const Logo = styled(LogoImage)`
  position: absolute;
  left: 22px;
  top: 22px;
  width: 91px;
  height: 75px;
  font-size: 60pt;
`;

interface IHeaderProps {
  path: string
}

const Header: FunctionComponent<IHeaderProps> = ({
  path
}) => (
    <Hero>
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
    </Hero>
);

export default Header;
