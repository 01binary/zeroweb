import React, { FC, PropsWithChildren, useCallback } from 'react';
import styled from 'styled-components';

export type MenuProps = {
  onSelect: (id: string) => void;
};

export type MenuItemProps = MenuProps & {
  id: string;
  onMouseOver?: React.MouseEventHandler;
  onMouseOut?: React.MouseEventHandler;
};

export const Menu = styled.div<{ horizontal?: boolean; fade?: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.horizontal === true ? 'row' : 'column')};
  min-width: 180px;
  padding-top: 4px;
  ${(props) => props.fade && 'pointer-events: none'}
  ${(props) => props.fade && 'opacity: 0.7'}
`;

export const MenuItemIcon = styled.div`
  position: relative;
  display: inline;
  pointer-events: none;
  left: -4px;
  top: 0;
  width: 32px;
  height: 16px;
`;

const MenuItemButton = styled.button`
  display: flex;
  padding: 10px 16px;
  align-items: center;
  cursor: pointer;

  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;

  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  font-weight: ${(props) => props.theme.smallFontWeight};
  text-align: left;

  color: ${(props) => props.theme.foregroundColor};

  svg {
    pointer-events: none;
  }

  &:hover {
    color: ${(props) => props.theme.backgroundColor};
    background: ${(props) =>
      props.theme.isDark
        ? props.theme.primaryColor
        : props.theme.primaryDarkColor};

    .stroke-foreground {
      stroke: ${(props) => props.theme.backgroundColor};
    }

    .fill-foreground {
      fill: ${(props) => props.theme.backgroundColor};
    }

    div {
      color: ${(props) => props.theme.backgroundColor};
    }
  }
`;

export const MenuItem: FC<PropsWithChildren<MenuItemProps>> = ({
  id,
  children,
  onSelect,
  onMouseOver,
  onMouseOut,
}) => {
  const handleSelect = useCallback(
    (e: React.MouseEvent) => onSelect((e.target as HTMLButtonElement).id),
    [onSelect]
  );

  return (
    <MenuItemButton
      id={id}
      onClick={handleSelect}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {children}
    </MenuItemButton>
  );
};
