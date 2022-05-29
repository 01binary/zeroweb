import React, { FC } from 'react';
import { CommentQuery, Reaction } from '../../types/AllCommentsQuery';
import ReactionLolIcon from '../../images/reaction-lol.svg';
import ReactionPartyIcon from '../../images/reaction-party.svg';
import ReactionSnapIcon from '../../images/reaction-snap.svg';
import ReactionWowIcon from '../../images/reaction-wow.svg';
import ReactionConfusedIcon from '../../images/reaction-confused.svg';
import { ReactionDisplayType } from '../../hooks/useProfile';

const REACTION_ICONS: Record<Reaction, FC> = {
  snap: ReactionSnapIcon,
  party: ReactionPartyIcon,
  lol: ReactionLolIcon,
  wow: ReactionWowIcon,
  confused: ReactionConfusedIcon,
};

/**
 * Gets a relative page path for gatsby link
 * @param collection - The collection the page is in
 * @param slug - The page slug
 * @returns The relative path to a blog page
 */
export const getPagePath = (collection, slug) => {
  if (collection === 'logs') {
    const [, projectPath, logPath] = slug.split('/');
    return `../projects/${projectPath}/${logPath}`;
  }

  return `../${collection}/${slug}`;
};

/**
 * Get icon component to render for a reaction
 * @param reactionType - The reaction type
 * @returns The component for reaction icon
 */
export const getReactionIcon = (reactionType: Reaction): FC =>
  REACTION_ICONS[reactionType];

/**
 * Sort reactions by date/time in ascending order
 * @param first - The first reaction
 * @param second - The second reaction
 * @returns Comparison result
 */
export const sortByDateTimeDescending = (
  { timestamp: t1 }: CommentQuery,
  { timestamp: t2 }: CommentQuery
) => new Date(t2).valueOf() - new Date(t1).valueOf();

/**
 * Filter reactions by displayable and matching search filter
 * @param reactionFilter - The search filter
 * @returns Whether a reaction is filtered
 */
export const filterDisplayableAndMatchingSearch = (
  reactionFilter: string | null
) => ({ type, reaction }: ReturnType<typeof mapReactionDisplayType>) =>
  type && (!reactionFilter || reactionFilter === reaction);

/**
 * Map a display type for a reaction
 * @param comment - The reaction to analyze
 * @returns The reaction type
 */
export const mapReactionDisplayType = (comment: CommentQuery) => {
  const {
    parentTimestamp,
    markdown,
    rangeLength,
    paragraph,
    reaction,
  } = comment;
  let type: ReactionDisplayType | undefined;

  if (reaction && !markdown) {
    if (parentTimestamp) type = 'CommentReaction';
    else type = 'PostReaction';
  } else if (markdown) {
    if (parentTimestamp) {
      type = 'CommentReply';
    } else {
      if (paragraph) type = 'ParagraphComment';
      else type = 'PostComment';
    }
  } else if (rangeLength) {
    type = 'ParagraphHighlight';
  }

  return {
    ...comment,
    type,
  };
};

/**
 * Create a map preducate for mapping a collection for a reaction's post
 * @param nodes
 * @returns
 */
export const mapReactionCollection = (
  nodes: { slug: string; fields: { collection: string } }[]
) => <ExtendedComment extends CommentQuery>(comment: ExtendedComment) => ({
  ...comment,
  collection: nodes.find(({ slug: nodeSlug }) => nodeSlug === comment.slug)
    ?.fields?.collection,
});
