import React, { useCallback, useMemo } from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/client';
import AllSharesQuery, { ShareType } from '../types/AllSharesQuery';
import AddShareQuery from '../types/AddShareQuery';

export const SHARES = gql`
  query shares ($slug: String!) {
    shares (slug: $slug) {
      slug
      shareType
      count
    }
  }`;

const ADD_SHARE = gql`
  mutation($share: ShareInput!) {
    addShare(share: $share) {
      slug,
      shareType,
      count,
    }
  }`;

export const useShares = (
  slug: string,
) => {
  const {
    loading,
    error,
    data
  } = useQuery<AllSharesQuery>(
    SHARES, {
      variables: {
        slug
      }
    }
  );
  const [ addShare ] = useMutation<AddShareQuery>(ADD_SHARE);

  const shareCount = data?.shares?.reduce((total, { count }) => total + count, 0) || 0;
  const sharesByType = useMemo<Partial<Record<ShareType, number>>>(() => data?.shares?.reduce(
    (all, { shareType, count }) => ({ ...all, [shareType]: count }),
  {}) || {}, [data]);

  const handleAddShare = useCallback((
    shareType: ShareType
  ) => addShare({
    variables: {
      share: {
        slug,
        shareType,
      }
    },
    update (cache, { data: { addShare }}) {
      const { shares } = cache.readQuery({
        query: SHARES,
        variables: { slug }
      });

      if (shares?.find(share => share.shareType === shareType)) {
        cache.writeQuery({
          query: SHARES,
          variables: { slug },
          data: { shares: shares.map(share => share.shareType === shareType ? addShare : share) }
        });
      } else {
        cache.writeQuery({
          query: SHARES,
          variables: { slug },
          data: { shares: shares.concat(addShare) }
        });
      }
    },
  }), [slug, addShare]);

  return {
    shareCount,
    sharesByType,
    handleAddShare,
  }
};
