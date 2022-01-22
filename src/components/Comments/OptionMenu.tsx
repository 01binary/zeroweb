import React, { FC } from 'react';
import { Menu, MenuItem, MenuItemIcon, MenuProps } from '../Menu';
import EditIcon from '../../images/edit.svg';
import DeleteIcon from '../../images/delete.svg';

const OptionMenu: FC<MenuProps> = ({ onSelect }) => (
  <Menu>
    <MenuItem id="editComment" onClick={onSelect}>
      <MenuItemIcon>
        <EditIcon />
      </MenuItemIcon>
      Edit
    </MenuItem>
    <MenuItem id="deleteComment" onClick={onSelect}>
      <MenuItemIcon>
        <DeleteIcon />
      </MenuItemIcon>
      Delete
    </MenuItem>
  </Menu>
);

export default OptionMenu;
