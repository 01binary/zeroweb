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
import { ApolloCache, useMutation } from '@apollo/client';
import AllSharesQuery, { ShareQuery, ShareType } from '../types/AllSharesQuery';
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
      slug
      shareType
      count
    }
  }
`;

export const useShares = (
  slug: string,
  setShares: (cache: ApolloCache<AllSharesQuery>, shares: ShareQuery[]) => void,
  shares?: ShareQuery[]
) => {
  const [addShare] = useMutation<AddShareQuery>(ADD_SHARE);

  const shareCount =
    shares?.reduce((total, { count }) => total + count, 0) || 0;
  const sharesByType = useMemo<Partial<Record<ShareType, number>>>(
    () =>
      shares?.reduce(
        (all, { shareType, count }) => ({ ...all, [shareType]: count }),
        {}
      ) || {},
    [shares]
  );

  const handleAddShare = useCallback(
    (shareType: ShareType) =>
      addShare({
        variables: {
          share: {
            slug,
            shareType,
          },
        },
        update(cache, { data: { addShare } }) {
          if (shares?.find((share) => share.shareType === shareType))
            setShares(
              cache,
              shares.map((share) =>
                share.shareType === shareType ? addShare : share
              )
            );
          else setShares(cache, shares.concat(addShare));
        },
      }),
    [slug, shares, addShare]
  );

  return {
    shareCount,
    sharesByType,
    handleAddShare,
  };
};
