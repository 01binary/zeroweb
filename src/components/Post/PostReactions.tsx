import React, { FC, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { ShareType } from '../../types/AllSharesQuery';
import { useTooltip } from '../../hooks/useTooltip';
import useSnap from '../../hooks/useSnap';
import ShareIcon from '../../images/share.svg';
import ShareFacebookIcon from '../../images/share-facebook.svg';
import ShareTwitterIcon from '../../images/share-twitter.svg';
import ShareLinkedInIcon from '../../images/share-linkedin.svg';
import ShareLinkIcon from '../../images/share-link.svg';
import ShareEmailIcon from '../../images/share-email.svg';
import SnapAnimation from './SnapAnimation';
import { Menu, MenuItem, MenuItemIcon } from '../../components/Menu';
import { ContextMenu, ContextMenuArrow } from '../../components/ContextMenu';
import { MOBILE } from '../../constants';

const StyledSnapAnimation = styled(SnapAnimation)`
  transform: scale(1.15);
  pointer-events: none;
`;

const StyledShareIcon = styled(ShareIcon)`
  position: relative;
  left: 4px;
  transform: scale(1.25);
  pointer-events: none;
`;

const Container = styled.section`
  @media (min-width: ${MOBILE}) {
    display: none;
  }
`;

const ReactionButton = styled.button`
  background: none;
  border: none;
  appearance: none;
  cursor: pointer;
  padding: 0;
  margin: ${(props) => props.theme.spacingQuarter};
`;

const ReactionLabel = styled.span`
  position: relative;
  top: -0.75em;
  margin-left: 0.5em;
  margin-right: 0.5em;

  color: ${(props) =>
    props.hasIndicator
      ? props.theme.secondaryTextColor
      : props.theme.foregroundColor};
  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  line-height: ${(props) => props.theme.smallFontLineHeight};

  pointer-events: none;
`;

const ReactionIndicator = styled.span`
  color: ${(props) => props.theme.foregroundColor};
`;

const ShareBadge = styled.div`
  position: absolute;
  right: 1em;
  color: ${(props) => props.theme.secondaryTextColor};
`;

type ReactionsProps = {
  reactionCount: number;
  shareCount: number;
  sharesByType: Partial<Record<ShareType, number>>;
  handleSnap: () => void;
  handleShare: (provider: string) => void;
};

const PostReactions: FC<ReactionsProps> = ({
  reactionCount,
  shareCount,
  sharesByType,
  handleSnap,
  handleShare: handleShareUpstream,
}) => {
  const snapRef = useRef<HTMLElement>(null);
  const shareRef = useRef<HTMLElement>(null);
  const {
    hideTip: hideMenu,
    showTipFor: showMenu,
    tooltipVisible: menuVisible,
    tipProps: menuProps,
    tipRef: menuRef,
  } = useTooltip({
    placement: 'bottom-start',
    verticalOffsetDesktop: 6,
    verticalOffsetMobile: 6,
  });

  const [isSnapAnimated, playSnapAnimation] = useSnap(handleSnap);

  const handleToggleShareMenu = useCallback(() => {
    if (menuVisible) {
      hideMenu();
    } else {
      showMenu('share', shareRef);
    }
  }, [menuVisible, showMenu, hideMenu]);

  const handleHideShareMenu = useCallback(() => setTimeout(hideMenu, 250), [
    hideMenu,
  ]);

  const handleShare = useCallback((e) => handleShareUpstream(e.target.id), [
    handleShareUpstream,
  ]);

  return (
    <Container>
      <ReactionButton ref={snapRef} onClick={playSnapAnimation}>
        <StyledSnapAnimation animate={isSnapAnimated} />
        <ReactionLabel hasIndicator={reactionCount > 0}>
          {reactionCount > 0 && (
            <ReactionIndicator>{reactionCount}</ReactionIndicator>
          )}
          &nbsp;
          {reactionCount > 1 ? 'Snaps' : 'Snap!'}
        </ReactionLabel>
      </ReactionButton>
      <ReactionButton
        ref={shareRef}
        onClick={handleToggleShareMenu}
        onBlur={handleHideShareMenu}
      >
        <StyledShareIcon />
        <ReactionLabel hasIndicator={shareCount > 0}>
          {shareCount > 0 && (
            <ReactionIndicator>{shareCount}</ReactionIndicator>
          )}
          &nbsp;
          {shareCount > 1 ? 'Shares' : 'Share'}
        </ReactionLabel>
      </ReactionButton>
      <ContextMenu ref={menuRef} {...menuProps}>
        <Menu vertical>
          <MenuItem id="linkShare" onClick={handleShare}>
            <MenuItemIcon>
              <ShareLinkIcon />
            </MenuItemIcon>
            Copy link
            {Boolean(sharesByType.link) && (
              <ShareBadge>{sharesByType.link}</ShareBadge>
            )}
          </MenuItem>
          <MenuItem id="twitterShare" onClick={handleShare}>
            <MenuItemIcon>
              <ShareTwitterIcon />
            </MenuItemIcon>
            Twitter
            {Boolean(sharesByType.twitter) && (
              <ShareBadge>{sharesByType.twitter}</ShareBadge>
            )}
          </MenuItem>
          <MenuItem id="facebookShare" onClick={handleShare}>
            <MenuItemIcon>
              <ShareFacebookIcon />
            </MenuItemIcon>
            Facebook
            {Boolean(sharesByType.facebook) && (
              <ShareBadge>{sharesByType.facebook}</ShareBadge>
            )}
          </MenuItem>
          <MenuItem id="linkedInShare" onClick={handleShare}>
            <MenuItemIcon>
              <ShareLinkedInIcon />
            </MenuItemIcon>
            LinkedIn
            {Boolean(sharesByType.linkedIn) && (
              <ShareBadge>{sharesByType.linkedIn}</ShareBadge>
            )}
          </MenuItem>
          <MenuItem id="emailShare" onClick={handleShare}>
            <MenuItemIcon>
              <ShareEmailIcon />
            </MenuItemIcon>
            Email
            {Boolean(sharesByType.email) && (
              <ShareBadge>{sharesByType.email}</ShareBadge>
            )}
          </MenuItem>
        </Menu>
        <ContextMenuArrow />
      </ContextMenu>
    </Container>
  );
};

export default PostReactions;
