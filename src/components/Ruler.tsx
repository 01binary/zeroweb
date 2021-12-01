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

import React, { FC, useState, useMemo } from 'react';
import styled from 'styled-components';
import Measure from 'react-measure';

export const RULER_WIDTH = 24;
export const RULER_SELECTION_GUTTER = 6;
export const RULER_ENDMARK_WIDTH = RULER_WIDTH * 2 + 4;
export const RULER_OFFSET = 245 + RULER_SELECTION_GUTTER;

const RULER_GUTTER = 8;
const RULER_HEIGHT = 24;
const RULER_MARK_HEIGHT = 52;
const RULER_SHORTMARK_WIDTH = RULER_WIDTH;
const RULER_LONGMARK_WIDTH = RULER_WIDTH + 10;

const getLineColor = (props) =>
  props.theme.isDark ? props.theme.accentShadowColor : props.theme.shadowColor;

const RulerTop = styled.div`
  position: absolute;
  top: 0;
  left: calc(
    100% -
      ${RULER_WIDTH + (RULER_ENDMARK_WIDTH - RULER_WIDTH * 2) - RULER_GUTTER}px
  );
  width: ${RULER_ENDMARK_WIDTH}px;
  height: ${RULER_HEIGHT}px;
  border-top: ${(props) => props.theme.border} solid
    ${(props) => getLineColor(props)};

  @media (max-width: ${(props) => props.theme.mobile}) {
    display: none;
  }
`;

const RulerBottom = styled.div`
  position: absolute;
  top: calc(100% - ${RULER_HEIGHT}px);
  left: calc(
    100% -
      ${RULER_WIDTH + (RULER_ENDMARK_WIDTH - RULER_WIDTH * 2) - RULER_GUTTER}px
  );
  width: ${RULER_ENDMARK_WIDTH}px;
  height: ${RULER_HEIGHT}px;
  border-bottom: ${(props) => props.theme.border} solid
    ${(props) => getLineColor(props)};

  @media (max-width: ${(props) => props.theme.mobile}) {
    display: none;
  }
`;

const RulerBase = styled.div`
  position: absolute;
  top: 0;
  left: calc(100% + ${RULER_GUTTER}px);
  width: ${RULER_WIDTH}px;
  bottom: -${(props) => props.theme.border};
  display: flex;
  flex-direction: column;
  border-right: ${(props) => props.theme.border} solid
    ${(props) => getLineColor(props)};

  @media (max-width: ${(props) => props.theme.mobile}) {
    display: none;
  }
`;

const RulerMark = styled.div`
  width: ${RULER_SHORTMARK_WIDTH}px;
  height: ${RULER_HEIGHT}px;
  flex: 1 1;
  border-bottom: ${(props) => props.theme.border} solid
    ${(props) => getLineColor(props)};

  &:nth-child(even) {
    width: ${RULER_LONGMARK_WIDTH}px;
    margin-left: -${RULER_LONGMARK_WIDTH - RULER_SHORTMARK_WIDTH}px;
  }
`;

const getRulerMarks = (height: number): string[] => {
  const count = Math.max(Math.round(height / RULER_MARK_HEIGHT - 2), 0);
  return count
    ? new Array(count).fill(0).map((unused, index) => `mark${index}`)
    : [];
};

export const Ruler: FC = () => {
  const [height, setHeight] = useState<number>(0);

  const marks = useMemo<string[]>(() => getRulerMarks(height), [height]);

  return (
    <Measure bounds onResize={({ bounds }) => setHeight(bounds.height)}>
      {({ measureRef }) => (
        <>
          <RulerTop />
          <RulerBase ref={measureRef}>
            {marks.map((mark) => (
              <RulerMark key={mark} />
            ))}
          </RulerBase>
          <RulerBottom />
        </>
      )}
    </Measure>
  );
};
