/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Renders a paragraph of text
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, {
  FC,
  useLayoutEffect,
  useRef,
  useState,
  useMemo
} from 'react';
import styled from 'styled-components';

export const RULER_SELECTION_GUTTER = 6;
export const RULER_OFFSET = 245 + RULER_SELECTION_GUTTER;

const RULER_GUTTER = 8;
const RULER_WIDTH = 24;
const RULER_HEIGHT = 24;
const RULER_MARK_HEIGHT = 134;
const RULER_ENDMARK_WIDTH = RULER_WIDTH * 2 + 5;
const RULER_SHORTMARK_WIDTH = RULER_WIDTH;
const RULER_LONGMARK_WIDTH = RULER_WIDTH + 10;

const RulerTop = styled.div`
  position: absolute;
  top: 0;
  left: calc(100% - ${RULER_WIDTH + (RULER_ENDMARK_WIDTH - RULER_WIDTH * 2) - RULER_GUTTER}px);
  width: ${RULER_ENDMARK_WIDTH}px;
  height: ${RULER_HEIGHT}px;
  border-top: ${props => props.theme.border} solid ${props => props.theme.shadowColor};

  @media (max-width: ${props => props.theme.mobile}) {
    display: none;
  }
`;

const RulerBottom = styled.div`
  position: absolute;
  top: calc(100% - ${RULER_HEIGHT}px - ${props => props.theme.spacingDouble} * 2.5);
  left: calc(100% - ${RULER_WIDTH + (RULER_ENDMARK_WIDTH - RULER_WIDTH * 2) - RULER_GUTTER}px);
  width: ${RULER_ENDMARK_WIDTH}px;
  height: ${RULER_HEIGHT}px;
  border-bottom: ${props => props.theme.border} solid ${props => props.theme.shadowColor};

  @media (max-width: ${props => props.theme.mobile}) {
    display: none;
  }
`;

const RulerBase = styled.div`
  position: absolute;
  top: 0;
  left: calc(100% + ${RULER_GUTTER}px);
  width: ${RULER_WIDTH}px;
  bottom: calc(${props => props.theme.spacingDouble} * 2.5 - ${props => props.theme.border});
  display: flex;
  flex-direction: column;
  border-right: ${props => props.theme.border} solid ${props => props.theme.shadowColor};

  @media (max-width: ${props => props.theme.mobile}) {
    display: none;
  }
`;

const RulerMark = styled.div`
  width: ${RULER_SHORTMARK_WIDTH}px;
  height: ${RULER_HEIGHT}px;
  flex: 1 1;
  border-bottom: ${props => props.theme.border} solid ${props => props.theme.shadowColor};

  &:nth-child(even) {
    width: ${RULER_LONGMARK_WIDTH}px;
    margin-left: -${RULER_LONGMARK_WIDTH - RULER_SHORTMARK_WIDTH}px;
  }
`;

const getRulerMarks = (height: number): string[] => {
  const count = Math.max(Math.round((height / RULER_MARK_HEIGHT) - 1), 0);
  return count
    ? new Array(count)
      .fill(0)
      .map((unused, index) => `mark${index}`)
    : [];
};

export const Ruler: FC = () => {
  const rulerRef = useRef();
  const [ pageHeight, setPageHeight ] = useState<number>();

  useLayoutEffect(() => {
    setPageHeight(rulerRef.current?.clientHeight || 0);
  }, [ rulerRef, setPageHeight ]);

  const marks = useMemo<string[]>(
    () => getRulerMarks(pageHeight),
    [ pageHeight ]);

  return (
    <>
      <RulerTop />
      <RulerBase ref={rulerRef}>
        {marks.map(mark => <RulerMark key={mark} />)}
      </RulerBase>
      <RulerBottom />
    </>
  );
};
