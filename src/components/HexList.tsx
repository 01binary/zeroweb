import React, { FC, PropsWithChildren } from 'react';
import styled from 'styled-components';
import {
  HideTipHandler,
  ShowTipForHandler,
  useSharedTooltip,
} from '../hooks/useTooltip';
import Cell from '../images/cell.svg';
import {
  CELL_HEIGHT,
  CELL_PATTERN,
  CELL_ROW_WIDTH,
  CELL_STRIP_HEIGHT,
  CELL_WIDTH,
} from '../constants';

const getCellStyle = (index: number) => ({
  left: `${CELL_PATTERN[index].x}px`,
  top: `${CELL_PATTERN[index].y - CELL_HEIGHT}px`,
  animation: `cellSlideIn .3s ${Math.round(
    0.1 * ((index % 2) + 1)
  )}s ease-out 1 normal forwards`,
});

const HexBorder = styled(Cell)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const HexCell = styled.li`
  position: absolute;
  width: ${CELL_WIDTH}px;
  height: ${CELL_HEIGHT}px;
  margin: 0 !important;

  transform-style: preserve-3d;
  will-change: transform, opacity;

  @keyframes cellSlideIn {
    0% {
      opacity: 0;
      transform: translate(8px, 8px);
    }

    100% {
      opacity: 1;
      transform: translate(0px, 0px);
    }
  }

  svg {
    pointer-events: none;
  }
`;

const HexLinkElement = styled.a`
  display: flex;
  align-items: center;

  position: absolute;
  width: 100%;
  height: 100%;

  svg {
    pointer-events: none;
  }

  .hex__icon {
    flex: 1;
    opacity: 0.8;
    transition: opacity ${(props) => props.theme.animationFast} ease-out;

    // Fix Safari flicker by forcing a 3D layer
    transform-style: preserve-3d;
    backface-visibility: hidden;
    will-change: transform, opacity;
  }

  &:hover {
    .hex__icon {
      opacity: 1;
    }
  }

  &:focus {
    z-index: 1;
    outline: none;
    border-radius: initial;
    box-shadow: initial;

    .stroke-border {
      stroke: ${(props) => props.theme.focusColor};
    }
  }
`;

const HexButtonElement = styled.button`
  display: flex;
  align-items: center;

  position: absolute;
  width: 100%;
  height: 100%;

  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;

  // Reset padding which differs between browsers
  padding: ${(props) => props.theme.spacingQuarter};

  cursor: pointer;

  .hex__icon {
    opacity: 0.8;
    transition: opacity ${(props) => props.theme.animationFast} ease-out;

    // Fix Safari flicker by forcing a 3D layer
    transform-style: preserve-3d;
    backface-visibility: hidden;
    will-change: transform, opacity;
  }

  &:hover {
    .hex__icon {
      opacity: 1;
    }
  }

  &:focus {
    z-index: 1;
    outline: none;
    border-radius: initial;
    box-shadow: initial;

    .stroke-border {
      stroke: ${(props) => props.theme.focusColor};
    }
  }
`;

const HexListWrapper = styled.ul<{ itemCount: number }>`
  position: relative;
  list-style-type: none;
  margin-block-end: 0;

  height: ${CELL_STRIP_HEIGHT}px;
  width: ${CELL_ROW_WIDTH}px;

  padding: 0;
  margin: ${(props) => props.theme.spacingHalf};
  margin-left: 0;
  margin-right: 0;

  ${(props) => props.itemCount > 4 && `margin-bottom: ${props.theme.spacing}`};
  ${(props) => props.itemCount > 5 && `margin-top: ${props.theme.spacing}`};
`;

export const HexList: FC<PropsWithChildren<{}>> = ({ children }) => (
  <HexListWrapper itemCount={children?.length ? children.length : 0}>
    {children}
  </HexListWrapper>
);

type HexProps = {
  index: number;
  icon: FC<{ className: string }>;
  tooltip?: string;
  showTipFor?: ShowTipForHandler;
  hideTip?: HideTipHandler;
};

type HexButtonProps = HexProps & {
  onClick?: () => void;
};

export const HexButton: FC<HexButtonProps> = ({
  index,
  tooltip,
  icon: HexIcon,
  onClick,
  showTipFor,
  hideTip,
}) => {
  const { targetRef, showTip } = useSharedTooltip(tooltip, showTipFor);
  return (
    <HexCell style={getCellStyle(index)}>
      <HexButtonElement
        ref={targetRef}
        onClick={onClick}
        onMouseOver={showTipFor ? showTip : undefined}
        onMouseOut={hideTip}
      >
        <HexBorder />
        <HexIcon className="hex__icon" />
      </HexButtonElement>
    </HexCell>
  );
};

type HexLinkProps = HexProps & {
  href: string;
  target: string;
};

export const HexLink: FC<HexLinkProps> = ({
  index,
  tooltip,
  icon: HexIcon,
  href,
  target,
  showTipFor,
  hideTip,
}) => {
  const { targetRef, showTip } = useSharedTooltip(tooltip, showTipFor);
  return (
    <HexCell style={getCellStyle(index)}>
      <HexLinkElement
        ref={targetRef}
        href={href}
        target={target}
        onMouseOver={showTipFor ? showTip : undefined}
        onMouseOut={hideTip}
      >
        <HexBorder />
        <HexIcon className="hex__icon" />
      </HexLinkElement>
    </HexCell>
  );
};
