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
import { Arrow, Tooltip } from './Tooltip';
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

const ReactionBadge = styled.span<{ show: boolean }>`
  color: ${(props) => props.theme.secondaryTextColor};
  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  line-height: ${(props) => props.theme.smallFontLineHeight};

  margin-right: ${(props) =>
    props.show ? props.theme.spacingQuarter : '-0.25em'};

  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: opacity ${(props) => props.theme.animationFast} ease-out;
`;

const ReactionLabel = styled.label`
  position: relative;
  top: -0.7em;

  color: ${(props) => props.theme.foregroundColor};
  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  line-height: ${(props) => props.theme.smallFontLineHeight};

  cursor: pointer;
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

const Reactions: FC<ReactionsProps> = ({
  reactionCount,
  shareCount,
  sharesByType,
  handleSnap,
  handleShare: handleShareUpstream,
}) => {
  const snapRef = useRef<HTMLElement>(null);
  const { hideTip, showTipFor, tipProps, tipRef, tooltipText } = useTooltip({});
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
  const [isSnapAnimated, playSnapAnimation] = useSnap(() => {
    hideTip();
    handleSnap();
  });

  const handleToggleShareMenu = useCallback(() => {
    hideTip();
    if (menuVisible) hideMenu();
    else showMenu();
  }, [menuVisible, showMenu, hideMenu, hideTip]);

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
      <ReactionButton
        ref={snapRef}
        onClick={playSnapAnimation}
        onMouseOver={() => showTipFor('snap!', snapRef)}
        onMouseOut={hideTip}
      >
        <StyledSnapAnimation animate={isSnapAnimated} />
        <ReactionBadge show={Boolean(reactionCount)}>
          {reactionCount}
        </ReactionBadge>
        <ReactionLabel>{reactionCount > 1 ? 'Snaps' : 'Snap'}</ReactionLabel>
      </ReactionButton>
      <ReactionButton
        ref={shareRef}
        onClick={handleToggleShareMenu}
        onBlur={handleHideShareMenu}
        onMouseOver={() =>
          showTipFor('share', shareRef as MutableRefObject<HTMLElement>)
        }
        onMouseOut={hideTip}
      >
        <StyledShareIcon />
        <ReactionBadge show={Boolean(shareCount)}>{shareCount}</ReactionBadge>
        <ReactionLabel>{shareCount > 1 ? 'Shares' : 'Share'}</ReactionLabel>
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
      <Tooltip ref={tipRef} {...tipProps} role="tooltip">
        {tooltipText}
        <Arrow />
      </Tooltip>
    </Container>
  );
};

export default Reactions;
