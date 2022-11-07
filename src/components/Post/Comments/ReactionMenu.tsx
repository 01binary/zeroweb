import React, { FC, useState } from 'react';
import { Menu, MenuItem, MenuProps } from '../../../components/Menu';
import ReactionLolIcon from '../../../images/reaction-lol.svg';
import ReactionWowIcon from '../../../images/reaction-wow.svg';
import ReactionConfusedIcon from '../../../images/reaction-confused.svg';
import ReactionPartyIcon from '../../../images/reaction-party.svg';
import ReactionSnapIcon from '../../../images/reaction-snap.svg';
import { CommentReactionDescription } from './Comments.styles';

const ReactionMenu: FC<MenuProps> = ({ onSelect }) => {
  const [reaction, setReaction] = useState<string | null>(null);
  return (
    <Menu>
      <CommentReactionDescription>
        {reaction}
        {!reaction && 'choose a reaction'}
      </CommentReactionDescription>
      <Menu horizontal>
        <MenuItem
          id="snap"
          onMouseOver={() => setReaction('snap!')}
          onMouseOut={() => setReaction(null)}
          onSelect={onSelect}
        >
          <ReactionSnapIcon />
        </MenuItem>
        <MenuItem
          id="party"
          onMouseOver={() => setReaction('four loko')}
          onMouseOut={() => setReaction(null)}
          onSelect={onSelect}
        >
          <ReactionPartyIcon />
        </MenuItem>
        <MenuItem
          id="lol"
          onMouseOver={() => setReaction('lol')}
          onMouseOut={() => setReaction(null)}
          onSelect={onSelect}
        >
          <ReactionLolIcon />
        </MenuItem>
        <MenuItem
          id="wow"
          onMouseOver={() => setReaction('surprised')}
          onMouseOut={() => setReaction(null)}
          onSelect={onSelect}
        >
          <ReactionWowIcon />
        </MenuItem>
        <MenuItem
          id="confused"
          onMouseOver={() => setReaction('confused')}
          onMouseOut={() => setReaction(null)}
          onSelect={onSelect}
        >
          <ReactionConfusedIcon />
        </MenuItem>
      </Menu>
    </Menu>
  );
};

export default ReactionMenu;
