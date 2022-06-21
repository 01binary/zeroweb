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
import { MOBILE_WIDE, NARROW_SIDE_COMMENTS } from '../constants';
import StairsIcon from '../images/stairs.svg';

// Approximate percentage of page read before showing scroll to top button
const SCROLL_TO_TOP_THRESHOLD = 0.18;

const LinkButton = styled.button<{ visible: boolean }>`
  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  font-weight: ${(props) => props.theme.smallFontWeight};

  opacity: ${(props) => (props.visible ? 1 : 0)};
  ${(props) => !props.visible && `pointer-events: none`};
  transition: opacity ${(props) => props.theme.animationFast} ease-out;

  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;

  display: flex;
  flex-direction: column;

  svg,
  label {
    pointer-events: none;
  }

  color: ${(props) =>
    props.theme.isDark
      ? props.theme.primaryColor
      : props.theme.accentTextColor};

  &:focus {
    border-radius: ${(props) => props.theme.borderRadius};
    box-shadow: 0 0 0 ${(props) => props.theme.border}
      ${(props) => props.theme.focusColor};
    outline: none;
  }

  &:hover {
    text-decoration: underline;
    color: ${(props) =>
      props.theme.isDark
        ? props.theme.primaryLightColor
        : props.theme.primaryDarkColor};
  }
`;

const InlineScrollButton = styled(LinkButton)<{ visible: boolean }>`
  margin-left: calc(0px - ${(props) => props.theme.spacingQuarter});
  margin-top: ${(props) => props.theme.spacing};

  @media (min-width: 1320px) {
    display: none;
  }
`;

const FixedScrollButton = styled(LinkButton)<{ visible: boolean }>`
  position: fixed;
  bottom: 3vh;
  right: calc(50% - ${MOBILE_WIDE} + ${(props) => props.theme.spacing});

  @media (max-width: ${NARROW_SIDE_COMMENTS}) {
    right: calc(50% - ${MOBILE_WIDE} + 30px + 15px);
  }

  @media (max-width: 1320px) {
    display: none;
  }
`;

const ScrollButtonLabel = styled.label<{ inline: boolean }>`
  text-transform: lowercase;
  text-align: left;

  margin-top: ${(props) => props.theme.spacingQuarter};

  transition: color ${(props) => props.theme.animationFast} ease-out;

  @media (max-width: 1320px) {
    ${(props) => !props.inline && `display: none`};
  }
`;

const ScrollToTop: FC<{ readPosition: number; inline: boolean }> = ({
  readPosition,
  inline,
}) => {
  const handleClick = useCallback(
    () => window[`scrollTo`]({ top: 0, behavior: `smooth` }),
    []
  );

  const Wrapper = inline ? InlineScrollButton : FixedScrollButton;

  return (
    <Wrapper
      visible={readPosition > SCROLL_TO_TOP_THRESHOLD}
      onClick={handleClick}
    >
      <StairsIcon />
      <ScrollButtonLabel inline={inline}>Going up?</ScrollButtonLabel>
    </Wrapper>
  );
};

export default ScrollToTop;
