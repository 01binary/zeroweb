/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Ruler marker for post metadata of interest.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import styled from 'styled-components';
import { WIDE } from '../constants';

export const MARKER_SIZE = 36;

export const RulerMarker = styled.span`
  position: absolute;
  top: calc(0px - ${(props) => props.theme.borderThick});
  right: ${(props) =>
    `calc(${props.theme.spacingHalf} + ${props.theme.borderThick} - ${MARKER_SIZE}px / 3)`};
  width: ${MARKER_SIZE}px;
  height: ${MARKER_SIZE}px;

  @media (max-width: ${WIDE}) {
    right: 3em;
  }
`;

export const RulerMarkerBadge = styled.span`
  position: absolute;
  right: calc(0px - ${(props) => props.theme.spacingHalf});
  top: 0.33em;
  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  font-weight: ${(props) => props.theme.smallFontWeight};
  opacity: 1;
  transition: opacity ${(props) => props.theme.animationFast} ease-out;
  pointer-events: none;
`;
