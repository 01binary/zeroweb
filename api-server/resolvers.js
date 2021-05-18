const { AuthenticationError } = require("apollo-server");
const {
  getComments,
  getComment,
  addComment,
  deleteComment,
  editComment,
  voteComment
} = require('./database');

exports.resolvers = {
  Query: {
    comments: async (root, { slug }) => {
      return getComments(slug);
    },

    comment: async (root, { slug, timestamp }) => getComment(slug, timestamp),
  },
  Mutation: {
    addComment: async (
      root,
      { comment },
      { user }
    ) => {
      if (!user?.authenticated) throw new AuthenticationError();
      addComment({
        ...comment,
        user,
        timestamp: new Date().toISOString()
      });
    },

    deleteComment: async (
      root,
      { comment },
      { user }
    ) => {
      if (!user?.authenticated) throw new AuthenticationError();
      return deleteComment(comment);
    },

    editComment: async (
      root, { comment }, { user }
    ) => {
      if (!user?.authenticated) throw new AuthenticationError();
      return editComment(comment);
    },

    voteComment: async (
      root,
      { comment: { slug, timestamp, upvote, downvote } },
      { user }
    ) => {
      if (!user?.authenticated) throw new AuthenticationError();
      return voteComment(slug, timestamp, upvote ? 1 : downvote ? -1 : 0);
    }
  }
};
