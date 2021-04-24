import { Comment, CommentInput } from '../types/comment';
import { addComment } from '../../database';
import { getCurrentUser } from '../../auth';

export default {
  addComment: {
    type: Comment,
    description: 'Creates a new comment or highlight for a post',
    args: {
      comment: { type: CommentInput },
    },
    resolve: (
      parent,
      {
        comment: {
          slug,
          paragraph,
          rangeStart,
          rangeLength,
          markdown
        }
    }) => addComment(
      slug,
      getCurrentUser(),
      new Date().getUTCDate(),
      markdown,
      paragraph,
      rangeStart,
      rangeLength,
    )
  }
};
