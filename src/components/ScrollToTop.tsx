/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Scroll to top button.
|----------------------------------------------------------
|  Copyright(C) 2022 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import { MOBILE } from '../constants';
import StairsIcon from '../images/stairs.svg';

// Approximate percentage of page read before showing scroll to top button
const SCROLL_TO_TOP_THRESHOLD = 0.18;

const ScrollButton = styled.button<{ visible: boolean }>`
  opacity: ${(props) => (props.visible ? 1 : 0)};
  ${(props) => !props.visible && `pointer-events: none`};
  transition: opacity ${(props) => props.theme.animationFast} ease-out;

  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;

  margin-top: ${(props) => props.theme.spacingDouble};
  padding: ${(props) => props.theme.spacingQuarter};

  display: flex;
  flex-direction: column;

  svg,
  label {
    pointer-events: none;
  }

  &:hover {
    color: ${(props) =>
      props.theme.isDark
        ? props.theme.primaryColor
        : props.theme.primaryDarkColor};
  }

  @media (max-width: ${MOBILE}) {
    display: none;
  }
`;

const ScrollButtonLabel = styled.label`
  text-transform: lowercase;
  text-align: left;

  margin-top: ${(props) => props.theme.spacingHalf};

  transition: color ${(props) => props.theme.animationFast} ease-out;
`;

const ScrollToTop: FC<{ readPosition: number }> = ({ readPosition }) => {
  const handleClick = useCallback(
    () => window[`scrollTo`]({ top: 0, behavior: `smooth` }),
    []
  );

  return (
    <ScrollButton
      visible={readPosition > SCROLL_TO_TOP_THRESHOLD}
      onClick={handleClick}
    >
      <StairsIcon />
      <ScrollButtonLabel>Going up?</ScrollButtonLabel>
    </ScrollButton>
  );
};

export default ScrollToTop;
