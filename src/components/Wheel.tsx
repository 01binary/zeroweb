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

import React, {
  FC,
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import styled from 'styled-components';
import { AnchorLink } from 'gatsby-plugin-anchor-links';
import { useTooltip } from '../hooks/useTooltip';
import { CommentQuery } from '../types/AllCommentsQuery';
import { Tooltip, Arrow } from './Tooltip';
import { Menu, MenuItem, MenuItemIcon, MenuProps } from './Menu';
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
import { ShareType } from '../types/AllSharesQuery';

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

  @media (max-width: ${(props) => props.theme.mobile}) {
    display: none;
  }
`;

const StyledShareIcon = styled(ShareIcon).attrs(() => ({
  className: 'wheel-icon',
}))``;

const StyledCommentIcon = styled(CommentIcon).attrs(() => ({
  className: 'wheel-icon',
}))``;

const StyledStaticSnapIcon = styled(SnapIcon)`
  position: relative;
  top: 1px;
  left: -8px;

  #frame4 {
    opacity: 1;
  }

  #frame1,
  #frame2,
  #frame3 {
    opacity: 0;
  }

  @media (max-width: ${(props) => props.theme.mobile}) {
    top: 12px;
    left: 1px;
  }
`;

const StyledAnimatedSnapIcon = styled(SnapIcon)`
  position: relative;
  top: 1px;
  left: -8px;

  #frame1 {
    opacity: 0;
    animation: snapFrame1 0.4s steps(1) 1;
  }

  #frame2 {
    opacity: 0;
    animation: snapFrame2 0.4s steps(1) 1;
  }

  #frame3 {
    opacity: 0;
    animation: snapFrame3 0.4s steps(1) 1;
  }

  #frame4 {
    opacity: 0;
    animation: snapFrame4 0.4s steps(1) 1;
  }

  @keyframes snapFrame1 {
    0% {
      opacity: 1;
    }
    25% {
      opacity: 0;
    }
  }

  @keyframes snapFrame2 {
    25% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  @keyframes snapFrame3 {
    50% {
      opacity: 1;
    }
    75% {
      opacity: 0;
    }
  }

  @keyframes snapFrame4 {
    75% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @media (max-width: ${(props) => props.theme.mobile}) {
    top: 12px;
    left: 1px;
  }
`;

const Wheelhouse = styled.aside<{ inline?: boolean }>`
  ${(props) => (props.inline ? 'display:none;' : 'display:block;')}
  position: sticky;
  float: left;
  top: ${(props) => props.theme.spacingHalf};
  width: ${WHEEL_SIZE}px;
  height: ${WHEEL_SIZE}px;
  margin-left: calc(0px - ${(props) => props.theme.spacing} - ${WHEEL_SIZE}px);
  opacity: 1;

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

  transform: translateY(0);
  transition: opacity ${(props) => props.theme.animationFast} ease-out,
    transform ${(props) => props.theme.animationSlow} ease-out;

  @media (max-width: ${(props) => props.theme.wide}) {
    opacity: 0;
    transform: translateY(1.5em);
  }

  @media (max-width: ${(props) => props.theme.mobile}) {
    ${(props) => (props.inline ? 'display:block;' : 'display:none;')}
    position: initial;
    float: initial;
    opacity: initial;
    width: initial;
    height: initial;
    margin-left: 0px;
    margin-top: -${(props) => props.theme.spacing};
    margin-bottom: ${(props) => props.theme.spacingDouble};
  }
`;

const WheelWrapper = styled.div`
  display: block;
  position: relative;
  width: ${WHEEL_SIZE}px;
  height: ${WHEEL_SIZE}px;

  @media (max-width: ${(props) => props.theme.mobile}) {
    position: initial;
    width: initial;
    height: initial;
    display: flex;
  }
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

  @media (max-width: ${(props) => props.theme.mobile}) {
    position: relative;
    width: initial;
    height: initial;

    .wheel-icon {
      position: relative;
      left: 0;
      top: ${ICON_SIZE / 3}px;
      width: ${ICON_SIZE}px;
      height: ${ICON_SIZE}px;
    }
  }
`;

const SnapButton = styled(WheelButton)`
  left: 0px;
  top: 37px;

  @media (max-width: ${(props) => props.theme.mobile}) {
    top: 0px;
  }
`;

const ShareButton = styled(WheelButton)`
  left: 0px;
  top: 0px;
`;

const CommentButton = styled(WheelButton)`
  left: 32px;
  top: 18.5px;

  @media (max-width: ${(props) => props.theme.mobile}) {
    display: none;
  }
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

  @media (max-width: ${(props) => props.theme.mobile}) {
    ${(props) =>
      props.show ? 'display:inline !important;' : 'display:none !important;'};
    position: initial;
    margin-right: 0.5em;
  }
`;

const SharesBadge = styled(Badge)`
  left: calc(100% + 0.33em);
  top: -0.33em;

  @media (max-width: ${(props) => props.theme.mobile}) {
    margin-left: 6px;
  }
`;

const ReactionsBadge = styled(Badge)`
  left: calc(100% + 0.1em);
  bottom: -0.33em;

  @media (max-width: ${(props) => props.theme.mobile}) {
    margin-left: 8px;
  }
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
  comments?: CommentQuery[];
  shareCount: number;
  sharesByType: Partial<Record<ShareType, number>>;
  inline?: boolean;
  url: string;
  handleSnap: () => void;
  handleShare: (provider: string) => void;
};

const Wheel: FC<WheelProps> = ({
  url,
  inline,
  comments,
  shareCount,
  sharesByType,
  handleSnap: handleSnapUpstream,
  handleShare: handleShareUpstream,
}) => {
  const [snapTimer, setSnapTimer] = useState<number>(0);
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
    verticalOffsetMobile: 6,
  });
  const { hideTip, showTipFor, tipProps, tipRef, tooltipText } = useTooltip({});

  const commentCount = useMemo(
    () =>
      (comments || []).filter(({ markdown }) => markdown && markdown.length)
        .length,
    [comments]
  );

  const reactionCount = useMemo(
    () =>
      (comments || []).filter(
        ({ parentTimestamp, reaction }) => reaction && !parentTimestamp
      ).length,
    [comments]
  );

  const handleSnap = useCallback(() => {
    if (snapTimer) return;
    hideTip();
    handleSnapUpstream();
    setSnapTimer(
      window.setTimeout(() => {
        window.clearTimeout(snapTimer);
        setSnapTimer(0);
      }, SNAP_TIME_MS)
    );
  }, [hideTip, handleSnapUpstream, setSnapTimer]);

  const handleShare = useCallback(
    (e) => {
      handleShareUpstream(e.target.id);
    },
    [handleShareUpstream]
  );

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
    <Wheelhouse inline={inline}>
      <WheelWrapper>
        <SnapButton
          ref={snapRef}
          onClick={handleSnap}
          onMouseOver={() => showTipFor('snap!', snapRef)}
          onMouseOut={hideTip}
        >
          <StyledCell />
          {snapTimer ? <StyledAnimatedSnapIcon /> : <StyledStaticSnapIcon />}
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
        <CommentLink to={`${url}#comments`}>
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
