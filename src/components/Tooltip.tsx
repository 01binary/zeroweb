/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Tooltip component used for all tips in the blog.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import styled from 'styled-components';

const getTooltipColor = ({
  theme: {
    isDark,
    foregroundColor,
    dropShadowTransparentColor
  }
}) => (
  isDark
  ? `${foregroundColor}EE`
  : `${dropShadowTransparentColor}CC`
);

export const Tooltip = styled.div.attrs(() => ({
  className: "tooltip"
}))`
  font-family: ${props => props.theme.smallFont};
  font-size: ${props => props.theme.smallFontSize};
  font-weight: ${props => props.theme.smallFontWeight};
  text-transform: lowercase;

  color: ${props => props.theme.isDark
    ? props.theme.backgroundColor
    : props.theme.primaryTextColor};
  background: ${props => getTooltipColor(props)};

  position: absolute;
  border-radius: ${props => props.theme.spacingSmall};
  transition: opacity ${props => props.theme.animationFast} ease-in-out;
  padding: ${props => props.theme.spacingHalf};
  pointer-events: none;
  z-index: 3;
  opacity: 0;

  .stroke-foreground {
    stroke: ${props => props.theme.backgroundColor};
  }

  .stroke-background {
    stroke: ${props => props.theme.backgroundColor};
    opacity: .7;
  }

  &[data-show] {
    opacity: 1;
  }

  &[data-popper-placement="top"] [data-popper-arrow] {
    top: 100%;
    border-color: ${props => getTooltipColor(props)} transparent transparent transparent;
  }

  &[data-popper-placement="bottom"] [data-popper-arrow] {
    top: -16px;
    border-color: transparent transparent ${props => getTooltipColor(props)} transparent;
  }
`;

export const Arrow = styled.div.attrs(() => ({
  ['data-popper-arrow']: 1
}))`
  position: absolute;
  border-width: 8px;
  border-style: solid;
`;
