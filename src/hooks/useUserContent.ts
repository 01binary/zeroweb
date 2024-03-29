/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  User content (comments, highlights, reactions, shares)
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import { useCallback, useMemo, useState } from 'react';
import { ApolloCache, useQuery } from '@apollo/client';
import AllCommentsQuery, { CommentQuery } from '../types/AllCommentsQuery';
import AllSharesQuery, { ShareQuery } from '../types/AllSharesQuery';
import { SHARES, useShares } from './useShares';
import useLoadProgress from './useLoadProgress';
import gql from 'graphql-tag';
import {
  COMMENTS,
  ParagraphComment,
  ParagraphHighlight,
  ParagraphSelection,
  useComments,
} from './useComments';

// Refresh user-created content every minute
const USER_CONTENT_POLL_INTERVAL_MS = 1 * 60 * 1000;

const USER_CONTENT = gql`
  query userContent ($slug: String!) {
    ${COMMENTS}
    ${SHARES}
  }`;

const useUserContent = (slug: string) => {
  const { loading: loadingComments, error: apolloError, data } = useQuery<
    AllCommentsQuery & AllSharesQuery
  >(USER_CONTENT, {
    variables: { slug },
    pollInterval: USER_CONTENT_POLL_INTERVAL_MS,
  });

  const setComments = useCallback(
    (cache: ApolloCache<AllCommentsQuery>, comments: CommentQuery[]) => {
      const query: any = cache.readQuery({
        query: USER_CONTENT,
        variables: { slug },
      });
      if (query)
        cache.writeQuery({
          query: USER_CONTENT,
          variables: { slug },
          data: {
            comments,
            shares: query.shares,
          },
        });
    },
    []
  );

  const setShares = useCallback(
    (cache: ApolloCache<AllSharesQuery>, shares: ShareQuery[]) => {
      const query: any = cache.readQuery({
        query: USER_CONTENT,
        variables: { slug },
      });
      cache.writeQuery({
        query: USER_CONTENT,
        variables: { slug },
        data: {
          comments: query.comments,
          shares,
        },
      });
    },
    []
  );

  const {
    handleAdd,
    handleEdit,
    handleDelete,
    handleVote,
    handleReact,
    loading: mutatingComments,
  } = useComments(slug, setComments, data?.comments);

  const { shareCount, sharesByType, handleAddShare } = useShares(
    slug,
    setShares,
    data?.shares
  );

  const comments = data?.comments;

  const commentCount = useMemo(
    () =>
      (comments ?? []).filter(({ markdown }) => markdown && markdown.length)
        .length,
    [comments]
  );

  const reactionCount = useMemo(
    () =>
      (comments ?? []).filter(
        ({ parentTimestamp, reaction }) => reaction && !parentTimestamp
      ).length,
    [comments]
  );

  const [
    paragraphSelection,
    setParagraphSelection,
  ] = useState<ParagraphSelection | null>(null);

  const [
    highlightedParagraph,
    setHighlightedParagraph,
  ] = useState<ParagraphHighlight | null>(null);

  const [
    inlineCommentParagraph,
    setInlineCommentParagraph,
  ] = useState<ParagraphComment | null>(null);

  const [
    inlineCommentSingleMode,
    setInlineCommentSingleMode,
  ] = useState<boolean>(false);

  const paragraphMetadata =
    paragraphSelection?.hash || highlightedParagraph?.hash;

  const paragraphHighlightCount =
    comments && paragraphMetadata
      ? comments?.filter(
          ({ paragraph, markdown }) =>
            paragraph === paragraphMetadata && !markdown
        )?.length
      : 0;

  const paragraphCommentCount =
    comments && paragraphMetadata
      ? comments?.filter(
          ({ paragraph, markdown }) =>
            paragraph === paragraphMetadata && markdown
        )?.length
      : 0;

  useLoadProgress(loadingComments || mutatingComments);

  return {
    loading: loadingComments || mutatingComments,
    error: apolloError ? 'Could not load comments' : null,

    comments,
    commentCount,
    reactionCount,
    handleAdd,
    handleEdit,
    handleDelete,
    handleVote,
    handleReact,

    shares: data?.shares,
    shareCount,
    sharesByType,
    handleAddShare,

    paragraphSelection,
    highlightedParagraph,
    inlineCommentParagraph,
    inlineCommentSingleMode,
    paragraphHighlightCount,
    paragraphCommentCount,
    setParagraphSelection,
    setHighlightedParagraph,
    setInlineCommentParagraph,
    setInlineCommentSingleMode,
  };
};

export default useUserContent;
