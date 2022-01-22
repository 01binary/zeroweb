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

import React, { FC, useRef, useMemo, useCallback, useState } from 'react';
import stringHash from 'string-hash';
import styled from 'styled-components';
import { useCommentsContext } from '../hooks/useComments';
import { RulerMarker, RulerMarkerBadge } from './RulerMarker';
import RulerHighlightIcon from '../images/highlight.svg';
import RulerCommentIcon from '../images/comment.svg';
import AddCommentIcon from '../images/add-comment.svg';
import { RULER_ENDMARK_WIDTH } from './Ruler';
import { MOBILE, WIDE } from '../constants';

const Text = styled.p`
  position: relative;

  margin-right: calc(
    -30% - ${RULER_ENDMARK_WIDTH}px - ${(props) => props.theme.borderThick} - ${(props) => props.theme.spacingOneAndHalf}
  );
  padding-right: calc(
    30% + ${RULER_ENDMARK_WIDTH}px + ${(props) => props.theme.borderThick} +
      ${(props) => props.theme.spacingOneAndHalf}
  );

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: ${(props) => props.theme.spacingOneAndHalf};
    width: calc(${(props) => props.theme.border} * 1.5);
    height: 100%;
    background: ${(props) => props.theme.foregroundColor};
    opacity: 0.4;
    transition: opacity ${(props) => props.theme.animationFast} ease-out;
    z-index: -1;
  }

  &:hover:after {
    opacity: 1;
  }

  &:hover button {
    opacity: 1;
  }

  &:hover .paragraph__ruler-marker {
    display: none;
  }

  code {
    position: relative;
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
      'Courier New', monospace;
    font-size: medium;
    background: ${(props) =>
      props.theme.isDark
        ? props.theme.dropShadowDarkColor
        : props.theme.accentLightColor};
    padding: ${(props) => props.theme.spacingQuarter};
    pointer-events: none;
  }

  mark {
    background-color: ${(props) => props.theme.secondaryColor};
    color: ${(props) => props.theme.backgroundColor};
    padding: 4px 0;
    pointer-events: none;
  }

  @media (max-width: ${WIDE}) {
    &:after {
      display: none;
    }
  }

  @media (max-width: ${MOBILE}) {
    padding-right: 0;
    margin-right: ${(props) => props.theme.spacingHalf};

    .paragraph__ruler-marker {
      display: none;
    }
  }
`;

const InlineCommentButton = styled.button`
  position: absolute;
  width: 32px;
  height: 32px;
  top: calc(0px - ${(props) => props.theme.borderThick});
  right: 0.25em;
  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;
  padding: 0;
  opacity: 0;
  transition: opacity ${(props) => props.theme.animationFast} ease-out;

  // Flickers on Safari due to opacity
  transform-style: preserve-3d;
  backface-visibility: hidden;

  @media (max-width: ${WIDE}) {
    display: none;
  }
`;

const getText = (children: any): string => {
  if (typeof children === 'string') {
    return children;
  } else if (Array.isArray(children)) {
    return children
      .map((el) => {
        if (typeof el === 'string') {
          return el;
        } else {
          return '';
        }
      })
      .join('');
  } else {
    return '';
  }
};

const getHash = (text: string): string => `p${stringHash(text)}`;

type TextSelection = {
  start: number;
  end: number;
};

type MarkedTextProps = {
  text: string;
  selection?: TextSelection;
  start?: number;
  end?: number;
};

const MarkedText = React.forwardRef<HTMLElement, MarkedTextProps>(
  ({ text, selection, start, end }, ref) => {
    const startSel = selection ? selection.start : start;
    const endSel = selection ? selection.end : end;

    if (
      !text ||
      startSel === undefined ||
      endSel === undefined ||
      startSel < 0 ||
      endSel >= text.length
    )
      return <mark ref={ref}>{text}</mark>;

    const before = text.slice(0, startSel);
    const highlight = text.slice(startSel, endSel + 1);
    const after = text.slice(endSel + 1);

    return (
      <span>
        {before}
        <mark ref={ref}>{highlight}</mark>
        {after}
      </span>
    );
  }
);

const Paragraph: FC = ({ children }) => {
  const commentButtonRef = useRef<HTMLElement>(null);
  const paragraphRef = useRef<HTMLElement>(null);
  const selectionRef = useRef<HTMLElement>(null);
  const {
    comments: reactions,
    showTipFor,
    hideTip,
    showParagraphMenu,
    hideParagraphMenu,
  } = useCommentsContext();
  const [selection, setSelection] = useState<TextSelection>(null);
  const text = useMemo(() => getText(children), [children]);
  const hash = getHash(text);
  const relevant = reactions?.filter(({ paragraph }) => paragraph === hash);
  const highlights = relevant?.filter(({ rangeLength }) => rangeLength);
  const comments = relevant?.filter(({ markdown }) => markdown);
  const displayHighlight = Boolean(highlights?.length && !comments?.length);
  const displayComment = Boolean(comments?.length);
  const displayMarker = displayComment || displayHighlight;
  const displayMark = Boolean(text.length && (highlights?.length || selection));

  const { start, end } = useMemo(
    () =>
      (highlights ?? []).reduce(
        ({ start, end }, { rangeStart, rangeLength }) => ({
          start: Math.min(start, rangeStart),
          end: Math.max(end, rangeStart + rangeLength - 1),
        }),
        { start: text.length - 1, end: 0 }
      ),
    [highlights, text]
  );

  const handleShowParagraphMarkMenu = useCallback(() => {
    if (selectionRef.current === null)
      setTimeout(handleShowParagraphMarkMenu, 100);
    else showParagraphMenu(null, selectionRef);
  }, [showParagraphMenu]);

  const handleShowParagraphMenu = useCallback(
    (e: MouseEvent) => {
      selectionRef.current = null;
      setSelection(null);
      hideParagraphMenu();

      const { type, anchorOffset, extentOffset } = window.getSelection();

      if (e.button || type !== 'Range' || !anchorOffset || !extentOffset)
        return;

      e.preventDefault();
      setSelection({ start: anchorOffset, end: extentOffset });
      handleShowParagraphMarkMenu();
    },
    [showParagraphMenu, hideParagraphMenu]
  );

  return (
    <Text id={hash} ref={paragraphRef} onMouseUp={handleShowParagraphMenu}>
      {displayMark ? (
        <MarkedText
          text={text}
          selection={selection}
          start={start}
          end={end}
          ref={selectionRef}
        />
      ) : (
        children
      )}

      <InlineCommentButton
        ref={commentButtonRef}
        onMouseOver={() => showTipFor(null, commentButtonRef)}
        onMouseOut={() => hideTip()}
      >
        <AddCommentIcon />
      </InlineCommentButton>

      {displayMarker && (
        <RulerMarker className="paragraph__ruler-marker">
          {displayHighlight && (
            <>
              <RulerHighlightIcon />
              {highlights.length > 1 && (
                <RulerMarkerBadge className="paragraph__ruler-marker__badge">
                  {highlights.length}
                </RulerMarkerBadge>
              )}
            </>
          )}
          {displayComment && (
            <>
              <RulerCommentIcon />
              {comments.length > 1 && (
                <RulerMarkerBadge className="paragraph__ruler-marker__badge">
                  {comments.length}
                </RulerMarkerBadge>
              )}
            </>
          )}
        </RulerMarker>
      )}
    </Text>
  );
};

export default Paragraph;
