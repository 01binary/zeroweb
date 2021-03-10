import React, { FunctionComponent, SVGProps } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

const StyledLink = styled(Link)`
  flex: 110px 0;
  margin-left: -1px;

  &:first-child {
    margin-left: 0px;
  }

  .navigation, .navigation-text, .navigation-icon {
      display: inline;
      position: absolute;
      width: 110px;
  }

  .navigation-background {
      fill: ${props => props.theme.backgroundColor};
      transition: opacity ${props => props.theme.animationFast} ease-out;
      opacity: 0;
      z-index: 5;
  }

  &:hover {
      .navigation-background {
          opacity: 0.20;
      }
  }

  .navigation-border {
      fill: ${props => props.theme.accentTextColor};
      z-index: 6;
  }
      
  .navigation-highlight {
      fill: ${props => props.theme.primaryLightColor};
      z-index: 7;
  }
      
  .navigation-selection {
      z-index: 6;
      fill: ${props => props.theme.selectionColor};
  }

  .navigation-unselected .navigation-selection {
    fill: none;
  }

  .navigation-selected .navigation-border {
    fill: none;
  }

  .navigation-selected .navigation-highlight {
    fill: none;
  }

  .navigation-icon {
    z-index: 6;

    width: 24px;
    height: 22px;

    margin-left: 14px;
    margin-top: 25px;
  }

  @media (max-width: ${props => props.theme.mobile}) {
    margin-left: initial;
    flex: 0 0;

    .navigation-icon {
      margin: 0 0 0 ${props => props.theme.spacingHalf};
      padding-left: 1em;
      height: 100%;

      &.navigation-selected {
        .stroke-foreground {
          stroke: white;
        }

        .stroke-background {
          stroke: white;
          opacity: .7;
        }
      }
    }

    .navigation-text {
      display: block;
      position: initial;
    }

    .navigation {
      display: none;
      width: 0;
      height: 0;
    }

    .navigation-unselected {
      color: ${props => props.theme.foregroundColor};
    }

    .navigation-selected {
      color: ${props => props.theme.backgroundColor};

      &:before {
        z-index: -1;
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: -2px;
        bottom: -2px;
        background: ${props => props.theme.focusColor};
      }
    }
  }
`;

const Text = styled.div`
  padding-left: 15px;
  padding-top: 53px;
  height: auto;
  width: auto;
  color: ${props => props.theme.primaryTextColor};
  font-size: ${props => props.theme.navigationFontSize};
  z-index: 6;

  @media (max-width: ${props => props.theme.mobile}) {
    margin-left: ${props => props.theme.spacingDouble};
    padding:
      ${props => props.theme.spacingQuarter}
      ${props => props.theme.spacingHalf};
    font-size: ${props => props.theme.normalFontSize};
  }
`;

interface INavLinkProps {
  background: FunctionComponent<SVGProps<SVGSVGElement>>,
  icon: FunctionComponent<SVGProps<SVGSVGElement>>,
  path: string
  to: string,
};

const getLinkClassName = (path: string, to: string) => (
  path === to
    ? "navigation-selected"
    : "navigation-unselected"
);

const NavLink: FunctionComponent<INavLinkProps> = ({
    children,
    background: Background,
    icon: Icon,
    path,
    to
}) => {
  const selectedClass = getLinkClassName(path, to);
  return (
    <StyledLink to={to} className={selectedClass}>
      <Background className={`navigation ${selectedClass}`} />
      <Icon className={`navigation-icon ${selectedClass}`} />
      <Text className={`navigation-text ${selectedClass}`}>
        {children}
      </Text>
    </StyledLink>
  );
};

export default NavLink;
