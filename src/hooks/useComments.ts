import React, { useState, useEffect, createContext, useContext, useCallback } from "react";
import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import AllCommentsQuery, { CommentQuery } from '../types/AllCommentsQuery';
import AddCommentQuery from '../types/AddCommentQuery';
import AddCommentMutation from '../types/AddCommentMutation';
import { VoteCommentQuery, Vote } from '../types/VoteCommentQuery';
import mockComments from '../__tests__/comments.json';

type CommentsContextProps = {
  comments: CommentQuery[] | null;
};

export const CommentsContext = createContext<CommentsContextProps>({
  comments: null
});

export const useCommentsContext: () => CommentsContextProps = () => (
  useContext(CommentsContext)
);

export const useComments = (
  slug: string,
  client: ApolloClient,
) => {
  const [ comments, setComments ] = useState<CommentQuery[] | null>();
  const [ commentError, setCommentError ] = useState<string | null>(null);
  const [ error, setError ] = useState<string | null>(null);
  const [ loading, setLoading ] = useState<boolean>(true);

  useEffect(() => {
    //Promise.resolve(mockComments)
    client && client.query<AllCommentsQuery>({
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
            voted
            reaction
            markdown
            paragraph
            rangeStart
            rangeLength
            me
          }
        }`,
      variables: { slug }
    })
    .then(({ data: { comments } }) => {
      setComments(comments);
      setLoading(false);
    })
    .catch(error => {
      console.error(error);
      setError('Could not load comments for this post');
      setLoading(false);
    });
  }, [client]);

  const handleVote = useCallback((timestamp: string, vote: Vote) => {
    setLoading(true);
    client && client.mutate<VoteCommentQuery>({
      mutation: gql`
        mutation ($comment: VoteCommentInput!) {
          voteComment(comment: $comment) {
            upVotes,
            downVotes,
            voted,
          }
        }`,
        variables: {
          comment: {
            slug,
            timestamp,
            vote,
          }
        }
    })
    .then(({
      data: {
        voteComment: {
          upVotes,
          downVotes,
          voted
        }
      }
    }) => {
      setLoading(false);
      setComments(comments.map((comment) => (
        comment.timestamp === timestamp
        ? { ...comment, upVotes, downVotes, voted }
        : comment
      )));
    })
    .catch((e: Error) => {
      setLoading(false);
      setComments(comments.map((comment) => (
        comment.timestamp === timestamp
        ? { ...comment, voted: true }
        : comment
      )));
      console.error(e.message);
    });
  }, [client, slug, comments, setComments, setLoading]);

  const handleAdd = useCallback(({
    userName,
    avatarUrl,
    markdown: inputMarkdown,
    paragraph: inputParagraph,
    rangeStart: inputRangeStart,
    rangeLength: inputRangeLength,
  }: AddCommentMutation) => {
    setLoading(true);
    client && client.mutate<AddCommentQuery>({
      mutation: gql`
        mutation ($comment: CommentInput!) {
          addComment(comment: $comment) {
            slug
            timestamp
            userId
            userName
            avatarUrl
            upVotes
            downVotes
            voted
            reaction
            markdown
            paragraph
            rangeStart
            rangeLength
            me
          }
        }`,
        variables: {
          comment: {
            slug,
            userName,
            avatarUrl,
            markdown: inputMarkdown,
            paragraph: inputParagraph,
            rangeStart: inputRangeStart,
            rangeLength: inputRangeLength,
          }
        }
    })
    .then(({
      data: {
        addComment
      }
    }) => {
      setLoading(false);
      setComments([ ...comments, addComment ]);
    })
    .catch((e: Error) => {
      setLoading(false);
      setCommentError(e.message);
      console.error(e.message);
    });
  }, [client, slug, comments, setComments, setError, setLoading]);

  return ({
    comments,
    commentError,
    error,
    loading,
    handleVote,
    handleAdd,
  })
};
