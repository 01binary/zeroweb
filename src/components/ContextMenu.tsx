/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Context menu component used for comment option menus.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import styled from 'styled-components';

export const ContextMenu = styled.div`
  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  font-weight: ${(props) => props.theme.smallFontWeight};
  text-transform: lowercase;

  position: absolute;
  left: -1000px;
  top: -1000px;
  opacity: 0;
  transition: opacity ${(props) => props.theme.animationFast} ease-in-out;

  color: ${(props) => props.theme.foregroundColor};
  background: ${(props) =>
    props.theme.isDark
      ? props.theme.alwaysDarkColor
      : props.theme.backgroundColor};
  border: 1px solid ${(props) => props.theme.dropShadowDarkColor};
  border-radius: ${(props) => props.theme.spacingSmall};
  box-shadow: 0 0 10px
    ${(props) =>
      props.theme.isDark
        ? `${props.theme.accentDarkShadowColor}66`
        : `${props.theme.dropShadowLightColor}66`};
  pointer-events: none;

  z-index: 2;

  &[data-show] {
    opacity: 1;
    pointer-events: all;
  }

  &[data-popper-placement='top-start'] [data-popper-arrow] {
    top: calc(100% + 1px);
    border-color: ${(props) => props.theme.dropShadowDarkColor} transparent
      transparent transparent;

    &:before {
      border-color: ${(props) =>
          props.theme.isDark
            ? props.theme.alwaysDarkColor
            : props.theme.backgroundColor}
        transparent transparent transparent;
      top: -10px;
      left: -9px;
    }
  }

  &[data-popper-placement='bottom-start'] [data-popper-arrow],
  &[data-popper-placement='bottom-end'] [data-popper-arrow] {
    top: -16px;
    border-color: transparent transparent
      ${(props) => props.theme.dropShadowDarkColor} transparent;

    &:before {
      border-color: transparent transparent
        ${(props) =>
          props.theme.isDark
            ? props.theme.alwaysDarkColor
            : props.theme.backgroundColor}
        transparent;
      top: -8px;
      left: -9px;
    }
  }

  &.comment-menu--closed {
    pointer-events: none;
  }
`;

export const ContextMenuArrow = styled.div.attrs(() => ({
  ['data-popper-arrow']: 1,
}))`
  position: absolute;
  border-width: 8px;
  border-style: solid;

  &:before {
    content: '';
    position: absolute;
    border-width: 9px;
    border-style: solid;
  }
`;
