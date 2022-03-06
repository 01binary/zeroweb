import styled from 'styled-components';

export type MenuProps = {
  onSelect?: (e: React.MouseEvent) => void;
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

export const MenuItem = styled.button`
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
