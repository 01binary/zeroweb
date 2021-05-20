const { AuthenticationError, UserInputError } = require("apollo-server");
const {
  getComments,
  getComment,
  addComment,
  deleteComment,
  editComment,
} = require('./database');

exports.resolvers = {
  Query: {
    comments: async (root, { slug }) => {
      return getComments(slug);
    },

    comment: async (root, { slug, timestamp }) => {
      return getComment(slug, timestamp);
    },
  },
  Mutation: {
    addComment: async (
      root,
      {
        comment: {
          slug,
          parentTimestamp,
          markdown,
          reaction,
          paragraph,
          rangeStart,
          rangeEnd
        }
      },
      { user },
    ) => {
      console.log('addComment mutation got user', user);

      if (!user?.authenticated) throw new AuthenticationError(
        'must be logged in with a social provider to add comments'
      );

      return addComment({
        slug,
        timestamp: new Date().toISOString(),
        userId: user.id,
        parentTimestamp,
        markdown,
        reaction,
        votes: 0,
        paragraph,
        rangeStart,
        rangeEnd
      });
    },

    editComment: async (
      root,
      { comment: { slug, timestamp, markdown, reaction } },
      { user },
    ) => {
      if (!user?.authenticated) throw new AuthenticationError(
        'must be logged in with a social provider to edit comments'
      );

      const original = await getComment(slug, timestamp);

      if (original.userId !== user.id) throw new UserInputError(
        'users can only edit their own comments'
      );

      return editComment(
        {
          slug,
          timestamp,
          markdown,
          reaction,
        },
        original
      );
    },

    voteComment: async (
      root,
      { comment: { slug, timestamp, upVote, downVote } },
      { user },
    ) => {
      if (!user?.authenticated) throw new AuthenticationError(
        'must be logged in with a social provider to vote on comments'
      );

      const original = await getComment(slug, timestamp);
      const vote = upVote ? 1 : downVote ? -1 : 0;

      if (vote === 0) throw new UserInputError(
        'comments can be either upvoted or downvoted'
      );

      return voteComment(
        { slug, timestamp, votes: original.votes + vote },
        original
      );
    },

    deleteComment: async (
      root,
      { comment: { slug, timestamp } },
      { user },
    ) => {
      if (!user?.authenticated) throw new AuthenticationError(
        'must be logged in to delete comments'
      );

      const { userId: originalUserId } = await getComment(slug, timestamp);

      if (originalUserId !== user.id) throw new UserInputError(
        'users can only delete their own comments'
      );

      return deleteComment({ slug, timestamp });
    },
  }
};
