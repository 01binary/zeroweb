type DeleteCommentQuery = {
  deleteComment: {
    slug: string,
    timestamp: string,
    userId: string,
    deleted: string
  };
};

export default DeleteCommentQuery;
