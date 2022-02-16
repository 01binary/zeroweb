/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Markdown paragraph with highlights and inline comments
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
import { ParagraphSelection, useCommentsContext } from '../hooks/useComments';
import { RulerMarker, RulerMarkerBadge } from './RulerMarker';
import RulerHighlightIcon from '../images/highlight.svg';
import RulerCommentIcon from '../images/comment.svg';
import AddCommentIcon from '../images/add-comment.svg';
import { RULER_ENDMARK_WIDTH } from './Ruler';
import { MOBILE, WIDE } from '../constants';
import { useBlogData } from '../hooks/useBlogData';

const getHash = (text: string): string | undefined =>
  text ? `p${stringHash(text)}` : undefined;

const nodeContains = (parent: Node, child: Node): boolean => {
  if (parent === child) return true;

  for (let node of parent.childNodes) {
    if (nodeContains(node, child)) return true;
  }

  return false;
};

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

    code {
      color: ${(props) => props.theme.backgroundColor};
      background: none;
    }
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

type ParagraphFragment = {
  tag?: string;
  text: string;
  pos: number;
  length: number;
};

type HighlightProps = {
  text: string;
  nodes: ParagraphFragment[];
  start: number;
  end: number;
};

const Highlight: FC<HighlightProps> = ({ nodes, start, end }) => {
  // Insert <mark> into span that may contain both text and HTML nodes
  const __html = nodes.reduce((html, { tag, text, pos, length }) => {
    if (start <= pos) {
      if (end < pos + length) {
        // End of highlight splits this node in half=
        const before = text.substring(0, end - pos);
        const after = text.substring(end - pos);
        if (tag) return `${html}<${tag}>${before}</MARK>${after}</${tag}>`;
        else return `${html}${before}</MARK>${after}`;
      } else {
        // Node does not interact with the highlight (appears before, after, or completely inside)
        if (tag) return `${html}<${tag}>${text}</${tag}>`;
        else return `${html}${text}`;
      }
    } else if (start > pos && start < pos + length) {
      // Start of highlight splits this node in half
      const before = text.substring(0, start - pos);
      const after = text.substring(start - pos);
      if (tag)
        return `${html}<${tag}>${before}</${tag}><MARK><${tag}>${after}</${tag}>`;
      else return `${html}${before}<MARK>${after}`;
    }
  }, '');

  return <span id="highlightAnchor" dangerouslySetInnerHTML={{ __html }} />;
};

