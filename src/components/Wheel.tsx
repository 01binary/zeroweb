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

import React, { FC, useState, useRef, useMemo, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { AnchorLink } from 'gatsby-plugin-anchor-links';
import { useTooltip } from '../hooks/useTooltip';
import { CommentQuery } from '../types/AllCommentsQuery';
import { Tooltip, Arrow } from './Tooltip';
import { Menu, MenuItem, MenuIcon, MenuProps } from './Menu';
import Cell from '../images/cell.svg';
import ShareIcon from '../images/share.svg';
import CommentIcon from '../images/comment.svg';
import SnapIcon from '../images/snap.svg';
import ShareFacebookIcon from '../images/share-facebook.svg';
import ShareTwitterIcon from '../images/share-twitter.svg';
import ShareLinkedInIcon from '../images/share-linkedin.svg';
import ShareLinkIcon from '../images/share-link.svg';
import ShareEmailIcon from '../images/share-email.svg';
import { ContextMenu, ContextMenuArrow } from './ContextMenu';
import { ShareQuery, ShareType } from '../types/AllSharesQuery';

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

const CommentLink = styled(AnchorLink)`
  position: absolute;
  left: 0;
  top: 0;
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
  left: calc(100% + 0.1em);
  bottom: -0.33em;
`;

const ShareMenuItemBadge = styled.div`
  position: absolute;
  right: 1em;
  color: ${props => props.theme.secondaryTextColor};
`;

type ShareMenuProps = {
  sharesByType: Partial<Record<ShareType, number>>;
} & MenuProps;

const ShareMenu: FC<ShareMenuProps> = ({
  sharesByType,
  onSelect
}) => (
  <Menu vertical>
    <MenuItem id="linkShare" onClick={onSelect}>
      <MenuIcon>
        <ShareLinkIcon />
      </MenuIcon>
      Copy link
      {Boolean(sharesByType.link) &&
        <ShareMenuItemBadge>
          {sharesByType.link}
        </ShareMenuItemBadge>
      }
    </MenuItem>
    <MenuItem id="twitterShare" onClick={onSelect}>
      <MenuIcon>
        <ShareTwitterIcon />
      </MenuIcon>
      Twitter
      {Boolean(sharesByType.twitter) &&
        <ShareMenuItemBadge>
          {sharesByType.twitter}
        </ShareMenuItemBadge>
      }
    </MenuItem>
    <MenuItem id="facebookShare" onClick={onSelect}>
      <MenuIcon>
        <ShareFacebookIcon />
      </MenuIcon>
      Facebook
      {Boolean(sharesByType.facebook) &&
        <ShareMenuItemBadge>
          {sharesByType.facebook}
        </ShareMenuItemBadge>
      }
    </MenuItem>
    <MenuItem id="linkedInShare" onClick={onSelect}>
      <MenuIcon>
        <ShareLinkedInIcon />
      </MenuIcon>
      LinkedIn
      {Boolean(sharesByType.linkedIn) &&
        <ShareMenuItemBadge>
          {sharesByType.linkedIn}
        </ShareMenuItemBadge>
      }
    </MenuItem>
    <MenuItem id="emailShare" onClick={onSelect}>
      <MenuIcon>
        <ShareEmailIcon />
      </MenuIcon>
      Email
      {Boolean(sharesByType.email) &&
        <ShareMenuItemBadge>
          {sharesByType.email}
        </ShareMenuItemBadge>
      }
    </MenuItem>
  </Menu>
);

type WheelProps = {
  comments?: CommentQuery[];
  shareCount: number;
  sharesByType: Partial<Record<ShareType, number>>;
  handleSnap: () => void;
  handleShare: (provider: string) => void;
};

const Wheel: FC<WheelProps> = ({
  comments,
  shareCount,
  sharesByType,
  handleSnap: handleSnapUpstream,
  handleShare: handleShareUpstream,
}) => {
  const [ snapTimer, setSnapTimer ] = useState<number>(0);
  const snapRef = useRef<HTMLElement>(null);
  const commentRef = useRef<HTMLElement>(null);
  const {
    hideTip: hideMenu,
    showTip: showMenu,
    tipProps: menuProps,
    tipRef: menuRef,
    tooltipVisible: menuVisible,
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

  const handleSnap = useCallback(() => {
    if (snapTimer) return;
    hideTip();
    handleSnapUpstream();
    setSnapTimer(window.setTimeout(() => {
      window.clearTimeout(snapTimer);
      setSnapTimer(0);
    }, SNAP_TIME_MS));
  }, [hideTip, handleSnapUpstream, setSnapTimer]);

  const handleShare = useCallback((e) => {
    handleShareUpstream(e.target.id);
  }, [handleShareUpstream]);

  const handleShowShareMenu = useCallback(() => {
    if (menuVisible) {
      hideMenu();
    } else {
      hideTip();
      showMenu();
    }
  }, [menuVisible, hideMenu, hideTip, showMenu]);

  const handleHideShareMenu = useCallback(
    () => setTimeout(hideMenu, 250), []);

  useEffect(() => {
    window.addEventListener('scroll', hideMenu);
    return () => {
      window.removeEventListener('scroll', hideMenu);
    };
  }, []);

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
        onClick={handleShowShareMenu}
        onBlur={handleHideShareMenu}
        onMouseOver={() => showTipFor(
          'share',
          targetRef as React.MutableRefObject<HTMLElement>)
        }
        onMouseOut={hideTip}
      >
        <StyledCell />
        <StyledShareIcon />
        {Boolean(shareCount) &&
          <SharesBadge>{shareCount}</SharesBadge>
        }
      </ShareButton>
      <CommentLink to={`${window.location.pathname}#comments`}>
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
      </CommentLink>
      <Tooltip ref={tipRef} {...tipProps} role="tooltip">
        {tooltipText}
        <Arrow />
      </Tooltip>
      <ContextMenu
        ref={menuRef}
        {...menuProps}
      >
        <ShareMenu sharesByType={sharesByType} onSelect={handleShare} />
        <ContextMenuArrow />
      </ContextMenu>
    </WheelWrapper>
  );
};

export default Wheel;
