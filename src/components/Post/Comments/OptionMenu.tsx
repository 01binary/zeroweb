import React, { FC } from 'react';
import {
  Menu,
  MenuItem,
  MenuItemIcon,
  MenuProps,
} from '../../../components/Menu';
import EditIcon from '../../../images/edit.svg';
import DeleteIcon from '../../../images/delete.svg';

const OptionMenu: FC<MenuProps> = ({ onSelect }) => (
  <Menu>
    <MenuItem id="editComment" onSelect={onSelect}>
      <MenuItemIcon>
        <EditIcon />
      </MenuItemIcon>
      Edit
    </MenuItem>
    <MenuItem id="deleteComment" onSelect={onSelect}>
      <MenuItemIcon>
        <DeleteIcon />
      </MenuItemIcon>
      Delete
    </MenuItem>
  </Menu>
);

export default OptionMenu;
