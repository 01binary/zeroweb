import React, { FC } from 'react';
import MetaLink from '../../components/MetaLink';
import CommentIcon from '../../images/reaction-comment.svg';
import HighlightIcon from '../../images/reaction-highlight.svg';
import ReactionGenericIcon from '../../images/reaction.svg';
import { ReactionDisplayType } from '../../hooks/useProfile';
import { CommentQuery, Reaction } from '../../types/AllCommentsQuery';
import { formatCommentDate, getCommentId } from '../../utils';
import { getPagePath, getReactionIcon } from './profileUtils';
import {
  ReactionDate,
  ReactionDescription,
  ReactionRow,
  ReactionTypeIcon,
  SecondaryText,
  StaticDate,
} from './Profile.styles';
import { Link } from 'gatsby';

const REACTION_NAMES: Record<Reaction, string> = {
  snap: 'snapped to',
  party: 'popped a four loko to',
  lol: 'lolled about',
  wow: 'lost his diddly about',
  confused: 'yeeted to',
};

const REACTION_DETAILS: Record<ReactionDisplayType, string> = {
  CommentReaction: ':reaction a comment on',
  PostReaction: ':reaction',
  CommentReply: 'replied to a comment on',
  ParagraphComment: 'commented on paragraph in',
  PostComment: 'commented on',
  ParagraphHighlight: 'highlighted a paragraph on',
};

const REACTION_TYPE_ICONS: Record<ReactionDisplayType, React.FC> = {
  CommentReaction: CommentIcon,
  PostReaction: ReactionGenericIcon,
  CommentReply: CommentIcon,
  ParagraphComment: CommentIcon,
  PostComment: CommentIcon,
  ParagraphHighlight: HighlightIcon,
};

const ProfileReaction: FC<
  CommentQuery & { type: ReactionDisplayType; collection: string }
> = ({ slug, collection, timestamp, reaction: emoji, type }) => {
  const reactionDate = formatCommentDate(timestamp);
  const GenericIcon = REACTION_TYPE_ICONS[type];
  const Icon = emoji ? getReactionIcon(emoji) : GenericIcon;
  const detail = REACTION_DETAILS[type].replace(
    ':reaction',
    REACTION_NAMES[emoji] ?? ''
  );
  const textPrimary = detail.split(' ')[0];
  const textSecondary = detail.substring(textPrimary.length + 1);
  const postLink = getPagePath(collection, slug);
  const commentLink =
    type === 'PostComment' ||
    type === 'ParagraphComment' ||
    type === 'CommentReply'
      ? `${postLink}?comment=${getCommentId(timestamp)}`
      : null;

  return (
    <ReactionRow key={timestamp}>
      <ReactionTypeIcon>
        <Icon />
      </ReactionTypeIcon>
      <ReactionDescription>
        {textPrimary} <SecondaryText>{textSecondary}</SecondaryText>{' '}
        <Link to={postLink}>{slug}</Link>
      </ReactionDescription>
      <ReactionDate>
        {commentLink ? (
          <MetaLink to={commentLink}>{reactionDate}</MetaLink>
        ) : (
          <StaticDate>{reactionDate}</StaticDate>
        )}
      </ReactionDate>
    </ReactionRow>
  );
};

export default ProfileReaction;
