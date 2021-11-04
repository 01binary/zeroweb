import React from 'react';
import styled from 'styled-components';

export const MARKER_SIZE = 36;

export const RulerMarker = styled.span`
  position: absolute;
  top: calc(50% - ${MARKER_SIZE + 4}px / 2);
  right: ${props => `calc(${props.theme.spacingHalf} + ${props.theme.borderThick} + ${MARKER_SIZE}px / 2)`};
  width: ${MARKER_SIZE}px;
  height: ${MARKER_SIZE}px;
  border-radius: ${MARKER_SIZE}px;
  border: ${props => props.theme.border} solid ${props => props.theme.borderColor};
  background: ${props => props.theme.backgroundColor};
  z-index: 1;
  transition: border-color ${props => props.theme.animationFast} ease-out, box-shadow ${props => props.theme.animationFast} ease-out;
`;

export const RulerMarkerBadge = styled.span`
  position: absolute;
  left: calc(100% + ${props => props.theme.spacingHalf});
  top: 0;
  font-family: ${props => props.theme.smallFont};
  font-size: ${props => props.theme.smallFontSize};
  font-weight: ${props => props.theme.smallFontWeight};
`;