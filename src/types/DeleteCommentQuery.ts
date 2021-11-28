type DeleteCommentQuery = {
  deleteComment: {
    slug: string,
    timestamp: string,
    deleted: boolean
  };
};

export default DeleteCommentQuery;
