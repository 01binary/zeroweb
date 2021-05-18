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
    addComment: async (root, { comment }, { user }) => addComment({
      ...comment,
      user,
      timestamp: new Date().toISOString()
    }),
    deleteComment: async (root, { comment }) =>
      deleteComment(comment),
    editComment: async (root, { comment }) =>
      editComment(comment),
    voteComment: async (root, { comment: { slug, timestamp, upvote, downvote } }) =>
      voteComment(slug, timestamp, upvote ? 1 : downvote ? -1 : 0)
  }
};
