import React, { FC, useState } from 'react';
import styled from 'styled-components';
import EditIcon from '../../images/edit.svg';
import DeleteIcon from '../../images/delete.svg';
import ReactionLolIcon from '../../images/reaction-lol.svg';
import ReactionWowIcon from '../../images/reaction-wow.svg';
import ReactionConfusedIcon from '../../images/reaction-confused.svg';
import ReactionPartyIcon from '../../images/reaction-party.svg';
import ReactionSnapIcon from '../../images/reaction-snap.svg';

type MenuProps = {
  vertical?: boolean;
};

const Menu = styled.div<MenuProps>`
  display: flex;
  flex-direction: ${props => props.vertical ? 'column' : 'row'};
  min-width: 180px;
  padding-top: 4px;
`;

const OptionMenuIcon = styled.div`
  position: relative;
  display: inline;
  pointer-events: none;
  left: -4px;
  top: 0;
  width: 32px;
  height: 16px;
`;

const MenuItem = styled.button`
  display: flex;
  padding: 10px 16px;
  cursor: pointer;

  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;

  font-family: ${props => props.theme.smallFont};
  font-size: ${props => props.theme.smallFontSize};
  font-weight: ${props => props.theme.smallFontWeight};
  text-align: left;

  color: ${props => props.theme.foregroundColor};

  &:hover {
    color: ${props => props.theme.backgroundColor};
    background: ${props => props.theme.isDark
      ? props.theme.primaryColor
      : props.theme.primaryDarkColor
    };

    .stroke-foreground {
      stroke: ${props => props.theme.backgroundColor};
    }

    .fill-foreground {
      fill: ${props => props.theme.backgroundColor};
    }
  }
`;

type CommentMenuProps = {
  onSelect?: (e: React.MouseEvent) => void;
};

export const OptionMenu: FC<CommentMenuProps> = ({ onSelect }) => (
  <Menu vertical>
    <MenuItem id="editComment" onClick={onSelect}>
      <OptionMenuIcon>
        <EditIcon />
      </OptionMenuIcon>
      Edit
    </MenuItem>
    <MenuItem id="deleteComment" onClick={onSelect}>
      <OptionMenuIcon>
        <DeleteIcon />
      </OptionMenuIcon>
      Delete
    </MenuItem>
  </Menu>
);

const ReactionDescription = styled.div`
  padding: 10px 16px;
  min-height: 1em;
  max-height: 1em;
`;

export const ReactionMenu: FC<CommentMenuProps> = ({ onSelect }) => {
  const [ reaction, setReaction ] = useState<string>(null);
  return (
    <Menu vertical>
      <ReactionDescription>
        {reaction}
        {!reaction && 'choose a reaction'}
      </ReactionDescription>
      <Menu>
        <MenuItem
          id="snap"
          onMouseOver={() => setReaction('snap!')}
          onMouseOut={() => setReaction(null)}
          onClick={onSelect}
        >
          <ReactionSnapIcon />
        </MenuItem>
        <MenuItem
          id="party"
          onMouseOver={() => setReaction('four loko')}
          onMouseOut={() => setReaction(null)}
          onClick={onSelect}
        >
          <ReactionPartyIcon />
        </MenuItem>
        <MenuItem
          id="lol"
          onMouseOver={() => setReaction('lol')}
          onMouseOut={() => setReaction(null)}
          onClick={onSelect}
        >
          <ReactionLolIcon />
        </MenuItem>
        <MenuItem
          id="wow"
          onMouseOver={() => setReaction('surprised')}
          onMouseOut={() => setReaction(null)}
          onClick={onSelect}
        >
          <ReactionWowIcon />
        </MenuItem>
        <MenuItem
          id="confused"
          onMouseOver={() => setReaction('confused')}
          onMouseOut={() => setReaction(null)}
          onClick={onSelect}
        >
          <ReactionConfusedIcon />
        </MenuItem>
      </Menu>
    </Menu>
  );
};
