/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Post user content (comments, highlights, reactions, shares)
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import { useCallback, useMemo } from 'react';
import gql from 'graphql-tag';
import { ApolloCache, useQuery } from '@apollo/client';
import AllCommentsQuery, { CommentQuery } from '../types/AllCommentsQuery';
import { COMMENTS, useComments } from './useComments';
import { SHARES, useShares } from './useShares';
import AllSharesQuery, { ShareQuery } from '../types/AllSharesQuery';

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
  });

  const setComments = useCallback(
    (cache: ApolloCache<AllCommentsQuery>, comments: CommentQuery[]) => {
      const { shares } = cache.readQuery({
        query: USER_CONTENT,
        variables: { slug },
      });
      cache.writeQuery({
        query: USER_CONTENT,
        variables: { slug },
        data: {
          comments,
          shares,
        },
      });
    },
    []
  );

  const setShares = useCallback(
    (cache: ApolloCache<AllSharesQuery>, shares: ShareQuery[]) => {
      const { comments } = cache.readQuery({
        query: USER_CONTENT,
        variables: { slug },
      });
      cache.writeQuery({
        query: USER_CONTENT,
        variables: { slug },
        data: {
          comments,
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
  };
};

export default useUserContent;
