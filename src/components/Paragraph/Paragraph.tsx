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
import RulerHighlightIcon from '../../images/highlight.svg';
import RulerCommentIcon from '../../images/comment.svg';
import AddCommentIcon from '../../images/add-comment.svg';
import { RulerMarker, RulerMarkerBadge } from '../RulerMarker';
import { InlineComments } from '../InlineComments';
import {
  CommentButton,
  ParagraphWrapper,
  ParagraphText,
  SelectionAnchor,
  ActiveParagraphHighlight,
} from './Paragraph.styles';
import {
  ParagraphSelection,
  useCommentsContext,
} from '../../hooks/useComments';

// How long to wait before hiding paragraph highlight menu
const HIGHLIGHT_MOUSEOVER_TIMEOUT = 1500;

// Get unique paragraph identifier given paragraph text
const getHash = (text: string): string | undefined =>
  text ? `p${stringHash(text)}` : undefined;

// Determine if a text node contains another text node
const nodeContains = (parent: Node, child: Node): boolean => {
  if (parent === child) return true;

  for (let node of parent.childNodes) {
    if (nodeContains(node, child)) return true;
  }

  return false;
};

type ParagraphFragment = {
  tag?: string;
  text: string;
  pos: number;
  length: number;
};

const ParagraphHighlight: FC<{
  text: string;
  nodes: ParagraphFragment[];
  start: number;
  end: number;
}> = ({ nodes, start, end }) => {
  // Insert <mark> into span that may contain both text and HTML nodes
  const __html = nodes.reduce((html, { tag, text, pos, length }, index) => {
    if (start <= pos) {
      if (end < pos + length) {
        // Highlight ends in this node
        if (start === 0) {
          // Highlight begins at the start of the node
          const highlight = text.substring(0, end - pos + 1);
          const after = text.substring(end - pos + 1);
          return tag
            ? `${html}<${tag}><MARK>${highlight}</MARK>${after}</${tag}>`
            : `${html}<MARK>${highlight}</MARK>${after}`;
        } else {
          // End of highlight splits this node
          const before = text.substring(0, end - pos);
          const after = text.substring(end - pos);
          return tag
            ? `${html}<${tag}>${before}</MARK>${after}</${tag}>`
            : `${html}${before}</MARK>${after}`;
        }
      } else {
        // Node does not interact with the highlight (appears before, after, or completely inside)
        return tag ? `${html}<${tag}>${text}</${tag}>` : `${html}${text}`;
      }
    } else if (start > pos && start < pos + length) {
      // Start of highlight splits this node
      const before = text.substring(0, start - pos);

      if (index + 1 === nodes.length) {
        // Highlight ends in this node
        const highlight = text.substring(start - pos, end - pos + 1);
        const after = text.substring(end - pos + 1);
        return tag
          ? `${html}<${tag}>${before}<MARK>${highlight}</MARK>${after}</${tag}>`
          : `${html}${before}<MARK>${highlight}</MARK>${after}`;
      } else {
        // Highlight ends in the next node
        const after = text.substring(start - pos);
        return tag
          ? `${html}<${tag}>${before}</${tag}><MARK><${tag}>${after}</${tag}>`
          : `${html}${before}<MARK>${after}`;
      }
    }
  }, '');

  return <span id="highlightAnchor" dangerouslySetInnerHTML={{ __html }} />;
};

