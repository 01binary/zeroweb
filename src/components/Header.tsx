/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Blog header component with navlinks (includes mobile).
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { useStyledDarkMode } from 'gatsby-styled-components-dark-mode';
import { Link } from 'gatsby';
import NavLink from './NavLink';
import Hamburger from './Hamburger';
import LogoImage from '../images/logo.svg';
import ArticlesIcon from "../images/articles.svg"
import ProjectsIcon from "../images/projects.svg"
import AboutIcon from "../images/about.svg"
import LightIcon from "../images/light.svg";
import DarkIcon from "../images/dark.svg";
import ArticlesBackground from "../images/navigation-articles.svg"
import ProjectsBackground from "../images/navigation-projects.svg"
import AboutBackground from "../images/navigation-about.svg"
import ROUTES from '../routes';

const HEADER_HEIGHT = 250;

const BACKGROUNDS = {
  articles: ArticlesBackground,
  projects: ProjectsBackground,
  about: AboutBackground
};

const ICONS = {
  articles: ArticlesIcon,
  projects: ProjectsIcon,
  about: AboutIcon
};

const Hero = styled.header`
  font-family: ${props => props.theme.titleFont};
  background: ${props => props.theme.primaryColor};
  color: ${props => props.theme.primaryTextColor};
  max-width: ${props => props.theme.column};
  margin: auto;
  height: ${HEADER_HEIGHT}px;
  position: relative;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  background: linear-gradient(
      135deg,
      ${props => props.theme.primaryColor} 0%,
      ${props => props.theme.secondaryColor} 100%);
  
  transition:
    margin ${props => props.theme.animationFast} ease-out,
    height ${props => props.theme.animationFast} ease-out;

  margin-top: ${props => props.theme.spacingTriple};

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
    width: 17px;
    height: 49px;
    background: ${props => props.theme.backgroundColor};
    transition: background-color ${props => props.theme.animationFast} ease-out;
    transform: skewX(45deg);
  }

  .fill-foreground {
    fill: ${props => props.theme.isDark
      ? props.theme.foregroundColor
      : props.theme.backgroundColor};
  }

  .fill-background {
    fill: ${props => props.theme.primaryColor};
  }

  .stroke-foreground {
    stroke: ${props => props.theme.primaryTextColor};
  }

  .stroke-background {
    stroke-width: 1.5px;
    stroke: ${props => props.theme.primaryTextColor};
    opacity: .6;
  }

  @media (max-width: ${props => props.theme.mobile}) {
    z-index: 2;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    margin: 0;
    max-width: initial;
    height: ${props => props.theme.spacingDouble};
    background: none;
    color: ${props => props.theme.foregroundColor};

    &:before {
      z-index: 0;
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

    .fill-foreground {
      fill: ${props => props.theme.isDark
        ? props.theme.primaryTextColor
        : props.theme.primaryColor
      }
    }
  
    .fill-background {
      fill: ${props => props.theme.isDark
        ? props.theme.backgroundColor
        : props.theme.backgroundColor
      }
    }
  
    .stroke-foreground {
      stroke: ${props => props.theme.isDark
        ? props.theme.primaryTextColor
        : props.theme.foregroundColor
      }
    }
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

const LogoLink = styled(Link)`
  &:after {
    content: '';
    position: absolute;
    top: 14px;
    left: 22px;
    width: ${props => props.theme.spacingTriple};
    height: ${props => props.theme.spacingTriple};
    border-radius: ${props => props.theme.borderRadius};
  }

  &:focus:after {
    box-shadow: 0 0 0 ${props => props.theme.border} ${props => props.theme.focusColor};
  }

  @media (max-width: ${props => props.theme.mobile}) {
    &:after {
      top: ${props => props.theme.border};
      left: 17px;
      width: calc(${props => props.theme.spacingDouble} - ${props => props.theme.border} * 2);
      height: calc(${props => props.theme.spacingDouble} - ${props => props.theme.border} * 2);
    }
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
    background-color: ${props => props.theme.backgroundColor};
    transition: background-color ${props => props.theme.animationFast} ease-out;
    transform: skewX(45deg);
  }

  @media (max-width: ${props => props.theme.mobile}) {
    transition:
      opacity ${props => props.theme.animationFast} ease-out,
      height  ${props => props.theme.animationFast} ease-out;
    overflow: hidden;
    background: none;
    position: fixed;
    left: 0;
    right: 0;
    top: ${props => props.theme.spacingDouble};
    bottom: initial;
    height: ${props => props.menuOpen ? '11em' : '0'};
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

const Toolbar = styled.section`
  display: flex;
  justify-content: flex-end;
  margin: 0;
  padding: 0;

  @media (min-width: ${props => props.theme.mobile}) {
    margin-right: ${props => props.theme.spacing};
    padding-top: ${props => props.theme.spacing};
  }
`;

const Toggle = styled.button`
  position: relative;
  width: ${props => props.theme.spacingOneAndThird};
  height: ${props => props.theme.spacingOneAndThird};
  background: none;
  border: none;
  appearance: none;
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius};

  svg {
    position: absolute;
    left: calc((${props => props.theme.spacingOneAndThird} - 24px) / 2);
    top: calc((${props => props.theme.spacingOneAndThird} - 24px) / 2);
  }

  &:before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: ${props => props.theme.shadowDarkColor};
      opacity: 0;
      transition: opacity ${props => props.theme.animationFast} ease-out;
      border-radius: ${props => props.theme.borderRadius};
  }

  &:hover {
    &:before {
      opacity: ${props => props.theme.isDark ? 0.5 : 0.15};
    }
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 ${props => props.theme.border} ${props => props.theme.focusColor};
  }

  @media (max-width: ${props => props.theme.mobile}) {
    top: ${props => props.theme.border};
    width: ${props => props.theme.spacingDouble};
    height: calc(${props => props.theme.spacingDouble} - ${props => props.theme.border} * 2);

    svg {
      position: absolute;
      left: calc((${props => props.theme.spacingDouble} - 24px) / 2);
      top: calc((${props => props.theme.spacingDouble} - 24px) / 2);
    }
  }
`;

interface ThemeToggleProps {
  isDark: boolean;
  toggleDark: () => void;
};

const ThemeToggle: FC<ThemeToggleProps> = ({
  isDark,
  toggleDark
}) => (
  <Toggle onClick={() => toggleDark()}>
    {isDark
      ? <LightIcon />
      : <DarkIcon />
    }
  </Toggle>
);

interface HeaderProps {
  path: string;
};

const Header: FC<HeaderProps> = ({
  path
}) => {
  const { isDark, toggleDark } = useStyledDarkMode();
  const [ menuOpen, showMenu ] = useState(false);
  return (
    <Hero isDark={isDark} role="banner">
      <LogoLink to="/">
        <Logo />
      </LogoLink>

      <Title>
        <span>01</span> binary: tech art<Caret/>
      </Title>

      <Toolbar role="toolbar">
        <ThemeToggle isDark={isDark} toggleDark={toggleDark} />
        <Hamburger menuOpen={menuOpen} showMenu={showMenu} />
      </Toolbar>

      <Navigation
        menuOpen={menuOpen}
        onClick={() => showMenu(false)}
      >
        {ROUTES.map(({ collection, path: routePath }) => (
          <NavLink
            key={routePath}
            to={routePath}
            path={path}
            icon={ICONS[collection]}
            background={BACKGROUNDS[collection]}
          >
            {collection}
          </NavLink>
        ))}
      </Navigation>
    </Hero>
  );
};

export default Header;
