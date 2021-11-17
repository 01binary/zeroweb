import styled from 'styled-components';

export type MenuProps = {
  onSelect?: (e: React.MouseEvent) => void;
};

export const Menu = styled.div<{ vertical?: boolean }>`
  display: flex;
  flex-direction: ${props => props.vertical ? 'column' : 'row'};
  min-width: 180px;
  padding-top: 4px;
`;

export const MenuIcon = styled.div`
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
