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

import React, {
  createContext,
  useContext,
  useCallback
} from "react";
import gql from 'graphql-tag';
import { FetchResult, useMutation, useQuery } from '@apollo/client';
import AllCommentsQuery, { CommentQuery } from '../types/AllCommentsQuery';
import AddCommentQuery from '../types/AddCommentQuery';
import EditCommentQuery from '../types/EditCommentQuery';
import DeleteCommentQuery from '../types/DeleteCommentQuery';
import AddCommentMutation from '../types/AddCommentMutation';
import EditCommentMutation from '../types/EditCommentMutation';
import { VoteCommentQuery, Vote } from '../types/VoteCommentQuery';
import ReactMutation from '../types/ReactMutation';
import ReactQuery from '../types/ReactQuery';

type CommentsContextProps = {
  comments: CommentQuery[] | null;
};

export const CommentsContext = createContext<CommentsContextProps>({
  comments: null
});

export const useCommentsContext: () => CommentsContextProps = () => (
  useContext(CommentsContext)
);

export const COMMENTS = gql`
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
  }`;

const VOTE_COMMENT = gql`
  mutation ($comment: VoteCommentInput!) {
    voteComment(comment: $comment) {
      upVotes,
      downVotes,
      voted,
    }
  }`;

const ADD_COMMENT = gql`
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
  }`;

const EDIT_COMMENT = gql`
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
  }`;

const DELETE_COMMENT = gql`
  mutation ($comment: DeleteCommentInput!) {
    deleteComment(comment: $comment) {
      slug
      timestamp
      deleted
    }
  }`;

const REACT_COMMENT = gql`
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
  }`;

export const useComments = (
  slug: string
) => {
  const {
    loading,
    error,
    data,
  } = useQuery<AllCommentsQuery>(COMMENTS, {
    variables: { slug },
  });
  const [ voteComment ] = useMutation<VoteCommentQuery>(VOTE_COMMENT);
  const [ addComment ] = useMutation<AddCommentQuery>(ADD_COMMENT);
  const [ editComment ] = useMutation<EditCommentQuery>(EDIT_COMMENT);
  const [ deleteComment ] = useMutation<DeleteCommentQuery>(DELETE_COMMENT);
  const [ reactToComment ] = useMutation<ReactQuery>(REACT_COMMENT);

  const handleVote = useCallback((timestamp: string, vote: Vote) =>
    voteComment({
      variables: {
        comment: {
          slug,
          timestamp,
          vote,
        }
      },
      update (cache, { data: { voteComment }}) {
        const { comments } = cache.readQuery({
          query: COMMENTS,
          variables: { slug }
        });
        cache.writeQuery({
          query: COMMENTS,
          variables: { slug },
          data: { comments: comments.map((comment) => (
            comment.timestamp === timestamp
              ? { ...comment, ...voteComment }
              : comment
          ))}
        })
      }
    })
  , [slug, voteComment]);

  const handleAdd = useCallback(({
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
        }
      },
      update (cache, { data: { addComment }}) {
        const { comments } = cache.readQuery({
          query: COMMENTS,
          variables: { slug }
        });
        cache.writeQuery({
          query: COMMENTS,
          variables: { slug },
          data: { comments: comments.concat(addComment) }
        })
      },
    }
  ), [slug, addComment]);

  const handleEdit = useCallback(({
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
        }
      },
      update (cache, { data: { editComment }}) {
        const { comments } = cache.readQuery({
          query: COMMENTS,
          variables: { slug }
        });
        cache.writeQuery({
          query: COMMENTS,
          variables: { slug },
          data: { comments: comments.map((comment) => (
            comment.timestamp === timestamp
            ? {
              ...comment,
              markdown: editComment.markdown,
              reaction: editComment.reaction
            }
            : comment
          ))}
        });
      },
    }),
  [slug, editComment]);

  const handleDelete = useCallback((timestamp: string) =>
    deleteComment({
      variables: {
        comment: {
          slug,
          timestamp,
        }
      },
      update (cache, {
        data: {
          deleteComment: {
            deleted
          }
        }
      }) {
        if (!deleted) return;

        const { comments } = cache.readQuery({
          query: COMMENTS,
          variables: { slug }
        });

        cache.writeQuery({
          query: COMMENTS,
          variables: { slug },
          data: { comments: comments.filter(
            comment => comment.timestamp !== timestamp
          )}
        });
      }
    }),
  [slug, deleteComment]);

  const handleReact = useCallback(({
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
        }
      },
      update (cache, { data: { addComment }}) {
        const { comments } = cache.readQuery({
          query: COMMENTS,
          variables: { slug }
        });
        cache.writeQuery({
          query: COMMENTS,
          variables: { slug },
          data: { comments: comments.concat(addComment)}
        });
      },
    }),
  [slug, reactToComment]);

  return {
    comments: data?.comments,
    error: error?.message,
    loading,
    handleVote,
    handleAdd,
    handleEdit,
    handleDelete,
    handleReact,
  };
};
