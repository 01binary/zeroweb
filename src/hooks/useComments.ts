/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Post comments queries and mutations.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { createContext, useContext, useCallback } from 'react';
import gql from 'graphql-tag';
import { ApolloCache, FetchResult, useMutation } from '@apollo/client';
import AllCommentsQuery, { CommentQuery } from '../types/AllCommentsQuery';
import AddCommentQuery from '../types/AddCommentQuery';
import EditCommentQuery from '../types/EditCommentQuery';
import DeleteCommentQuery from '../types/DeleteCommentQuery';
import AddCommentMutation from '../types/AddCommentMutation';
import EditCommentMutation from '../types/EditCommentMutation';
import { VoteCommentQuery, Vote } from '../types/VoteCommentQuery';
import ReactMutation from '../types/ReactMutation';
import { HideTipHandler, ShowTipForHandler } from './useTooltip';

type CommentsContextProps = {
  comments: CommentQuery[] | null;
  showTipFor: ShowTipForHandler;
  hideTip: HideTipHandler;
};

export const CommentsContext = createContext<CommentsContextProps>({
  comments: null,
  showTipFor: () => {},
  hideTip: () => {},
});

export const useCommentsContext: () => CommentsContextProps = () =>
  useContext(CommentsContext);

export const COMMENTS = `
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
  }`;

const VOTE_COMMENT = gql`
  mutation($comment: VoteCommentInput!) {
    voteComment(comment: $comment) {
      upVotes
      downVotes
      voted
    }
  }
`;

const ADD_COMMENT = gql`
  mutation($comment: CommentInput!) {
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
    }
  }
`;

const EDIT_COMMENT = gql`
  mutation($comment: EditCommentInput!) {
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
    }
  }
`;

const DELETE_COMMENT = gql`
  mutation($comment: DeleteCommentInput!) {
    deleteComment(comment: $comment) {
      slug
      timestamp
      deleted
    }
  }
`;

const REACT_COMMENT = gql`
  mutation($comment: CommentInput!) {
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
    }
  }
`;

export const useComments = (
  slug: string,
  setComments: (
    cache: ApolloCache<AllCommentsQuery>,
    comments: CommentQuery[]
  ) => void,
  comments?: CommentQuery[]
) => {
  const [voteComment, { loading: voteLoading }] = useMutation<VoteCommentQuery>(
    VOTE_COMMENT
  );
  const [addComment, { loading: addLoading }] = useMutation<AddCommentQuery>(
    ADD_COMMENT
  );
  const [editComment, { loading: editLoading }] = useMutation<EditCommentQuery>(
    EDIT_COMMENT
  );
  const [
    deleteComment,
    { loading: deleteLoading },
  ] = useMutation<DeleteCommentQuery>(DELETE_COMMENT);
  const [
    reactToComment,
    { loading: reactLoading },
  ] = useMutation<AddCommentQuery>(REACT_COMMENT);

  const loading =
    voteLoading || addLoading || editLoading || deleteLoading || reactLoading;

  const handleVote = useCallback(
    (timestamp: string, vote: Vote) =>
      voteComment({
        variables: {
          comment: {
            slug,
            timestamp,
            vote,
          },
        },
        update(cache, { data: { voteComment } }) {
          setComments(
            cache,
            comments.map((comment) =>
              comment.timestamp === timestamp
                ? { ...comment, ...voteComment }
                : comment
            )
          );
        },
      }),
    [slug, comments, voteComment]
  );

  const handleAdd = useCallback(
    ({
      userName,
      avatarUrl,
      markdown: inputMarkdown,
      paragraph: inputParagraph,
      rangeStart: inputRangeStart,
      rangeLength: inputRangeLength,
    }: AddCommentMutation): Promise<FetchResult> =>
      addComment({
        variables: {
          comment: {
            slug,
            userName,
            avatarUrl,
            markdown: inputMarkdown,
            paragraph: inputParagraph,
            rangeStart: inputRangeStart,
            rangeLength: inputRangeLength,
          },
        },
        update(cache, { data: { addComment } }) {
          setComments(cache, comments.concat(addComment));
        },
      }),
    [slug, comments, addComment]
  );

  const handleEdit = useCallback(
    ({
      timestamp,
      markdown,
      reaction,
    }: EditCommentMutation): Promise<FetchResult> =>
      editComment({
        variables: {
          comment: {
            slug,
            timestamp,
            markdown,
            reaction,
          },
        },
        update(cache, { data: { editComment } }) {
          setComments(
            cache,
            comments.map((comment) =>
              comment.timestamp === timestamp
                ? {
                    ...comment,
                    markdown: editComment.markdown,
                    reaction: editComment.reaction,
                  }
                : comment
            )
          );
        },
      }),
    [slug, comments, editComment]
  );

  const handleDelete = useCallback(
    (timestamp: string) =>
      deleteComment({
        variables: {
          comment: {
            slug,
            timestamp,
          },
        },
        update(
          cache,
          {
            data: {
              deleteComment: { deleted },
            },
          }
        ) {
          if (!deleted) return;
          setComments(
            cache,
            comments.filter((comment) => comment.timestamp !== timestamp)
          );
        },
      }),
    [slug, comments, deleteComment]
  );

  const handleReact = useCallback(
    ({
      userName,
      avatarUrl,
      paragraph,
      reaction,
      parentTimestamp,
    }: ReactMutation) =>
      reactToComment({
        variables: {
          comment: {
            slug,
            parentTimestamp,
            userName,
            avatarUrl,
            paragraph,
            reaction,
          },
        },
        update(cache, { data: { addComment } }) {
          setComments(cache, comments.concat(addComment));
        },
      }),
    [slug, comments, reactToComment]
  );

  return {
    handleVote,
    handleAdd,
    handleEdit,
    handleDelete,
    handleReact,
    loading,
  };
};
