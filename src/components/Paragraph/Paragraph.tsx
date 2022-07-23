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
import { InlineComments } from './InlineComments';
import {
  CommentButton,
  ParagraphWrapper,
  ParagraphText,
  ParagraphNonText,
  SelectionAnchor,
  ActiveParagraphTextHighlight,
  ActiveParagraphListHighlight,
} from './Paragraph.styles';
import {
  ParagraphSelection,
  useCommentsContext,
} from '../../hooks/useComments';

// How long to wait before hiding paragraph highlight menu
const HIGHLIGHT_MOUSEOVER_TIMEOUT = 100;

/**
 * Get unique paragraph identifier given paragraph text
 * @param text - The paragraph text or html
 * @returns The hash of the text or html
 */
const getHash = (text: string): string | undefined =>
  text ? `p${stringHash(text)}` : undefined;

/**
 * Determine if a text node contains another text node
 * @param parent - The parent to search
 * @param child - The child to find in parent
 * @returns Whether parent node contains a given child node
 */
const nodeContains = (parent: Node, child: Node): boolean => {
  if (parent === child) return true;

  for (let node of parent.childNodes) {
    if (nodeContains(node, child)) return true;
  }

  return false;
};

/**
 * Determine whether an element has text content
 * @param el - The element to inspect
 * @returns Whether element has text
 */
const containsText = (el: HTMLElement): boolean => Boolean(el.innerText.length);

/**
 * Determine whether an element contains a list
 * @param el - The element to inspect
 * @returns Whether the element contains a list
 */
const containsList = (el: HTMLElement): boolean =>
  el.innerHTML.indexOf('<ul') >= 0 || el.innerHTML.indexOf('<ol') >= 0;

/**
 * Determine whether inner HTML contains a list
 * @param text - The element HTML
 * @returns Whether the element HTML contains a list
 */
const textContainsList = (text: string): boolean =>
  text?.indexOf('<ul') >= 0 || text?.indexOf('<ol') >= 0;

/**
 * Determine whether inner HTML contains an image
 * @param html - The element HTML
 * @returns Whether the element HTML contains an image
 */
const textContainsImage = (html: string): boolean =>
  html?.indexOf('gatsby-resp-image-wrapper') >= 0;

/**
 * Determine whether inner HTML contains video
 * @param html - The element HTML
 * @returns Whether the element HTML contains a video
 */
const textContainsVideo = (html: string): boolean =>
  html?.indexOf('iframe') >= 0;

/**
 * Highlights a paragraph currently being manipulated by user
 * @param isList: whether the paragraph contains an ordered or unordered list
 * @param isImage: whether the paragraph contains an image
 * @returns The paragraph contents wrapped in a highlight
 */
const ActiveParagraphHighlight: FC<{
  isList: boolean;
  isImage: boolean;
  isVideo: boolean;
}> = ({ children, isList, isImage, isVideo }) =>
  isList ? (
    <ActiveParagraphListHighlight>{children}</ActiveParagraphListHighlight>
  ) : isImage || isVideo ? (
    <ActiveParagraphTextHighlight noPadding>
      {children}
    </ActiveParagraphTextHighlight>
  ) : (
    <ActiveParagraphTextHighlight>{children}</ActiveParagraphTextHighlight>
  );

/**
 * Highlight text in a paragraph given original inner html and selected range
 * @param props.innerHtml - The original inner html
 * @param props.start - The highlight range start
 * @param props.end - The highlight range end
 * @returns A span containing the highlighted html
 */
const ParagraphHighlight: FC<{
  innerHtml: string;
  start: number;
  end: number;
}> = ({ innerHtml, start, end }) => {
  let htmlStart: number | undefined, htmlEnd: number | undefined;
  let openTag = false;
  let tag: string | null = null;
  let pos = 0;

  for (let n = 0; n < innerHtml.length; n++) {
    if (innerHtml[n] === '<') {
      openTag = true;
      tag = innerHtml.substring(n, innerHtml.indexOf(' ', n + 1));
    } else if (innerHtml[n] === '>') {
      openTag = false;
    } else if (!openTag) {
      if (htmlStart === undefined && pos >= start) htmlStart = n;

      if (htmlEnd === undefined && pos >= end)
        htmlEnd = innerHtml[n + 1] === ' ' ? n + 1 : n;

      pos++;
    }
  }

  if (htmlStart === undefined) htmlStart = 0;
  if (htmlEnd === undefined) htmlEnd = pos;

  const before = innerHtml.substring(0, htmlStart);
  const highlight = innerHtml.substring(htmlStart, htmlEnd);
  const after = innerHtml.substring(htmlEnd);

  return (
    <span
      id="highlightAnchor"
      dangerouslySetInnerHTML={{
        __html: `${before}<MARK>${highlight}</MARK>${after}`,
      }}
    />
  );
};

