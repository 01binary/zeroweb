import styled from 'styled-components';

const Tooltip = styled.div.attrs(() => ({
    className: "tooltip"
  }))`
    z-index: 6;
    position: absolute;
    font-family: ${props => props.theme.smallFont};
    font-size: ${props => props.theme.smallFontSize};
    font-weight: ${props => props.theme.smallFontWeight};
    color: ${props => props.theme.primaryTextColor};
    position: absolute;
    line-height: ${props => props.theme.spacing};
    background: ${props => props.theme.dropShadowTransparentColor};
    padding: ${props => props.theme.spacingQuarter} ${props => props.theme.spacingHalf};
    left: 50%;
    bottom: calc(100% + .5em);
    width: max-content;
    opacity: 0;
    transform: translateY(${props => props.theme.spacingThird});
    transition:
      opacity ${props => props.theme.animationFast} ease-in-out,
      transform ${props => props.theme.animationFast} ease-in-out;
    pointer-events: none;
  
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
