import React, { FC } from 'react';
import styled from 'styled-components';
import { Menu, MenuItem, MenuItemIcon, MenuProps } from '../../components/Menu';
import ShareFacebookIcon from '../../images/share-facebook.svg';
import ShareTwitterIcon from '../../images/share-twitter.svg';
import ShareLinkedInIcon from '../../images/share-linkedin.svg';
import ShareLinkIcon from '../../images/share-link.svg';
import ShareEmailIcon from '../../images/share-email.svg';
import { ShareType } from '../../types/AllSharesQuery';

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

export default ShareMenu;
