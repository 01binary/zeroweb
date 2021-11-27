/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Post shares queries and mutations.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { useCallback, useMemo } from 'react';
import gql from 'graphql-tag';
import { DocumentNode, useMutation } from '@apollo/client';
import { ShareQuery, ShareType } from '../types/AllSharesQuery';
import AddShareQuery from '../types/AddShareQuery';

export const SHARES = `
  shares (slug: $slug) {
    slug
    shareType
    count
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
  query: DocumentNode,
  shares?: ShareQuery[],
) => {
  const [ addShare ] = useMutation<AddShareQuery>(ADD_SHARE);

  const shareCount = shares?.reduce((total, { count }) => total + count, 0) || 0;
  const sharesByType = useMemo<Partial<Record<ShareType, number>>>(() => shares?.reduce(
    (all, { shareType, count }) => ({ ...all, [shareType]: count }),
  {}) || {}, [shares]);

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
        query,
        variables: { slug }
      });

      if (shares?.find(share => share.shareType === shareType)) {
        cache.writeQuery({
          query,
          variables: { slug },
          data: { shares: shares.map(share => share.shareType === shareType ? addShare : share) }
        });
      } else {
        cache.writeQuery({
          query,
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
