import { getCurrentUser } from './auth';
import {
  getComments,
  addComment,
  deleteComment
} from './database';

export const resolvers = {
  Query: {
    comments: async (root, { slug }) => getComments(slug)
  },
  Mutation: {
    addComment: async (root, { comment }) => addComment({
      ...comment,
      user: getCurrentUser(),
      timestamp: new Date().toISOString()
    }),
    deleteComment: async (root, { comment }) => deleteComment({
      ...comment
    })
  }
};
