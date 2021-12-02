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

import React, { useCallback } from 'react';
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
  const { loading, error, data } = useQuery<AllCommentsQuery & AllSharesQuery>(
    USER_CONTENT,
    {
      skip: true,
      variables: { slug },
    }
  );

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
  } = useComments(slug, setComments, data?.comments);

  const { shareCount, sharesByType, handleAddShare } = useShares(
    slug,
    setShares,
    data?.shares
  );

  return {
    loading,
    error: error?.message,

    comments: data?.comments,
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
