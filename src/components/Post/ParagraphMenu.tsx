import React, { FC } from 'react';
import { Menu, MenuItem, MenuProps } from '../Menu';
import CommentIcon from '../../images/comment.svg';
import HighlightIcon from '../../images/highlight.svg';

const ParagraphMenu: FC<MenuProps> = ({ onSelect }) => {
  return (
    <Menu horizontal>
      <MenuItem id="paragraphHighlight" onClick={onSelect}>
        <HighlightIcon />
        Highlight
      </MenuItem>
      <MenuItem id="paragraphComment" onClick={onSelect}>
        <CommentIcon />
        Comment
      </MenuItem>
    </Menu>
  );
};

export default ParagraphMenu;
