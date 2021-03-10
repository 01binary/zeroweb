import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import HeaderLink from './HeaderLink';
import LogoImage from '../images/Logo.svg';
import HamburgerIcon from '../images/hamburger.svg';
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
  max-width: ${props => props.theme.column};
  margin: auto;
  height: 250px;
  position: relative;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, ${props => props.theme.primaryColor} 0%, ${props => props.theme.secondaryColor} 100%);
  transition:
    margin ${props => props.theme.animationFast} ease-out,
    height ${props => props.theme.animationFast} ease-out;
  margin-top: 0;

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

  @media (max-width: ${props => props.theme.mobile}) {
    z-index: 1;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    height: ${props => props.theme.spacingDouble};
    background: none;
    color: ${props => props.theme.foregroundColor};

    &:before {
      z-index 0;
      position: absolute;
      background: ${props => props.theme.backgroundColor};
      opacity: .8;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      transform: none;
      box-shadow: 0 0 5px ${props => props.theme.dropShadowLightColor};
    }

    &:after {
      display: none;
    }

    nav {
      transition:
        opacity ${props => props.theme.animationFast} ease-out,
        height  ${props => props.theme.animationFast} ease-out;
      height: 0;
      padding: 0;
      overflow: hidden;
    }

    #hamburger:checked {
      & ~ nav {
        opacity: 1;
        height: 8em;
      }
    }

    .fill-foreground {
      fill: ${props => props.theme.primaryColor}
    }
  
    .fill-background {
      fill: ${props => props.theme.backgroundColor}
    }
  
    .stroke-foreground {
      stroke: ${props => props.theme.accentTextColor}
    }
  }

  @media (min-width: ${props => props.theme.desktop}) {
    margin-top: ${props => props.theme.spacingTriple};
  }
`;

const Title = styled.h1`
  position: absolute;
  left: 128px;
  top: 68px;
  margin: 0;
  font-size: ${props => props.theme.titleFontSize};
  font-weight: ${props => props.theme.titleFontWeight};

  span {
    display: none;
  }

  @media (max-width: ${props => props.theme.mobile}) {
    display: none;
  }
`;

const Caret = styled.div`
  position: absolute;
  width: 13.75pt;
  height: 5pt;
  right: -15pt;
  bottom: -3.75pt;
  background: ${props => props.theme.primaryTextColor};
  animation: blink 1.1s linear infinite;

  @media (max-width: ${props => props.theme.mobile}) {
    display: none;
  }

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

const Logo = styled(LogoImage)`
  position: absolute;
  left: 22px;
  top: 22px;
  width: 91px;
  height: 75px;
  font-size: 60pt;

  @media (max-width: ${props => props.theme.mobile}) {
    top: 10px;
    width: 45.5px;
    height: 37.5px;
  }
`;

const Navigation = styled.nav`
  display: flex;
  position: absolute;
  left: 0;
  bottom: 1px;
  min-width: 373px;
  height: 82px;

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

  @media (max-width: ${props => props.theme.mobile}) {
    background: none;
    position: fixed;
    left: 0;
    right: 0;
    top: ${props => props.theme.spacingDouble};
    bottom: initial;
    height: initial;
    padding: ${props => props.theme.spacingQuarter};
    padding-bottom: ${props => props.theme.spacingHalf};
    flex-direction: column;
    border-bottom: 1px solid ${props => props.theme.borderColor};

    &:before {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 100%;
      background: ${props => props.theme.backgroundColor};
      opacity: .95;
      box-shadow: initial;
    }

    &:after {
      display: none;
    }

    .stroke-foreground {
      stroke: ${props => props.theme.foregroundColor}
    }
  
    .stroke-background {
      stroke: ${props => props.theme.accentShadowColor}
    }
  }
`;

const HamburgerButton = styled.input.attrs(
  () => ({
    id: 'hamburger',
    type: 'checkbox'
  })
)`
  display: none;
`;

const HamburgerLabel = styled.label.attrs(
  () => ({
    htmlFor: 'hamburger'
  })
)`
  display: none;

  .fill-foreground {
    fill: ${props => props.theme.foregroundColor};
  }

  @media (max-width: ${props => props.theme.mobile}) {
    display: block;
    position: fixed;
    top: 0;
    right: 0;
    width: ${props => props.theme.spacingDouble};
    height: ${props => props.theme.spacingDouble};
    display: flex;
    align-items: center;
    cursor: pointer;
  }
`;

const StyledHamburgerIcon = styled(HamburgerIcon)`
  flex: 24 24;
`;

const Hamburger = () => (
  <>
    <HamburgerButton />
    <HamburgerLabel>
      <StyledHamburgerIcon />
    </HamburgerLabel>
  </>
);

const closeMenu = () => setTimeout(() => {
  const menu = document.getElementById('hamburger');
  if (menu) menu.checked = false;
}, 100);

interface IHeaderProps {
  path: string
}

const Header: FunctionComponent<IHeaderProps> = ({
  path
}) => (
    <Hero>
      <Link to="/">
        <Logo />
      </Link>

      <Title>
        <span>01</span> binary: tech art<Caret/>
      </Title>

      <Hamburger />

      <Navigation onClick={closeMenu}>
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
