import styled from 'styled-components';

export const Tooltip = styled.div.attrs(() => ({
  className: "tooltip"
}))`
  font-family: ${props => props.theme.smallFont};
  font-size: ${props => props.theme.smallFontSize};
  font-weight: ${props => props.theme.smallFontWeight};
  line-height: ${props => props.theme.spacing};

  color: ${props => props.theme.isDark
    ? props.theme.backgroundColor
    : props.theme.primaryTextColor};
  background: ${props => props.theme.isDark
    ? props.theme.foregroundColor
    : props.theme.dropShadowTransparentColor}CC;

  position: absolute;
  border-radius: ${props => props.theme.spacingSmall};
  transition: opacity ${props => props.theme.animationFast} ease-in-out;
  padding: ${props => props.theme.spacingQuarter} ${props => props.theme.spacingHalf};
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
    border-color:
      ${props => props.theme.isDark
        ? props.theme.foregroundColor
        : props.theme.dropShadowTransparentColor}CC
      transparent
      transparent
      transparent
    ;
  }

  &[data-popper-placement="bottom"] [data-popper-arrow] {
    top: -16px;
    border-color:
      transparent
      transparent
      ${props => props.theme.isDark
        ? props.theme.foregroundColor
        : props.theme.dropShadowTransparentColor}CC
      transparent
    ;
  }
`;

export const Arrow = styled.div.attrs(() => ({
  ['data-popper-arrow']: 1
}))`
  position: absolute;
  border-width: 8px;
  border-style: solid;
`;
