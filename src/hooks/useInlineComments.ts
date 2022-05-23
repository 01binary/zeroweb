import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { FetchResult } from '@apollo/client';
import {
  ParagraphComment,
  ParagraphHighlight,
  ParagraphSelection,
} from './useComments';
import AddCommentMutation from '../types/AddCommentMutation';
import { CommentQuery } from '../types/AllCommentsQuery';
import { useTooltip } from './useTooltip';
import { User } from '../auth/types';

// How long to wait before hiding paragraph highlight menu
const HIGHLIGHT_MENU_MOUSEOVER_TIMEOUT = 250;

type InlineCommentsParams = {
  user: User;
  comments: CommentQuery[] | null;
  showCommentsSidebar: boolean;
  highlightedParagraph: ParagraphHighlight;
  paragraphSelection: ParagraphSelection;
  inlineCommentParagraph: ParagraphComment;
  postContentRef: React.MutableRefObject<HTMLElement>;
  setShowCommentsSidebar: (show: boolean) => void;
  setInlineCommentParagraph: React.Dispatch<
    React.SetStateAction<ParagraphComment>
  >;
  setInlineCommentSingleMode: React.Dispatch<React.SetStateAction<boolean>>;
  setParagraphSelection: (selection: ParagraphSelection) => void;
  setHighlightedParagraph: React.Dispatch<
    React.SetStateAction<ParagraphHighlight>
  >;
  handleAdd: (params: AddCommentMutation) => Promise<FetchResult>;
};

