type DeleteCommentQuery = {
  deleteComment: {
    slug: string,
    timestamp: string,
    deleted: string
  };
};

export default DeleteCommentQuery;