const Paragraph: FC = ({ children }) => {
  const commentButtonRef = useRef<HTMLElement>(null);
  const paragraphRef = useRef<HTMLElement>(null);
  const selectionRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLElement>(null);
  const inlineCommentRef = useRef<HTMLTextAreaElement>(null);
  const [innerText, setText] = useState<string | undefined>();
  const [innerHtml, setInnerHtml] = useState<string | undefined>();

  const {
    postUrl,
    absolutePostUrl,
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
    showProfileTipFor,
    hideProfileTip,
  } = useCommentsContext();

  const hash = useMemo<string | undefined>(() => getHash(innerText), [
    innerText,
  ]);

  const isList = useMemo(() => textContainsList(innerText), [innerText]);
  const isImage = useMemo(() => textContainsImage(innerText), [innerText]);
  const isVideo = useMemo(() => textContainsVideo(innerText), [innerText]);
  const isText = !isList && !isImage && !isVideo;

  const reactions = useMemo(
    () => allReactions?.filter(({ paragraph }) => paragraph === hash),
    [allReactions, hash]
  );

  const highlights = useMemo(
    () => reactions?.filter(({ rangeLength }) => rangeLength),
    [reactions]
  );

  const comments = useMemo(
    () => reactions?.filter(({ markdown }) => markdown),
    [reactions]
  );

  const hasHighlights = Boolean(highlights?.length && !comments?.length);
  const hasComments = Boolean(comments?.length);
  const showMarker = hasComments || hasHighlights;
  const showHighlightMark = Boolean(paragraphRef.current && highlights?.length);
  const anotherCommentThreadPinned =
    hash && inlineCommentSingleMode && inlineCommentParagraph?.hash !== hash;
  const showInlineCommentForm = Boolean(
    hash && inlineCommentParagraph?.hash === hash
  );
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
          highlightEnd: Math.max(highlightEnd, rangeStart + rangeLength),
        }),
        {
          highlightStart: innerText?.length ?? 0,
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
    if (!paragraphRef.current || innerHtml) return;

    let paragraphTextNode = paragraphRef.current;
    const firstChild = paragraphTextNode?.firstChild as HTMLElement;

    if (firstChild?.classList?.contains?.('paragraph__highlight'))
      paragraphTextNode = firstChild;

    if (containsText(paragraphTextNode) && !containsList(paragraphTextNode))
      setText(paragraphTextNode.innerText);
    else setText(paragraphTextNode.innerHTML);

    setInnerHtml(paragraphTextNode.innerHTML);
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
  }, [
    showHighlightMark,
    inlineCommentParagraph,
    handleHighlightMouseOver,
    handleHighlightMouseOut,
  ]);

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

  const ParagraphBlock = isText ? ParagraphText : ParagraphNonText;

  return (
    <ParagraphWrapper
      className="paragraph__wrapper"
      showCommentsSidebar={showCommentsSidebar}
      editingComment={showInlineCommentForm}
    >
      <ParagraphBlock id={hash} onMouseUp={handleSelection} ref={paragraphRef}>
        {showInlineCommentForm ? (
          <ActiveParagraphHighlight
            isList={isList}
            isImage={isImage}
            isVideo={isVideo}
          >
            {children}
          </ActiveParagraphHighlight>
        ) : showHighlightMark ? (
          <ParagraphHighlight
            innerHtml={innerHtml}
            start={highlightStart}
            end={highlightEnd}
          />
        ) : (
          children
        )}
      </ParagraphBlock>

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
            absolutePostUrl,
            loading,
            paragraphComments: comments,
            showInlineCommentForm,
            inlineCommentParagraph,
            inlineCommentRef,
            postContentRef,
            toggleInlineComment,
            addInlineComment,
            setInlineCommentParagraph,
            showProfileTipFor,
            hideProfileTip,
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
