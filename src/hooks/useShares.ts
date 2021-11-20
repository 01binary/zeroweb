import React, { useEffect, useState, useCallback } from 'react';
import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import AllSharesQuery, { ShareQuery, ShareType } from '../types/AllSharesQuery';
import AddShareQuery from '../types/AddShareQuery';

export const useShares = (
  slug: string,
  client?: ApolloClient,
) => {
  const [ shares, setShares ] = useState<ShareQuery[] | undefined>();
  const shareCount = shares?.reduce((total, { count }) => total + count, 0) || 0;

  console.log('useShares renders', shares, 'count', shareCount);

  useEffect(() => {
    if (!client || shares) return;
    client.query<AllSharesQuery>({
      query: gql`
        query shares ($slug: String!) {
          shares (slug: $slug) {
            slug
            shareType
            count
          }
      }`,
      variables: { slug }
    })
    .then(({ data: { shares } }) => {
      setShares(shares);
    })
    .catch(error => {
      setShares([]);
      console.error(error);
    });
  }, [client, slug, shares, setShares]);

  const handleAddShare = useCallback((
    shareType: ShareType
  ) => {
    return client && client.mutate<AddShareQuery>({
      mutation: gql`
        mutation($share: ShareInput!) {
          addShare(share: $share) {
            slug,
            shareType,
            count,
          }
        }`,
        variables: {
          share: {
            slug,
            shareType,
          }
        }
    })
    .then(({
      data: {
        addShare
      }
    }) => {
      if (shares?.find(share => share.shareType === shareType)) {
        setShares(shares.map(share => share.shareType === shareType ? addShare : share));
        console.log('updated existing')
      }
      else if (!shares) {
        setShares([ addShare ]);
        console.log('added first');
      }
      else {
        setShares([ ...shares, addShare ]);
        console.log('appended')
      }
    })
    .catch((e: Error) => {
      console.error(e.message);
    });
  }, [client, slug, shares, setShares]);

  return {
    shares,
    shareCount,
    handleAddShare,
  }
};
