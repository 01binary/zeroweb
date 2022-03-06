import React, { FC } from 'react';
import styled from 'styled-components';
import { Menu, MenuItem, MenuProps } from '../Menu';
import CommentIcon from '../../images/comment.svg';
import HighlightIcon from '../../images/highlight.svg';

type ParagraphMenuProps = {
  loading: boolean;
  comments: number;
  highlights: number;
  onMouseOver: () => void;
  onMouseOut: () => void;
} & MenuProps;

const ParagraphMenuItemBadge = styled.div`
  color: ${(props) => props.theme.secondaryTextColor};
`;

const ParagraphMenu: FC<ParagraphMenuProps> = ({
  loading,
  comments,
  highlights,
  onSelect,
  onMouseOver,
  onMouseOut,
}) => (
  <Menu
    horizontal
    fade={loading}
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
  >
    <MenuItem id="paragraphHighlight" onClick={onSelect}>
      <HighlightIcon />
      {highlights > 1 ? 'Highlights' : 'Highlight'}
      {highlights > 0 && (
        <ParagraphMenuItemBadge>&nbsp;[{highlights}]</ParagraphMenuItemBadge>
      )}
    </MenuItem>
    <MenuItem id="paragraphComment" onClick={onSelect}>
      <CommentIcon />
      {comments > 1 ? 'Comments' : 'Comment'}
      {comments > 0 && (
        <ParagraphMenuItemBadge>&nbsp;[{comments}]</ParagraphMenuItemBadge>
      )}
    </MenuItem>
  </Menu>
);

export default ParagraphMenu;