const useInlineComments = ({
  user,
  comments,
  postContentRef,
  showCommentsSidebar,
  highlightedParagraph,
  inlineCommentParagraph,
  paragraphSelection,
  setShowCommentsSidebar,
  setInlineCommentParagraph,
  setInlineCommentSingleMode,
  setParagraphSelection,
  setHighlightedParagraph,
  handleAdd,
}: InlineCommentsParams) => {
  const highlightTimerRef = useRef<number>(0);

  const {
    hideTip: hideParagraphMenu,
    showTipFor: showParagraphMenu,
    tipProps: paragraphMenuProps,
    tipRef: paragraphMenuRef,
    targetRef: highlightedParagraphRef,
  } = useTooltip({
    placement: 'top-start',
    verticalOffsetDesktop: 6,
    verticalOffsetMobile: 6,
  });

  const {
    hideTip: hideLoginPopup,
    showTipFor: showLoginPopup,
    tipProps: loginPopupProps,
    tipRef: loginPopupRef,
  } = useTooltip({
    placement: 'top-start',
    verticalOffsetDesktop: 6,
    verticalOffsetMobile: 6,
  });

  const handleToggleInlineComment = useCallback(
    (paragraphHash) => {
      // Toggle inline comment on paragraph in the post
      setShowCommentsSidebar(Boolean(paragraphHash));
      setInlineCommentParagraph(
        paragraphHash
          ? {
              hash: paragraphHash,
              start: paragraphSelection?.start,
              length: paragraphSelection?.length,
            }
          : null
      );
    },
    [
      setInlineCommentParagraph,
      setShowCommentsSidebar,
      paragraphSelection,
      comments,
    ]
  );

  const handleParagraphAction = useCallback(
    (e) => {
      // Handle paragraph context menu command
      const paragraph = highlightedParagraph?.hash || paragraphSelection?.hash;

      if (e.target.id === 'paragraphHighlight') {
        if (!user) {
          // Direct user to login
          hideParagraphMenu();
          showLoginPopup(null, highlightedParagraphRef);
          return;
        }

        // Add paragraph highlight immediately
        handleAdd({
          paragraph,
          userName: user.name,
          avatarUrl: user.avatarUrl,
          rangeStart: highlightedParagraph?.start || paragraphSelection?.start,
          rangeLength:
            highlightedParagraph?.length || paragraphSelection?.length,
        });
      } else if (e.target.id == 'paragraphComment') {
        // Show inline comment form for the paragraph
        handleToggleInlineComment(paragraph);
      }

      hideLoginPopup();
      hideParagraphMenu();
      setParagraphSelection(null);
      setHighlightedParagraph(null);
    },
    [
      user,
      highlightedParagraph,
      paragraphSelection,
      handleAdd,
      handleToggleInlineComment,
      setParagraphSelection,
      setHighlightedParagraph,
      hideParagraphMenu,
      showLoginPopup,
      hideLoginPopup,
    ]
  );

  const handleParagraphMenuMouseOver = useCallback(() => {
    // Show paragraph menu when mouse is over a highlighted paragraph
    if (highlightTimerRef.current) {
      window.clearTimeout(highlightTimerRef.current);
      highlightTimerRef.current = 0;
    }
  }, []);

  const handleParagraphMenuMouseOut = useCallback(() => {
    // Hide paragraph menu when mouse leaves highlighted paragraphs
    if (!highlightTimerRef.current) {
      highlightTimerRef.current = window.setTimeout(() => {
        setHighlightedParagraph(null);
        hideParagraphMenu();
      }, HIGHLIGHT_MENU_MOUSEOVER_TIMEOUT);
    }
  }, [setHighlightedParagraph, hideParagraphMenu]);

  const handleAddInlineComment = useCallback(() => {
    // Request server to add a new inline comment
    if (inlineCommentParagraph?.markdown)
      return handleAdd({
        paragraph: inlineCommentParagraph.hash,
        markdown: inlineCommentParagraph.markdown,
        userName: user.name,
        avatarUrl: user.avatarUrl,
        rangeStart: inlineCommentParagraph.start,
        rangeLength: inlineCommentParagraph.length,
      })
        .then(() => {
          setInlineCommentParagraph(null);
        })
        .catch(() => {
          setInlineCommentParagraph((prev) => ({
            ...prev,
            error: 'Could not comment inline',
          }));
        });
  }, [inlineCommentParagraph, user, handleAdd, setInlineCommentParagraph]);

  const handleClearOverlays = useCallback(
    (e) => {
      // Clear login popup
      hideLoginPopup();

      // Clear highlighted paragraph
      if (!highlightedParagraph || e.target.id?.startsWith('p')) return;
      setHighlightedParagraph(null);
    },
    [highlightedParagraph, setHighlightedParagraph, hideLoginPopup]
  );

  useEffect(() => {
    // Clear highlight when another body element was clicked
    document.body.addEventListener('click', handleClearOverlays);
    return () => {
      document.body.removeEventListener('click', handleClearOverlays);
    };
  }, [handleClearOverlays]);

  useEffect(() => {
    // Hide login popup when user is logged in
    if (user) hideLoginPopup();
  }, [user]);

  useEffect(
    () => () => {
      // Hide comment sidebar on unmount
      setShowCommentsSidebar(false);
    },
    [setShowCommentsSidebar]
  );

  useLayoutEffect(() => {
    // Collapse inline comments except one being edited if they overlap each other
    if (showCommentsSidebar && comments?.length) {
      let prevBottom = 0;

      const threads = postContentRef.current.querySelectorAll(
        '.paragraph__comment-thread'
      );

      for (let n = 0; n < threads.length; ++n) {
        const { top, bottom } = threads[n].getBoundingClientRect();

        if (top <= prevBottom && prevBottom) {
          setInlineCommentSingleMode(true);
          break;
        }

        prevBottom = bottom;
      }
    } else if (!showCommentsSidebar) {
      setInlineCommentSingleMode(false);
    }
  }, [showCommentsSidebar, inlineCommentParagraph, setInlineCommentSingleMode]);

  return {
    hideParagraphMenu,
    showParagraphMenu,
    paragraphMenuProps,
    paragraphMenuRef,
    highlightedParagraphRef,
    hideLoginPopup,
    showLoginPopup,
    loginPopupProps,
    loginPopupRef,
    handleToggleInlineComment,
    handleParagraphAction,
    handleParagraphMenuMouseOver,
    handleParagraphMenuMouseOut,
    handleAddInlineComment,
    handleClearOverlays,
    highlightTimerRef,
  };
};

export default useInlineComments;
