/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  The share/snap/comment action wheel displayed on posts.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC, useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useTooltip } from '../hooks/useTooltip';
import { Tooltip, Arrow } from './Tooltip';
import Cell from '../images/cell.svg';
import ShareIcon from '../images/share.svg';
import CommentIcon from '../images/comment.svg';
import SnapIcon from '../images/snap.svg';

export const WHEEL_SIZE = 76;

const CELL_WIDTH = 44;
const CELL_HEIGHT = 38;
const ICON_SIZE = 36;
const SNAP_TIME_MS = 400;

const StyledCell = styled(Cell)`
  position: absolute;
  left: 0;
  top: 0;
  width: ${CELL_WIDTH}px;
  height: ${CELL_HEIGHT}px;
`;

const StyledShareIcon = styled(ShareIcon).attrs(() => ({
  className: 'wheel-icon'
}))``;

const StyledCommentIcon = styled(CommentIcon).attrs(() => ({
  className: 'wheel-icon'
}))``;

const StyledStaticSnapIcon = styled(SnapIcon)`
  position: relative;
  top: 1px;
  left: -8px;

  #frame4 {
    opacity: 1;
  }

  #frame1, #frame2, #frame3 {
    opacity: 0;
  }
`;

const StyledAnimatedSnapIcon = styled(SnapIcon)`
  position: relative;
  top: 1px;
  left: -8px;

  #frame1 {
    opacity: 0;
    animation: snapFrame1 .4s steps(1) 1;
  }

  #frame2 {
    opacity: 0;
    animation: snapFrame2 .4s steps(1) 1;
  }
  
  #frame3 {
    opacity: 0;
    animation: snapFrame3 .4s steps(1) 1;
  }

  #frame4 {
    opacity: 0;
    animation: snapFrame4 .4s steps(1) 1;
  }

  @keyframes snapFrame1 {
    0% { opacity: 1; }
    25% { opacity: 0; }
  }

  @keyframes snapFrame2 {
    25% { opacity: 1; }
    50% { opacity: 0; }
  }

  @keyframes snapFrame3 {
    50% { opacity: 1; }
    75% { opacity: 0; }
  }

  @keyframes snapFrame4 {
    75% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

const WheelWrapper = styled.div`
  position: relative;
  width: ${WHEEL_SIZE}px;
  height: ${WHEEL_SIZE}px;
`;

const WheelButton = styled.button`
  background: none;
  border: none;
  appearance: none;
  cursor: pointer;

  position: absolute;
  width: ${CELL_WIDTH}px;
  height: ${CELL_HEIGHT}px;

  &:focus {
    outline: none;

    z-index: 1;

    .stroke-border {
      stroke: ${props => props.theme.focusColor};
    }
  }

  .wheel-icon {
    position: absolute;
    left: ${(CELL_WIDTH - ICON_SIZE) / 2}px;
    top: ${(CELL_HEIGHT - ICON_SIZE) / 2}px;
  }
`;

const SnapButton = styled(WheelButton)`
  left: 0px;
  top: 37px;
`;

const ShareButton = styled(WheelButton)`
  left: 0px;
  top: 0px;
`;

const CommentButton = styled(WheelButton)`
  left: 32px;
  top: 18.5px;
`;

const Wheel: FC = () => {
  const [ snapTimer, setSnapTimer ] = useState<number>(0);
  const snapRef = useRef<HTMLElement>(null);
  const shareRef = useRef<HTMLElement>(null);
  const commentRef = useRef<HTMLElement>(null);

  const {
    hideTip,
    showTipFor,
    tipProps,
    tipRef,
    tooltipText,
  } = useTooltip({});

  const handleSnap = () => {
    if (snapTimer) return;
    setSnapTimer(window.setTimeout(() => {
        window.clearTimeout(snapTimer);
        setSnapTimer(0);
    }, SNAP_TIME_MS));
  };

  return (
    <WheelWrapper>
      <SnapButton
        ref={snapRef}
        onClick={handleSnap}
        onMouseOver={() => showTipFor('snap!', snapRef)}
        onMouseOut={hideTip}
      >
        <StyledCell />
        { snapTimer
            ? <StyledAnimatedSnapIcon />
            : <StyledStaticSnapIcon />
        }
      </SnapButton>
      <ShareButton
        ref={shareRef}
        onMouseOver={() => showTipFor('share', shareRef)}
        onMouseOut={hideTip}
      >
        <StyledCell />
        <StyledShareIcon />
      </ShareButton>
      <CommentButton
        ref={commentRef}
        onMouseOver={() => showTipFor('comment', commentRef)}
        onMouseOut={hideTip}
      >
        <StyledCell />
        <StyledCommentIcon />
      </CommentButton>
      <Tooltip ref={tipRef} {...tipProps} role="tooltip">
        {tooltipText}
        <Arrow />
      </Tooltip>
    </WheelWrapper>
  );
};

export default Wheel;
