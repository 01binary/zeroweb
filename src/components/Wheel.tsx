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

import React, { FC, useState, useRef, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useTooltip } from '../hooks/useTooltip';
import { CommentQuery } from '../types/AllCommentsQuery';
import { Tooltip, Arrow } from './Tooltip';
import { Menu, MenuItem, MenuIcon, MenuProps } from './Menu';
import Cell from '../images/cell.svg';
import ShareIcon from '../images/share.svg';
import CommentIcon from '../images/comment.svg';
import SnapIcon from '../images/snap.svg';
import { ContextMenu, ContextMenuArrow } from './ContextMenu';

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

const Badge = styled.div`
  position: absolute;
  color: ${props => props.theme.secondaryTextColor};
  font-family: ${props => props.theme.smallFont};
  font-size: ${props => props.theme.smallFontSize};
  font-weight: ${props => props.theme.smallFontWeight};
`;

const SharesBadge = styled(Badge)`
  left: calc(100% + 0.33em);
  top: -0.33em;
`;

const CommentsBadge = styled(Badge)`
  left: calc(100% + 0.33em);
  top: calc(50% - 0.66em);
`;

const ReactionsBadge = styled(Badge)`
  left: calc(100% + 0.33em);
  bottom: -0.33em;
`;

const ShareMenu: FC<MenuProps> = ({ onSelect }) => (
  <Menu vertical>
    <MenuItem id="linkShare" onClick={onSelect}>
      <MenuIcon>
      </MenuIcon>
      Copy link
    </MenuItem>
    <MenuItem id="twitterShare" onClick={onSelect}>
      <MenuIcon>
      </MenuIcon>
      Twitter
    </MenuItem>
    <MenuItem id="facebookShare" onClick={onSelect}>
      <MenuIcon>
      </MenuIcon>
      Facebook
    </MenuItem>
    <MenuItem id="emailShare" onClick={onSelect}>
      <MenuIcon>
      </MenuIcon>
      Email
    </MenuItem>
  </Menu>
);

type WheelProps = {
  comments: CommentQuery[];
  handleSnap: () => void;
};

const Wheel: FC<WheelProps> = ({
  comments,
  handleSnap: handleSnapReaction,
}) => {
  const [ snapTimer, setSnapTimer ] = useState<number>(0);
  const snapRef = useRef<HTMLElement>(null);
  const commentRef = useRef<HTMLElement>(null);
  const {
    hideTip: hideMenu,
    showTip: showMenu,
    tipProps: menuProps,
    tipRef: menuRef,
    targetRef,
  } = useTooltip({
    placement: 'bottom-start',
    verticalOffsetDesktop: 6,
    verticalOffsetMobile: 6
  });
  const {
    hideTip,
    showTipFor,
    tipProps,
    tipRef,
    tooltipText,
  } = useTooltip({});

  const commentCount = useMemo(() => (comments || [])
    .filter(({ markdown }) => markdown && markdown.length)
    .length,
  [comments]);

  const reactionCount = useMemo(() => (comments || [])
    .filter(({ parentTimestamp, reaction }) => reaction && !parentTimestamp)
    .length,
  [comments]);

  // TODO: load shares from fb and twitter, maybe count email and link copies?
  const shareCount = 0;

  const handleSnap = () => {
    if (snapTimer) return;
    handleSnapReaction();
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
        {Boolean(reactionCount) &&
          <ReactionsBadge>{reactionCount}</ReactionsBadge>
        }
      </SnapButton>
      <ShareButton
        ref={targetRef}
        onClick={showMenu}
        onBlur={hideMenu}
        onMouseOver={() => showTipFor('share', targetRef)}
        onMouseOut={hideTip}
      >
        <StyledCell />
        <StyledShareIcon />
        {Boolean(shareCount) &&
          <SharesBadge>{shareCount}</SharesBadge>
        }
      </ShareButton>
      <CommentButton
        ref={commentRef}
        onMouseOver={() => showTipFor('comment', commentRef)}
        onMouseOut={hideTip}
      >
        <StyledCell />
        <StyledCommentIcon />
        {Boolean(commentCount) &&
          <CommentsBadge>{commentCount}</CommentsBadge>
        }
      </CommentButton>
      <Tooltip ref={tipRef} {...tipProps} role="tooltip">
        {tooltipText}
        <Arrow />
      </Tooltip>
      <ContextMenu
        ref={menuRef}
        {...menuProps}
      >
        <ShareMenu />
        <ContextMenuArrow />
      </ContextMenu>
    </WheelWrapper>
  );
};

export default Wheel;
