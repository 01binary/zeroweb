import React, { FC, useMemo } from 'react';
import { CommentQuery } from "../../types/AllCommentsQuery";
import { CommentReaction, CommentReactionBadge, CommentReactionGroup } from './Comments.styles';
import ReactionLolIcon from '../../images/reaction-lol.svg';
import ReactionWowIcon from '../../images/reaction-wow.svg';
import ReactionConfusedIcon from '../../images/reaction-confused.svg';
import ReactionPartyIcon from '../../images/reaction-party.svg';
import ReactionSnapIcon from '../../images/reaction-snap.svg';

type CommentReactionsProps = {
  timestamp: string;
  comments: CommentQuery[];
};

const CommentReactions: FC<CommentReactionsProps> = ({
  timestamp,
  comments
}) => {
  const reactions = useMemo(() => comments.filter(
    ({ parentTimestamp, reaction }) => reaction && parentTimestamp === timestamp
  ), [timestamp, comments]);

  const count = useMemo(() => reactions.reduce(
    (count, { reaction }) => ({
      ...count,
      [reaction]: (count[reaction] || 0) + 1
    }),
  {}), [reactions]);

  return reactions.length === 0 ? null : (
    <CommentReactionGroup>
      {Object.keys(count).map(reaction => (
        <CommentReaction key={reaction}>
          {
            reaction === 'lol' ?
              <ReactionLolIcon /> :
            reaction === 'wow' ?
              <ReactionWowIcon /> :
            reaction === 'confused' ?
              <ReactionConfusedIcon /> :
            reaction === 'party' ?
              <ReactionPartyIcon /> :
            reaction === 'snap' ?
              <ReactionSnapIcon /> :
            null
          }
          {count[reaction] > 1 &&
            <CommentReactionBadge>
              {count[reaction]}
            </CommentReactionBadge>
          }
        </CommentReaction>
      ))}
    </CommentReactionGroup>
  );
};

export default CommentReactions;
