import React, {
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import styled from 'styled-components';
import { ShareType } from '../types/AllSharesQuery';
import { useTooltip } from '../hooks/useTooltip';
import useSnap from '../hooks/useSnap';
import ShareIcon from '../images/share.svg';
import ShareFacebookIcon from '../images/share-facebook.svg';
import ShareTwitterIcon from '../images/share-twitter.svg';
import ShareLinkedInIcon from '../images/share-linkedin.svg';
import ShareLinkIcon from '../images/share-link.svg';
import ShareEmailIcon from '../images/share-email.svg';
import SnapAnimation from './SnapAnimation';
import { Menu, MenuItem, MenuItemIcon, MenuProps } from './Menu';
import { ContextMenu, ContextMenuArrow } from './ContextMenu';

const StyledSnapAnimation = styled(SnapAnimation)`
  transform: scale(1.15);
`;

const StyledShareIcon = styled(ShareIcon)`
  transform: scale(1.25);
`;

const Container = styled.section`
  @media (min-width: ${(props) => props.theme.mobile}) {
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
  margin-left: 0.75em;
  margin-right: 0.5em;

  color: ${(props) => props.theme.foregroundColor};
  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  line-height: ${(props) => props.theme.smallFontLineHeight};
`;

const ReactionAdorner = styled.span`
  color: ${(props) => props.theme.borderColor};
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
  const {
    hideTip: hideMenu,
    showTip: showMenu,
    tipProps: menuProps,
    tipRef: menuRef,
    tooltipVisible: menuVisible,
    targetRef: shareRef,
  } = useTooltip({
    placement: 'bottom-start',
    verticalOffsetDesktop: 6,
    verticalOffsetMobile: 6,
  });
  const [isSnapAnimated, playSnapAnimation] = useSnap(handleSnap);

  const handleToggleShareMenu = useCallback(() => {
    if (menuVisible) hideMenu();
    else showMenu();
  }, [menuVisible, showMenu, hideMenu]);

  const handleHideShareMenu = useCallback(() => setTimeout(hideMenu, 250), [
    hideMenu,
  ]);

  const handleShare = useCallback((e) => handleShareUpstream(e.target.id), [
    handleShareUpstream,
  ]);

  useEffect(() => {
    window.addEventListener('scroll', hideMenu);
    return () => {
      window.removeEventListener('scroll', hideMenu);
    };
  }, [hideMenu]);

  return (
    <Container>
      <ReactionButton ref={snapRef} onClick={playSnapAnimation}>
        <StyledSnapAnimation animate={isSnapAnimated} />
        <ReactionLabel>
          {reactionCount > 1 ? 'Snaps' : 'Snap!'}
          <ReactionAdorner>&nbsp;[&nbsp;</ReactionAdorner>
          {reactionCount}
          <ReactionAdorner>&nbsp;]</ReactionAdorner>
        </ReactionLabel>
      </ReactionButton>
      <ReactionButton
        ref={shareRef}
        onClick={handleToggleShareMenu}
        onBlur={handleHideShareMenu}
      >
        <StyledShareIcon />
        <ReactionLabel>
          {shareCount > 1 ? 'Shares' : 'Share'}
          <ReactionAdorner>&nbsp;[&nbsp;</ReactionAdorner>
          {shareCount}
          <ReactionAdorner>&nbsp;]</ReactionAdorner>
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
