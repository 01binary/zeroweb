import React, { useState, useEffect } from "react";
import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import AllCommentsQuery, { CommentQuery } from '../types/AllCommentsQuery';
import mockComments from '../__tests__/comments.json';

const useComments = (
  slug: string,
  client: ApolloClient,
) => {
  const [ comments, setComments ] = useState<CommentQuery[]>(null);
  const [ error, setError ] = useState<string>(null);
  const [ loading, setLoading ] = useState<boolean>(true);

  useEffect(() => {
    /*client && client.query<AllCommentsQuery>({
      query: gql`
        query comments ($slug: String!) {
          comments (slug: $slug) {
            slug
            timestamp
            userId
            userName
            avatarUrl
            upVotes
            downVotes
            reaction
            markdown
            paragraph
            rangeStart
            rangeLength
          }
        }`,
      variables: { slug }
    })*/
    Promise.resolve(mockComments)
    .then(({ data }) => {
      setComments(data.comments);
      setLoading(false);
    })
    .catch(error => {
      console.error(error);
      setError('Could not load comments for this post');
      setLoading(false);
    });
  }, [client]);

  return ({
    comments,
    error,
    loading,
  })
};

export default useComments;
