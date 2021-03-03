import React, { FunctionComponent, SVGProps } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

const StyledLink = styled(Link)`
flex: 110px 0;
margin-left: -1px;
&:first-child {
  margin-left: 0px;
}

.navigation {
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
`;

const Text = styled.div`
  padding-left: 15px;
  padding-top: 53px;
  height: auto;
  width: auto;
  color: ${props => props.theme.primaryTextColor};
  font-size: ${props => props.theme.navigationFontSize};
  z-index: 6;
`;

interface IHeaderLinkProps {
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

const HeaderLink: FunctionComponent<IHeaderLinkProps> = ({
    children,
    background: Background,
    icon: Icon,
    path,
    to
}) => (
    <StyledLink to={to} className={getLinkClassName(path, to)}>
      <Background className={"navigation " + getLinkClassName(path, to)} />
      <Icon className="navigation navigation-icon" />
      <Text className="navigation">
        {children}
      </Text>
    </StyledLink>
);

export default HeaderLink;