const SelectionAnchor = styled.span<ParagraphSelection>`
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
  const highlightRef = useRef<HTMLElement>(null);
  const [innerText, setText] = useState<string | undefined>();
  const [innerNodes, setInnerNodes] = useState<ParagraphFragment[]>([]);
  const { user } = useBlogData();
  const {
    comments: reactions,
    showTipFor,
    hideTip,
    showParagraphMenu,
    hideParagraphMenu,
    highlightedParagraph,
    setHighlightedParagraph,
    paragraphSelection,
    setParagraphSelection,
  } = useCommentsContext();
  const hash = useMemo<string | undefined>(() => getHash(innerText), [
    innerText,
  ]);
  const relevant = useMemo(
    () => reactions?.filter(({ paragraph }) => paragraph === hash),
    [reactions, hash]
  );
  const highlights = relevant?.filter(({ rangeLength }) => rangeLength);
  const comments = relevant?.filter(({ markdown }) => markdown);
  const showHighlight = Boolean(highlights?.length && !comments?.length);
  const showComment = Boolean(comments?.length);
  const showMarker = showComment || showHighlight;
  const showHighlightMark = Boolean(paragraphRef.current && highlights?.length);

  const { highlightStart, highlightEnd } = useMemo(
    () =>
      (highlights ?? []).reduce(
        ({ highlightStart, highlightEnd }, { rangeStart, rangeLength }) => ({
          highlightStart: Math.min(highlightStart, rangeStart),
          highlightEnd: Math.max(highlightEnd, rangeStart + rangeLength - 1),
        }),
        {
          highlightStart: innerText ? innerText.length - 1 : 0,
          highlightEnd: 0,
        }
      ),
    [highlights, innerText]
  );

  const updateSelection = useCallback((): ParagraphSelection | undefined => {
    // Track selected text to enable highlighting or commenting on the selection
    const selection = window.getSelection();
    if (selection.rangeCount !== 1 || !paragraphRef.current) return;

    const {
      startContainer,
      startOffset,
      endContainer,
      endOffset,
    } = selection.getRangeAt(0);

    if (
      !nodeContains(paragraphRef.current, startContainer) ||
      !nodeContains(paragraphRef.current, endContainer)
    )
      return;

    let pos = 0;
    let startIndex = 0;
    let endIndex = 0;

    const updateStartEnd = (nodes: NodeListOf<ChildNode>) => {
      for (let node of nodes) {
        if (node.childNodes.length) {
          updateStartEnd(node.childNodes);
          continue;
        }

        if (nodeContains(node, startContainer)) startIndex = pos;

        if (nodeContains(node, endContainer)) {
          endIndex = pos;
          break;
        }

        if (node.nodeType === 1) pos += (node as HTMLElement).innerText.length;
        else if (node.nodeType === 3) pos += node.nodeValue.length;
      }
    };

    updateStartEnd(paragraphRef.current.childNodes);

    const start = startIndex + startOffset;
    const end = endIndex + endOffset;
    if (end <= start) return;

    const {
      left: parentLeft,
      top: parentTop,
    } = paragraphRef.current.getBoundingClientRect();

    const { left: selLeft, top: selTop, width, height } = selection
      .getRangeAt(0)
      .getBoundingClientRect();

    const paragraphSel = {
      hash,
      left: selLeft - parentLeft,
      top: selTop - parentTop,
      width,
      height,
      start,
      length: end - start,
    };

    setParagraphSelection(paragraphSel);

    return paragraphSel;
  }, [hash, setParagraphSelection]);

  const clearSelection = useCallback(() => {
    setHighlightedParagraph(null);
    setParagraphSelection(null);
    hideParagraphMenu();
  }, [setHighlightedParagraph, setParagraphSelection, hideParagraphMenu]);

  const handleSelection = useCallback(
    // Let user select a portion of the paragraph to bring up the comment/highlight menu
    (e: MouseEvent) => {
      if (!user || window.getSelection().type !== 'Range') {
        clearSelection();
        return;
      }

      if (highlightedParagraph?.hash !== hash || highlightedParagraph?.hover) {
        // New selection
        const newSelection = updateSelection();
        if (newSelection)
          setHighlightedParagraph({
            hash,
            start: newSelection.start,
            length: newSelection.length,
            hover: false,
          });
      } else if (paragraphSelection?.hash === hash) {
        const { left, top, width, height } = window
          .getSelection()
          .getRangeAt(0)
          .getBoundingClientRect();

        if (
          e.clientX < left ||
          e.clientY < top ||
          e.clientX > left + width ||
          e.clientY > top + height
        ) {
          // Clear existing selection on click outside
          clearSelection();
        } else {
          // Update or clear existing selection
          if (!updateSelection()) clearSelection();
        }
      }
    },
    [
      user,
      hash,
      highlightedParagraph,
      paragraphSelection,
      setHighlightedParagraph,
      updateSelection,
      clearSelection,
    ]
  );

  const handleHighlightMouseOver = useCallback(() => {
    if (
      !paragraphSelection &&
      (!highlightedParagraph || highlightedParagraph?.hover)
    ) {
      setHighlightedParagraph({
        hash,
        start: highlightStart,
        length: highlightEnd - highlightStart,
        hover: true,
      });
      showParagraphMenu(null, highlightRef);
    }
  }, [paragraphSelection, showParagraphMenu, setHighlightedParagraph]);

  const handleHighlightMouseOut = useCallback(() => {
    if (
      !paragraphSelection &&
      (!highlightedParagraph || highlightedParagraph?.hover)
    ) {
      setHighlightedParagraph(null);
      hideParagraphMenu();
    }
  }, [paragraphSelection, hideParagraphMenu, setHighlightedParagraph]);

  useEffect(() => {
    // Capture text and children on mount so that we can display a Highlight
    if (!paragraphRef.current || innerNodes.length) return;

    const nodes = new Array(paragraphRef.current.childNodes.length);
    let nodeIndex = 0;
    let pos = 0;

    for (let node of paragraphRef.current.childNodes) {
      if (node.nodeType === 1) {
        let element = node as HTMLElement;
        const length = element.innerText.length;
        nodes[nodeIndex++] = {
          pos,
          length,
          text: element.innerText,
          tag: element.tagName,
        };
        pos += length;
      } else if (node.nodeType === 3) {
        const length = node.nodeValue.length;
        nodes[nodeIndex++] = {
          pos,
          length,
          text: node.nodeValue,
        };
        pos += length;
      }
    }

    setText(paragraphRef.current.innerText);
    setInnerNodes(nodes);
  }, [setText]);

  useEffect(() => {
    // Set highlight ref after <mark> has been inserted for highlighted paragraph
    if (showHighlightMark && paragraphRef.current) {
      const element = paragraphRef.current.getElementsByTagName('mark')[0];
      if (!element) return;
      element.addEventListener('mouseover', handleHighlightMouseOver);
      element.addEventListener('mouseout', handleHighlightMouseOut);
      highlightRef.current = element;
    }

    return () => {
      if (highlightRef.current) {
        highlightRef.current.removeEventListener(
          'mouseover',
          handleHighlightMouseOver
        );
        highlightRef.current.removeEventListener(
          'mouseout',
          handleHighlightMouseOut
        );
        highlightRef.current = null;
      }
    };
  }, [showHighlightMark, handleHighlightMouseOver, handleHighlightMouseOut]);

  useEffect(() => {
    // Show menu when paragraph text is selected
    if (paragraphSelection && paragraphSelection?.hash === hash)
      showParagraphMenu(null, selectionRef);
  }, [hash, paragraphSelection, showParagraphMenu]);

  useEffect(() => {
    // Clear selection and hide menu when paragraph no longer highlighted
    if (
      paragraphSelection?.hash === hash &&
      highlightedParagraph?.hash !== hash &&
      window.getSelection().type !== 'Range'
    ) {
      setParagraphSelection(null);
      hideParagraphMenu();
    }
  }, [
    hash,
    highlightedParagraph,
    paragraphSelection,
    setParagraphSelection,
    hideParagraphMenu,
  ]);

  return (
    <Text id={hash} onMouseUp={handleSelection}>
      <span ref={paragraphRef}>
        {showHighlightMark ? (
          <Highlight
            text={innerText}
            nodes={innerNodes}
            start={highlightStart}
            end={highlightEnd}
          />
        ) : (
          children
        )}
      </span>

      {paragraphSelection?.hash === hash && (
        <SelectionAnchor ref={selectionRef} {...paragraphSelection} />
      )}

      <InlineCommentButton
        ref={commentButtonRef}
        onMouseOver={() => showTipFor(null, commentButtonRef)}
        onMouseOut={() => hideTip()}
      >
        <AddCommentIcon />
      </InlineCommentButton>

      {showMarker && (
        <RulerMarker className="paragraph__ruler-marker">
          {showHighlight && (
            <>
              <RulerHighlightIcon />
              {highlights.length > 1 && (
                <RulerMarkerBadge className="paragraph__ruler-marker__badge">
                  {highlights.length}
                </RulerMarkerBadge>
              )}
            </>
          )}
          {showComment && (
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
