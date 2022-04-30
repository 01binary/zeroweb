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

import React, { FC, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { AnchorLink } from 'gatsby-plugin-anchor-links';
import useSnap from '../../hooks/useSnap';
import { useTooltip } from '../../hooks/useTooltip';
import { Tooltip, Arrow } from '../../components/Tooltip';
import { Menu, MenuItem, MenuItemIcon, MenuProps } from '../../components/Menu';
import SnapAnimation from '../Animations/SnapAnimation';
import { ShareType } from '../../types/AllSharesQuery';
import { MOBILE, NARROW_INLINE_COMMENTS } from '../../constants';
import Cell from '../../images/cell.svg';
import ShareIcon from '../../images/share.svg';
import CommentIcon from '../../images/comment.svg';
import ShareFacebookIcon from '../../images/share-facebook.svg';
import ShareTwitterIcon from '../../images/share-twitter.svg';
import ShareLinkedInIcon from '../../images/share-linkedin.svg';
import ShareLinkIcon from '../../images/share-link.svg';
import ShareEmailIcon from '../../images/share-email.svg';
import { ContextMenu, ContextMenuArrow } from '../../components/ContextMenu';

export const WHEEL_SIZE = 76;

const CELL_WIDTH = 44;
const CELL_HEIGHT = 38;
const ICON_SIZE = 36;
const MIN_SIZE_WHEEL = '1250px';

const StyledCell = styled(Cell)`
  position: absolute;
  left: 0;
  top: 0;
  width: ${CELL_WIDTH}px;
  height: ${CELL_HEIGHT}px;
`;

const StyledShareIcon = styled(ShareIcon).attrs(() => ({
  className: 'wheel-icon',
}))``;

const StyledCommentIcon = styled(CommentIcon).attrs(() => ({
  className: 'wheel-icon',
}))``;

const StyledSnapAnimation = styled(SnapAnimation)`
  position: relative;
  top: 1px;
  left: -8px;
`;

const Wheelhouse = styled.aside<{
  showCommentsSidebar?: boolean;
}>`
  display: block;
  position: sticky;
  float: left;
  width: ${WHEEL_SIZE}px;
  height: ${WHEEL_SIZE}px;
  margin-left: calc(0px - ${(props) => props.theme.spacing} - ${WHEEL_SIZE}px);

  animation: slideIn ${(props) => props.theme.animationSlow} ease-out 1;

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(8px);
    }

    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }

  transform: translateY(
    ${(props) => (props.lower ? props.theme.spacingHalf : 0)}
  );
  transition: opacity ${(props) => props.theme.animationFast} ease-out,
    transform ${(props) => props.theme.animationSlow} ease-out;

  @media (max-width: ${NARROW_INLINE_COMMENTS}) {
    opacity: ${(props) => (props.showCommentsSidebar ? '0' : '1')};
  }

  @media (max-width: ${MIN_SIZE_WHEEL}) {
    opacity: 0;
    transform: translateY(1.5em);
  }

  @media (max-width: ${MOBILE}) {
    display: none;
  }
`;

const WheelWrapper = styled.div`
  display: block;
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
      stroke: ${(props) => props.theme.focusColor};
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

const Badge = styled.div<{ show?: boolean }>`
  display: block;
  position: absolute;
  color: ${(props) => props.theme.secondaryTextColor};
  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  font-weight: ${(props) => props.theme.smallFontWeight};
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: opacity ${(props) => props.theme.animationFast} ease-out;
`;

const SharesBadge = styled(Badge)`
  left: calc(100% + 0.33em);
  top: -0.33em;
`;

const ReactionsBadge = styled(Badge)`
  left: calc(100% + 0.1em);
  bottom: -0.33em;
`;

const CommentsBadge = styled(Badge)`
  left: calc(100% + 0.33em);
  top: calc(50% - 0.66em);
`;

const ShareMenuItemBadge = styled.div`
  position: absolute;
  right: 1em;
  color: ${(props) => props.theme.secondaryTextColor};
`;

type ShareMenuProps = {
  sharesByType: Partial<Record<ShareType, number>>;
} & MenuProps;

const ShareMenu: FC<ShareMenuProps> = ({ sharesByType, onSelect }) => (
  <Menu vertical>
    <MenuItem id="linkShare" onClick={onSelect}>
      <MenuItemIcon>
        <ShareLinkIcon />
      </MenuItemIcon>
      Copy link
      {Boolean(sharesByType.link) && (
        <ShareMenuItemBadge>{sharesByType.link}</ShareMenuItemBadge>
      )}
    </MenuItem>
    <MenuItem id="twitterShare" onClick={onSelect}>
      <MenuItemIcon>
        <ShareTwitterIcon />
      </MenuItemIcon>
      Twitter
      {Boolean(sharesByType.twitter) && (
        <ShareMenuItemBadge>{sharesByType.twitter}</ShareMenuItemBadge>
      )}
    </MenuItem>
    <MenuItem id="facebookShare" onClick={onSelect}>
      <MenuItemIcon>
        <ShareFacebookIcon />
      </MenuItemIcon>
      Facebook
      {Boolean(sharesByType.facebook) && (
        <ShareMenuItemBadge>{sharesByType.facebook}</ShareMenuItemBadge>
      )}
    </MenuItem>
    <MenuItem id="linkedInShare" onClick={onSelect}>
      <MenuItemIcon>
        <ShareLinkedInIcon />
      </MenuItemIcon>
      LinkedIn
      {Boolean(sharesByType.linkedIn) && (
        <ShareMenuItemBadge>{sharesByType.linkedIn}</ShareMenuItemBadge>
      )}
    </MenuItem>
    <MenuItem id="emailShare" onClick={onSelect}>
      <MenuItemIcon>
        <ShareEmailIcon />
      </MenuItemIcon>
      Email
      {Boolean(sharesByType.email) && (
        <ShareMenuItemBadge>{sharesByType.email}</ShareMenuItemBadge>
      )}
    </MenuItem>
  </Menu>
);

type WheelProps = {
  showCommentsSidebar?: boolean;
  commentCount: number;
  reactionCount: number;
  shareCount: number;
  sharesByType: Partial<Record<ShareType, number>>;
  postUrl: string;
  handleSnap: () => void;
  handleShare: (provider: string) => void;
};

const Wheel: FC<WheelProps> = ({
  postUrl,
  showCommentsSidebar,
  commentCount,
  reactionCount,
  shareCount,
  sharesByType,
  handleSnap,
  handleShare: handleShareUpstream,
}) => {
  const snapRef = useRef<HTMLElement>(null);
  const commentRef = useRef<HTMLElement>(null);
  const [isSnapAnimated, playSnapAnimation] = useSnap(() => {
    hideTip();
    handleSnap();
  });
  const { hideTip, showTipFor, tipProps, tipRef, tooltipText } = useTooltip({});
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
    verticalOffsetMobile: 6,
  });

  const handleShare = useCallback((e) => handleShareUpstream(e.target.id), [
    handleShareUpstream,
  ]);

  const handleShowShareMenu = useCallback(() => {
    if (menuVisible) {
      hideMenu();
    } else {
      hideTip();
      showMenu();
    }
  }, [menuVisible, hideMenu, hideTip, showMenu]);

  const handleHideShareMenu = useCallback(() => setTimeout(hideMenu, 250), []);

  useEffect(() => {
    window.addEventListener('scroll', hideMenu);
    return () => {
      window.removeEventListener('scroll', hideMenu);
    };
  }, [hideMenu]);

  return (
    <Wheelhouse
      lower={shareCount > 9}
      showCommentsSidebar={showCommentsSidebar}
    >
      <WheelWrapper>
        <SnapButton
          ref={snapRef}
          onClick={playSnapAnimation}
          onMouseOver={() => showTipFor('snap!', snapRef)}
          onMouseOut={hideTip}
        >
          <StyledCell />
          <StyledSnapAnimation animate={isSnapAnimated} />
          <ReactionsBadge show={Boolean(reactionCount)}>
            {reactionCount}
          </ReactionsBadge>
        </SnapButton>
        <ShareButton
          ref={targetRef}
          onClick={handleShowShareMenu}
          onBlur={handleHideShareMenu}
          onMouseOver={() =>
            showTipFor(
              'share',
              targetRef as React.MutableRefObject<HTMLElement>
            )
          }
          onMouseOut={hideTip}
        >
          <StyledCell />
          <StyledShareIcon />
          <SharesBadge show={Boolean(shareCount)}>{shareCount}</SharesBadge>
        </ShareButton>
        <CommentLink to={`${postUrl}#comments`}>
          <CommentButton
            ref={commentRef}
            onMouseOver={() => showTipFor('comment', commentRef)}
            onMouseOut={hideTip}
          >
            <StyledCell />
            <StyledCommentIcon />
            <CommentsBadge show={Boolean(commentCount)}>
              {commentCount}
            </CommentsBadge>
          </CommentButton>
        </CommentLink>
        <Tooltip ref={tipRef} {...tipProps} role="tooltip">
          {tooltipText}
          <Arrow />
        </Tooltip>
        <ContextMenu ref={menuRef} {...menuProps}>
          <ShareMenu sharesByType={sharesByType} onSelect={handleShare} />
          <ContextMenuArrow />
        </ContextMenu>
      </WheelWrapper>
    </Wheelhouse>
  );
};

export default Wheel;
