import React, { FC, useMemo, useRef } from 'react';
import ReactionLolIcon from '../../../images/reaction-lol.svg';
import ReactionWowIcon from '../../../images/reaction-wow.svg';
import ReactionConfusedIcon from '../../../images/reaction-confused.svg';
import ReactionPartyIcon from '../../../images/reaction-party.svg';
import ReactionSnapIcon from '../../../images/reaction-snap.svg';
import { CommentQuery, Reaction } from '../../../types/AllCommentsQuery';
import {
  CommentReaction,
  CommentReactionBadge,
  CommentReactionGroup,
} from './Comments.styles';
import { HideTipHandler, ShowTipForHandler } from '../../../hooks/useTooltip';
import { REACTION_NAMES } from '../../../constants';

const getReactionTip = (
  reaction: Reaction,
  count: number,
  reactions: CommentQuery[] = []
) => {
  const shortDescription = REACTION_NAMES[reaction]
    .split(' ')
    .slice(0, -1)
    .join(' ');

  return count > 1
    ? `${count} people ${shortDescription}`
    : `${
        reactions.find((r) => r.reaction === reaction)?.userName
      } ${shortDescription}`;
};

type CommentReactionsProps = {
  timestamp: string;
  comments?: CommentQuery[];
  showTipFor: ShowTipForHandler;
  hideTip: HideTipHandler;
};

const CommentReactions: FC<CommentReactionsProps> = ({
  timestamp,
  comments,
  showTipFor,
  hideTip,
}) => {
  const reactionRef = useRef<HTMLElement>();
  const reactions = useMemo(
    () =>
      comments?.filter(
        ({ parentTimestamp, reaction }) =>
          reaction && parentTimestamp === timestamp
      ),
    [timestamp, comments]
  );

  const reactionCounts = useMemo(
    () =>
      (reactions ?? []).reduce(
        (count, { reaction }) =>
          reaction
            ? {
                ...count,
                [reaction]: (count[reaction] || 0) + 1,
              }
            : count,
        {} as Record<Reaction, number>
      ),
    [reactions]
  );

  const reactionTypes = useMemo(
    () => Object.keys(reactionCounts) as Reaction[],
    [reactionCounts]
  );

  return reactions?.length === 0 ? null : (
    <CommentReactionGroup>
      {reactionTypes.map((reaction) => (
        <CommentReaction
          key={reaction}
          onMouseOver={(e) => {
            reactionRef.current = e.target;
            showTipFor(
              getReactionTip(reaction, reactionCounts[reaction], reactions),
              reactionRef
            );
          }}
          onMouseOut={hideTip}
        >
          {reaction === 'lol' ? (
            <ReactionLolIcon />
          ) : reaction === 'wow' ? (
            <ReactionWowIcon />
          ) : reaction === 'confused' ? (
            <ReactionConfusedIcon />
          ) : reaction === 'party' ? (
            <ReactionPartyIcon />
          ) : reaction === 'snap' ? (
            <ReactionSnapIcon />
          ) : null}
          {reactionCounts[reaction] > 1 && (
            <CommentReactionBadge>
              {reactionCounts[reaction]}
            </CommentReactionBadge>
          )}
        </CommentReaction>
      ))}
    </CommentReactionGroup>
  );
};

export default CommentReactions;