const Paragraph: FC = ({ children }) => {
  const commentButtonRef = useRef<HTMLElement>(null);
  const paragraphRef = useRef<HTMLElement>(null);
  const selectionRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLElement>(null);
  const inlineCommentRef = useRef<HTMLTextAreaElement>(null);
  const [innerText, setText] = useState<string | undefined>();
  const [innerNodes, setInnerNodes] = useState<ParagraphFragment[]>([]);

  const {
    postUrl,
    comments: allReactions,
    highlightTimerRef,
    postContentRef,
    loading,
    showTipFor,
    hideTip,
    showParagraphMenu,
    hideParagraphMenu,
    highlightedParagraph,
    setHighlightedParagraph,
    paragraphSelection,
    setParagraphSelection,
    inlineCommentParagraph,
    setInlineCommentParagraph,
    toggleInlineComment,
    addInlineComment,
    showCommentsSidebar,
    inlineCommentSingleMode,
  } = useCommentsContext();

  const hash = useMemo<string | undefined>(() => getHash(innerText), [
    innerText,
  ]);

  const reactions = useMemo(
    () => allReactions?.filter(({ paragraph }) => paragraph === hash),
    [allReactions, hash]
  );

  const highlights = reactions?.filter(({ rangeLength }) => rangeLength);
  const comments = reactions?.filter(({ markdown }) => markdown);
  const hasHighlights = Boolean(highlights?.length && !comments?.length);
  const hasComments = Boolean(comments?.length);
  const showMarker = hasComments || hasHighlights;
  const showHighlightMark = Boolean(paragraphRef.current && highlights?.length);
  const anotherCommentThreadPinned =
    inlineCommentSingleMode && inlineCommentParagraph?.hash !== hash;
  const showInlineCommentForm = Boolean(inlineCommentParagraph?.hash === hash);
  const showInlineCommentThread = Boolean(
    showCommentsSidebar &&
      !anotherCommentThreadPinned &&
      (hasComments || showInlineCommentForm)
  );

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
    // Track selected text to enable highlighting or commenting on this paragraph
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
    // Hide paragraph menu when text selection is cleared
    setHighlightedParagraph(null);
    setParagraphSelection(null);
    hideParagraphMenu();
  }, [setHighlightedParagraph, setParagraphSelection, hideParagraphMenu]);

  const handleSelection = useCallback(
    // Let user select a portion of the paragraph to show paragraph comment/highlight menu
    (e: MouseEvent) => {
      if (window.getSelection().type !== 'Range') {
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
        // Has existing selection
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
      if (highlightTimerRef.current) {
        window.clearTimeout(highlightTimerRef.current);
        highlightTimerRef.current = 0;
      }

      setHighlightedParagraph({
        hash,
        start: highlightStart,
        length: highlightEnd - highlightStart,
        hover: true,
      });
      showParagraphMenu(null, highlightRef);
    }
  }, [
    paragraphSelection,
    highlightStart,
    highlightEnd,
    showParagraphMenu,
    setHighlightedParagraph,
  ]);

  const handleHighlightMouseOut = useCallback(() => {
    if (
      !paragraphSelection &&
      (!highlightedParagraph || highlightedParagraph?.hover)
    ) {
      highlightTimerRef.current = window.setTimeout(() => {
        setHighlightedParagraph(null);
        hideParagraphMenu();
      }, HIGHLIGHT_MOUSEOVER_TIMEOUT);
    }
  }, [paragraphSelection, hideParagraphMenu, setHighlightedParagraph]);

  useEffect(() => {
    // Set focus on inline comment textbox when adding inline comment
    if (inlineCommentParagraph?.hash === hash && inlineCommentRef.current)
      inlineCommentRef.current.focus();
  }, [hash, inlineCommentParagraph]);

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

    if (paragraphRef.current.innerText.length)
      setText(paragraphRef.current.innerText);
    else setText(paragraphRef.current.innerHTML);

    setInnerNodes(nodes);
  }, [setText]);

  useEffect(() => {
    // Show paragraph menu on mouse over if this paragraph is highlighted
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
    // Show paragraph menu when text is selected
    if (paragraphSelection && paragraphSelection?.hash === hash)
      showParagraphMenu(null, selectionRef);
  }, [hash, paragraphSelection, showParagraphMenu]);

  useEffect(() => {
    // Clear selection and hide paragraph menu when no longer highlighted
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
    <ParagraphWrapper
      showCommentsSidebar={showCommentsSidebar}
      editingComment={showInlineCommentForm}
    >
      <ParagraphText id={hash} onMouseUp={handleSelection} ref={paragraphRef}>
        {showInlineCommentForm ? (
          <ActiveParagraphHighlight>{children}</ActiveParagraphHighlight>
        ) : showHighlightMark ? (
          <ParagraphHighlight
            text={innerText}
            nodes={innerNodes}
            start={highlightStart}
            end={highlightEnd}
          />
        ) : (
          children
        )}
      </ParagraphText>

      {paragraphSelection?.hash === hash && (
        <SelectionAnchor ref={selectionRef} {...paragraphSelection} />
      )}

      <CommentButton
        className="paragraph__comment-button"
        ref={commentButtonRef}
        onClick={() => toggleInlineComment(hash)}
        onMouseOver={() => showTipFor('comment', commentButtonRef)}
        onMouseOut={() => hideTip()}
      >
        <AddCommentIcon />
      </CommentButton>

      {showInlineCommentThread && (
        <InlineComments
          {...{
            className: 'paragraph__comment-thread',
            postUrl,
            loading,
            paragraphComments: comments,
            showInlineCommentForm,
            inlineCommentParagraph,
            inlineCommentRef,
            postContentRef,
            toggleInlineComment,
            addInlineComment,
            setInlineCommentParagraph,
            showTipFor,
            hideTip,
          }}
        />
      )}

      {showMarker && (
        <RulerMarker className="paragraph__ruler-marker">
          {hasHighlights && (
            <>
              <RulerHighlightIcon />
              {highlights.length > 1 && (
                <RulerMarkerBadge className="paragraph__ruler-marker__badge">
                  {highlights.length}
                </RulerMarkerBadge>
              )}
            </>
          )}
          {hasComments && (
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
    </ParagraphWrapper>
  );
};

export default Paragraph;
