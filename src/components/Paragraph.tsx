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
  useRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from 'react';
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

type MarkedTextProps = {
  text: string;
  start?: number;
  end?: number;
};

const MarkedText = React.forwardRef<HTMLElement, MarkedTextProps>(
  ({ text, start, end }, ref) => {
    if (
      !text ||
      start === undefined ||
      end === undefined ||
      start < 0 ||
      end >= text.length
    )
      return <mark ref={ref}>{text}</mark>;

    const before = text.slice(0, start);
    const highlight = text.slice(start, end + 1);
    const after = text.slice(end + 1);

    return (
      <>
        {before}
        <mark ref={ref}>{highlight}</mark>
        {after}
      </>
    );
  }
);

type TrackHighlight = {
  left: number;
  top: number;
  width: number;
  height: number;
  start: number;
  length: number;
};

const Selection = styled.span<TrackHighlight>`
  display: block;
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  background: none;
  pointer-events: none;
`;

const Paragraph: FC = ({ children }) => {
  const commentButtonRef = useRef<HTMLElement>(null);
  const paragraphRef = useRef<HTMLElement>(null);
  const selectionRef = useRef<HTMLElement>(null);
  const [highlight, setHighlight] = useState<TrackHighlight | null>(null);
  const [lastHighlight, setLastHighlight] = useState<string | null>(null);
  const {
    comments: reactions,
    showTipFor,
    hideTip,
    showParagraphMenu,
    hideParagraphMenu,
    highlightedParagraph,
    setHighlightedParagraph,
  } = useCommentsContext();
  const text = useMemo(() => getText(children), [children]);
  const hash = getHash(text);
  const relevant = reactions?.filter(({ paragraph }) => paragraph === hash);
  const highlights = relevant?.filter(({ rangeLength }) => rangeLength);
  const comments = relevant?.filter(({ markdown }) => markdown);
  const displayHighlight = Boolean(highlights?.length && !comments?.length);
  const displayComment = Boolean(comments?.length);
  const displayMarker = displayComment || displayHighlight;
  const displayMark = Boolean(text.length && highlights?.length);

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

  const updateHighlight = useCallback(() => {
    const selection = window.getSelection();
    const { anchorOffset, extentOffset, rangeCount } = selection;

    if (
      rangeCount &&
      extentOffset &&
      anchorOffset !== extentOffset &&
      paragraphRef.current
    ) {
      const {
        left: parentLeft,
        top: parentTop,
      } = paragraphRef.current.getBoundingClientRect();

      const {
        left: selLeft,
        top: selTop,
        width,
        height,
      } = selection.getRangeAt(0).getBoundingClientRect();

      const track = {
        left: selLeft - parentLeft,
        top: selTop - parentTop,
        width,
        height,
        start: anchorOffset,
        length: extentOffset - anchorOffset,
      };

      setHighlight(track);
    }
  }, [setHighlight]);

  const handleHighlight = useCallback(
    (e) => {
      if (highlightedParagraph && window.getSelection().type !== 'Range') {
        setHighlightedParagraph(null);
        setHighlight(null);
        return;
      }

      e.preventDefault();

      if (highlightedParagraph !== hash) {
        updateHighlight();
        setHighlightedParagraph(hash);
      } else if (highlight) {
        updateHighlight();
      }
    },
    [highlightedParagraph, setHighlightedParagraph]
  );

  useEffect(() => {
    // Clear highlight when another paragraph was highlighted
    if (highlightedParagraph !== hash) setHighlight(null);
  }, [highlightedParagraph, setHighlight, setHighlightedParagraph]);

  useEffect(() => {
    // Toggle paragraph menu
    if (highlightedParagraph === lastHighlight) return;

    if (highlightedParagraph === hash && highlight) {
      showParagraphMenu(null, selectionRef);
    } else if (lastHighlight === hash && !highlight) {
      hideParagraphMenu();
    } else if (highlightedParagraph === null) {
      hideParagraphMenu();
    }

    setLastHighlight(highlightedParagraph);
  }, [highlightedParagraph, showParagraphMenu, hideParagraphMenu]);

  return (
    <Text id={hash} ref={paragraphRef} onMouseUp={handleHighlight}>
      {displayMark ? (
        <MarkedText text={text} start={start} end={end} />
      ) : (
        children
      )}

      {highlight && <Selection ref={selectionRef} {...highlight} />}

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
