/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Hamburger menu button (used on mobile and narrow widths).
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC } from 'react';
import styled from 'styled-components';
import { MOBILE } from '../../constants';

const HamburgerButton = styled.input.attrs(() => ({
  id: 'hamburger',
  type: 'checkbox',
  className: 'hide',
}))`
  &:focus + label {
    outline: none;
    box-shadow: 0 0 0 ${(props) => props.theme.border}
      ${(props) => props.theme.focusColor};
  }
`;

const HamburgerHelper = styled.label.attrs(() => ({
  htmlFor: 'hamburger',
}))`
  position: relative;
  display: none;

  @media (max-width: ${MOBILE}) {
    display: block;
    top: ${(props) => props.theme.border};
    width: ${(props) => props.theme.spacingDouble};
    height: calc(
      ${(props) => props.theme.spacingDouble} - ${(props) => props.theme.border} *
        2
    );
    margin-right: ${(props) => props.theme.border};
    border-radius: ${(props) => props.theme.borderRadius};
    cursor: pointer;

    &:before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: ${(props) => props.theme.shadowDarkColor};
      opacity: 0;
      transition: opacity ${(props) => props.theme.animationFast} ease-out;
      border-radius: ${(props) => props.theme.borderRadius};
    }

    &:hover {
      &:before {
        opacity: ${(props) => (props.theme.isDark ? 0.5 : 0.15)};
      }
    }
  }
`;

const HamburgerIcon = styled.svg`
  position: relative;
  left: calc(${(props) => props.theme.spacingDouble} / 2 - 12px);
  top: calc(${(props) => props.theme.spacingDouble} / 2 - 12px);

  .clipped {
    clip-path: inset(0px 0px 0px 0px);
  }

  .wave {
    animation: loop 2s linear infinite;

    @keyframes loop {
      0% {
        transform: translateX(0);
      }

      25% {
        transform: translateX(-8px);
      }

      50% {
        transform: translateX(-24px);
      }

      100% {
        transform: translateX(-48px);
      }
    }
  }

  .close-first,
  .close-second {
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
    transform-origin: center;
    opacity: ${(props) => (props.menuOpen ? 1 : 0)};
  }

  .menu {
    transition: opacity ${(props) => props.theme.animationFast} ease-out;
    opacity: ${(props) => (props.menuOpen ? 0 : 1)};
  }

  .close-first {
    transform: rotateZ(${(props) => (props.menuOpen ? '0deg' : '45deg')});
  }

  .close-second {
    transform: rotateZ(${(props) => (props.menuOpen ? '0deg' : '-45deg')});
  }
`;

type HamburgerProps = {
  menuOpen: boolean;
  showMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

const Hamburger: FC<HamburgerProps> = ({ menuOpen, showMenu }) => (
  <>
    <HamburgerButton />
    <HamburgerHelper menuOpen={menuOpen} onClick={() => showMenu(!menuOpen)}>
      <HamburgerIcon
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        menuOpen={menuOpen}
      >
        <g className="clipped">
          <path
            className="menu wave stroke-foreground fill-none"
            d="M0,7c12,0,12,8,24,8c12,0,12-8,24-8s12,8,24,8"
          />
          <line
            className="menu stroke-foreground fill-none"
            x1="0"
            y1="3.5"
            x2="24"
            y2="3.5"
          />
          <line
            className="menu stroke-foreground fill-none"
            x1="0"
            y1="19.5"
            x2="24"
            y2="19.5"
          />
          <line
            className="close-first stroke-foreground"
            strokeWidth="1"
            x1="22"
            y1="2"
            x2="2"
            y2="22"
          />
          <line
            className="close-second stroke-foreground"
            strokeWidth="1"
            x1="2"
            y1="2"
            x2="22"
            y2="22"
          />
        </g>
      </HamburgerIcon>
    </HamburgerHelper>
  </>
);

export default Hamburger;
