export type VoteCommentQuery = {
  voteComment: {
    upVotes: number;
    downVotes: number;
    voted: boolean;
  }
};

export type Vote = 'upVote' | 'downVote';
