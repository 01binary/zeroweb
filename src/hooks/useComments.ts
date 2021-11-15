import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback
} from "react";
import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import AllCommentsQuery, { CommentQuery } from '../types/AllCommentsQuery';
import AddCommentQuery from '../types/AddCommentQuery';
import EditCommentQuery from '../types/EditCommentQuery';
import DeleteCommentQuery from '../types/DeleteCommentQuery';
import AddCommentMutation from '../types/AddCommentMutation';
import EditCommentMutation from '../types/EditCommentMutation';
import { VoteCommentQuery, Vote } from '../types/VoteCommentQuery';
import ReactMutation from "../types/ReactMutation";
import ReactQuery from '../types/ReactQuery';
//import mockComments from '../__tests__/fixtures/comments.json';

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
  const [ comments, setComments ] = useState<CommentQuery[] | null>(null);
  const [ commentError, setCommentError ] = useState<string | null>(null);
  const [ error, setError ] = useState<string | null>(null);
  const [ loading, setLoading ] = useState<boolean>(true);

  const handleReload = useCallback(() => {
    setError(null);
    //Promise.resolve(mockComments)
    client && client.query<AllCommentsQuery>({
      query: gql`
        query comments ($slug: String!) {
          comments (slug: $slug) {
            slug
            timestamp
            parentTimestamp
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
  }, [client, setComments, setError, setLoading]);

  const handleVote = useCallback((timestamp: string, vote: Vote) => {
    if (!client) return;
    setCommentError(null);
    setLoading(true);
    client.mutate<VoteCommentQuery>({
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
      setCommentError(e.message);
      console.error(e.message);
    });
  }, [client, slug, comments, setCommentError, setComments, setLoading]);

  const handleAdd = useCallback(({
    userName,
    avatarUrl,
    markdown: inputMarkdown,
    paragraph: inputParagraph,
    rangeStart: inputRangeStart,
    rangeLength: inputRangeLength,
  }: AddCommentMutation): Promise<void> => {
    if (!client) {
      setCommentError('Could not contact the server');
      return Promise.reject();
    }

    setCommentError(null);
    setLoading(true);

    return client.mutate<AddCommentQuery>({
      mutation: gql`
        mutation ($comment: CommentInput!) {
          addComment(comment: $comment) {
            slug
            timestamp
            parentTimestamp
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
  }, [client, slug, comments, setComments, setCommentError, setLoading]);

  const handleEdit = useCallback(({
    timestamp,
    markdown,
    reaction,
  }: EditCommentMutation): Promise<void> => {
    if (!client) {
      setCommentError('Could not contact the server');
      return Promise.reject();
    }

    setCommentError(null);
    setLoading(true);

    return client.mutate<EditCommentQuery>({
      mutation: gql`
        mutation ($comment: EditCommentInput!) {
          editComment(comment: $comment) {
            slug
            timestamp
            parentTimestamp
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
            timestamp,
            markdown,
            reaction,
          }
        }
    })
    .then(({
      data: {
        editComment
      }
    }) => {
      setLoading(false);
      setComments(comments.map((comment) => (
        comment.timestamp === timestamp
        ? {
          ...comment,
          markdown: editComment.markdown,
          reaction: editComment.reaction
        }
        : comment
      )));
    })
    .catch((e: Error) => {
      setLoading(false);
      setCommentError(e.message);
      console.error(e.message);
    });
  }, [client, slug, comments, setComments, setCommentError, setLoading]);

  const handleDelete = useCallback((timestamp: string) => {
    if (!client) {
      setCommentError('Could not contact the server');
      return;
    }

    setCommentError(null);
    setLoading(true);
   
    client.mutate<DeleteCommentQuery>({
      mutation: gql`
        mutation ($comment: DeleteCommentInput!) {
          deleteComment(comment: $comment) {
            slug
            timestamp
            deleted
          }
        }`,
        variables: {
          comment: {
            slug,
            timestamp,
          }
        }
    })
    .then(({
      data: {
        deleteComment: {
          deleted
        }
      }
    }) => {
      setLoading(false);
      if (deleted) setComments(comments.filter(
        comment => comment.timestamp !== timestamp
      ));
    })
    .catch((e: Error) => {
      setLoading(false);
      setCommentError(e.message);
      console.error(e.message);
    });
  }, [client, slug, comments, setComments, setCommentError, setLoading]);

  const handleReact = useCallback(({
    userName,
    avatarUrl,
    paragraph,
    reaction,
    parentTimestamp,
  }: ReactMutation) => {
    setLoading(true);
    client && client.mutate<ReactQuery>({
      mutation: gql`
        mutation ($comment: CommentInput!) {
          addComment(comment: $comment) {
            slug
            timestamp
            parentTimestamp
            reaction
            paragraph
            me
          }
        }`,
        variables: {
          comment: {
            slug,
            parentTimestamp,
            userName,
            avatarUrl,
            paragraph,
            reaction,
          }
        }
    })
    .then(({
      data: {
        addComment: addReaction
      }
    }) => {
      setLoading(false);
      setComments([ ...comments, addReaction as CommentQuery ]);
    })
    .catch((e: Error) => {
      setLoading(false);
      console.error(e.message);
    });
  }, [client, slug, comments, setComments, setLoading]);

  useEffect(handleReload, [handleReload, client]);

  return {
    comments,
    commentError,
    error,
    loading,
    handleVote,
    handleAdd,
    handleEdit,
    handleDelete,
    handleReact,
  };
};
