import React, { FC } from 'react';
import styled from 'styled-components';
import { Menu, MenuItem, MenuProps } from '../Menu';
import CommentIcon from '../../images/comment.svg';
import HighlightIcon from '../../images/highlight.svg';

type ParagraphMenuProps = {
  comments: number;
  highlights: number;
} & MenuProps;

const ParagraphMenuItemBadge = styled.div`
  color: ${(props) => props.theme.secondaryTextColor};
`;

const ParagraphMenu: FC<ParagraphMenuProps> = ({
  comments,
  highlights,
  onSelect,
}) => {
  return (
    <Menu horizontal>
      <MenuItem id="paragraphHighlight" onClick={onSelect}>
        <HighlightIcon />
        Highlight
        {highlights > 0 && (
          <ParagraphMenuItemBadge>&nbsp;[{highlights}]</ParagraphMenuItemBadge>
        )}
      </MenuItem>
      <MenuItem id="paragraphComment" onClick={onSelect}>
        <CommentIcon />
        Comment
        {comments > 0 && (
          <ParagraphMenuItemBadge>&nbsp;[{comments}]</ParagraphMenuItemBadge>
        )}
      </MenuItem>
    </Menu>
  );
};

export default ParagraphMenu;
