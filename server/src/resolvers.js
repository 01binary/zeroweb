const { getCurrentUser } = require('./auth');
const {
  getComments,
  getComment,
  addComment,
  deleteComment,
  editComment,
  voteComment
} = require('./database');

module.exports.resolvers = {
  Query: {
    comments: async (root, { slug }) => getComments(slug),
    comment: async (root, { slug, timestamp }) => getComment(slug, timestamp),
  },
  Mutation: {
    addComment: async (root, { comment }) => addComment({
      ...comment,
      user: getCurrentUser(),
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
