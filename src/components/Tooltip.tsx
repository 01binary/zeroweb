import styled from 'styled-components';

const Tooltip = styled.div.attrs(() => ({
  className: "tooltip"
}))`
  font-family: ${props => props.theme.smallFont};
  font-size: ${props => props.theme.smallFontSize};
  font-weight: ${props => props.theme.smallFontWeight};
  line-height: ${props => props.theme.spacing};
  color: ${props => props.theme.primaryTextColor};
  background: ${props => props.theme.dropShadowTransparentColor};
  padding: ${props => props.theme.spacingQuarter} ${props => props.theme.spacingHalf};

  position: absolute;
  z-index: 6;
  opacity: 0;
  transition: opacity ${props => props.theme.animationFast} ease-in-out;
  pointer-events: none;

  &[data-show] {
    opacity: 1;
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 100%;
    left: 0px;
    border-width: 6px;
    border-style: solid;
    border-color:
      ${props => props.theme.dropShadowTransparentColor}
      transparent
      transparent
      ${props => props.theme.dropShadowTransparentColor};
  }
`;

export default Tooltip;
