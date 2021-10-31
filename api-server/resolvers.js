const {
  AuthenticationError,
  UserInputError,
} = require("apollo-server");
const {
  getComments,
  getComment,
  addComment,
  deleteComment,
  editComment,
  voteComment,
  getVote,
  addVote,
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
      { comment },
      { user },
    ) => {
      if (!user?.authenticated) throw new AuthenticationError(
        'must be logged in with a social provider to add comments'
      );

      return addComment({
        ...comment,
        timestamp: new Date().toISOString(),
        userId: user.id,
        upVotes: 0,
        downVotes: 0
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
      { comment: { slug, timestamp, vote } },
      { user },
    ) => {
      if (!user?.authenticated) throw new AuthenticationError(
        'must be logged in with a social provider to vote on comments'
      );

      const alreadyVoted = await getVote(timestamp, user.id);
      if (alreadyVoted) throw new UserInputError('already voted');

      const original = await getComment(slug, timestamp);
      const updated = await voteComment(
        {
          slug,
          timestamp,
          upVotes: vote === 'upVote' ?
            original.upVotes + 1 : original.upVotes,
          downVotes: vote === 'downVote' ?
            original.downVotes - 1 : original.downVotes,
        },
        original
      );

      await addVote(timestamp, user.id);

      return updated;
    },

    deleteComment: async (
      root,
      { comment: { slug, timestamp } },
      { user },
    ) => {
      if (!user?.authenticated) throw new AuthenticationError(
        'must be logged in to delete comments'
      );

      const comment = await getComment(slug, timestamp);

      if (!comment) throw new UserInputError('comment not found');

      const { userId: originalUserId } = comment;

      if (originalUserId !== user.id) throw new UserInputError(
        'users can only delete their own comments'
      );

      return deleteComment({
        slug,
        timestamp,
        userId: user.id,
      });
    },
  }
};
