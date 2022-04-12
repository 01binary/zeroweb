import React, { FC } from 'react';
import { CommentVotesScale, DownVote, UpVote } from './Comments.styles';

type CommentVotesProps = {
  upVotes: number;
  downVotes: number;
  maxVotes: number;
  maxSlots: number;
};

const CommentVotes: FC<CommentVotesProps> = ({
  upVotes,
  downVotes,
  maxVotes,
  maxSlots,
}) => {
  const upVoteCount =
    maxVotes <= maxSlots
      ? upVotes
      : Math.round((upVotes / maxVotes) * maxSlots);

  const downVoteCount =
    maxVotes <= maxSlots
      ? downVotes
      : Math.round((downVotes / maxVotes) * maxSlots);

  return (
    <CommentVotesScale className="comment-votes__scale">
      {Array.apply(null, Array(downVoteCount)).map((_, index) => (
        <DownVote key={index}>-</DownVote>
      ))}
      {Array.apply(null, Array(upVoteCount)).map((_, index) => (
        <UpVote key={index}>+</UpVote>
      ))}
    </CommentVotesScale>
  );
};

export default CommentVotes;
