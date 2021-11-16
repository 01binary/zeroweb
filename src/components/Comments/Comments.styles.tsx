import styled from 'styled-components';
import CommentMarkerIcon from '../../images/comment-marker.svg';
import { RULER_ENDMARK_WIDTH } from '../Ruler';
import { AVATAR_SIZE } from '../Avatar';

const COMMENT_SCALE_BREAKPOINT = '1160px';
const VOTE_SLOT_WIDTH = 12;
const AVATAR_TILE_MAX_DIST = 0.15;
const AVATAR_TILE_OFFSET = 19;

export const MAX_VOTE_SLOTS = 10;

const getLineColor = props => (
  props.theme.isDark
  ? props.theme.accentShadowColor
  : props.theme.shadowColor
);

const getAvatarHorzOffset = (index: number, distance: number) => (
  distance < AVATAR_TILE_MAX_DIST && index % 2
    // Tile avatars that are close together for a honeycomb pattern look
    ? -AVATAR_TILE_OFFSET
    // Center odd avatars or avatars that are too far apart
    : 0
);

type CommentsSectionProps = {
  isLoading: boolean;
  isUserLoggedIn: boolean;
  hasComments: boolean;
};

export const CommentsSection = styled.footer<CommentsSectionProps>`
  h2 {
    font-size: ${props => props.theme.headingFontSizeMedium};
    font-weight: ${props => props.theme.headingFontWeight};
  }

  p, li {
    font-family: ${props => props.theme.smallFont};
    font-size: ${props => props.theme.smallFontSize};
    font-weight: ${props => props.theme.smallFontWeight};
    line-height: 1.5em;
  }

  opacity: ${props => props.isLoading ? 0.5 : 1};
  margin-top: ${props => props.isUserLoggedIn && props.hasComments ? 4 : props.isLoading ? -1 : 0}em;
  margin-bottom: ${props => props.isLoading ? 3 : 0}em;
  transition: opacity ${props => props.theme.animationFast} ease-out;

  @media(max-width: ${props => props.theme.mobile}) {
    max-width: initial;
    margin-right: 0.25em;
    margin-top: 0;
    margin-bottom: 0;
  }
`;

const CommentsScaleDate = styled.div`
  position: relative;
  font-family: ${props => props.theme.smallFont};
  font-size: ${props => props.theme.smallFontSize};
  font-weight: ${props => props.theme.smallFontWeight};
  color: ${props => props.theme.secondaryTextColor};
  margin-top: -1em;
  padding-left: calc(100% - 1em);
  width: 5em;

  @media(max-width: ${COMMENT_SCALE_BREAKPOINT}) {
    padding-left: calc(100% - 2.5em);
  }

  @media(max-width: ${props => props.theme.mobile}) {
    display: none;
  }
`;

export const CommentsStartDate = styled(CommentsScaleDate)`
  top: calc(-${props => props.theme.spacingHalf} + ${props => props.theme.border} * 2);
`;

export const CommentsEndDate = styled(CommentsScaleDate)`
  top: ${props => props.theme.spacing};
  height: 2em;
`;

export const CommentMarker = styled(CommentMarkerIcon)`
  position: absolute;
  left: 0;
  top: 0;
`;

export const DateMarker = styled.div`
  position: absolute;
  transition: top ${props => props.theme.animationFast} ease-in-out;
  right: -${props => props.theme.spacingDouble};
  top: ${props => props.offset};
  color: ${props => props.theme.secondaryTextColor};
  height: 1em;
  font-family: monospace;
  font-size: 28pt;

  @media(max-width: ${COMMENT_SCALE_BREAKPOINT}) {
    right: 1.25em;

    .comment-marker__arrow {
      display: none;
    }
  }

  @media(max-width: ${props => props.theme.mobile}) {
    display: none;
  }
`;

export const DateMarkerLabel = styled.div`
  position: relative;
  top: 1.5em;
  left: 1em;
  min-width: 4.75em;
  font-family: ${props => props.theme.smallFont};
  font-size: ${props => props.theme.smallFontSize};
  font-weight: ${props => props.theme.smallFontWeight};

  @media(max-width: ${COMMENT_SCALE_BREAKPOINT}) {
    display: none;
  }

  @media(max-width: ${props => props.theme.mobile}) {
    display: none;
  }
`;

export const MarkerCount = styled.div`
  color: ${props => props.theme.foregroundColor};
  font-weight: bold;
`;

export const CommentsList = styled.ul`
  position: relative;
  list-style-type: none;
  margin-block-end: 0;
  margin-top: 0;
  margin-bottom: ${props => props.theme.spacing};
  margin-left: ${props => props.theme.spacingHalf};
  margin-right: 0;
  padding-top: 0.5em;
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 0;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: calc(-${RULER_ENDMARK_WIDTH}px + ${props => props.theme.spacingHalf} + ${props => props.theme.border} * 2 - 1px);
    height: calc(100% + ${props => props.theme.spacing});
    width: ${RULER_ENDMARK_WIDTH}px;
    border-top: ${props => props.theme.border} solid ${props => getLineColor(props)};
    border-left: ${props => props.theme.border} solid ${props => getLineColor(props)};
    border-bottom: ${props => props.theme.border} solid ${props => getLineColor(props)};
  }

  @media(max-width: ${props => props.theme.mobile}) {
    max-width: 100%;

    &:after {
      content: initial;
    }
  }
`;

export const Comment = styled.li`
  position: relative;
  left: calc(-${MAX_VOTE_SLOTS + 1} * ${VOTE_SLOT_WIDTH}px);
  padding-left: calc(${MAX_VOTE_SLOTS + 1} * ${VOTE_SLOT_WIDTH}px + ${AVATAR_SIZE}px + ${AVATAR_TILE_OFFSET}px + 1em);
  padding-right: calc(20% + ${RULER_ENDMARK_WIDTH}px + 1em);
  margin-right: calc(-${MAX_VOTE_SLOTS + 1} * ${VOTE_SLOT_WIDTH}px - ${RULER_ENDMARK_WIDTH}px);
  margin-bottom: .7em;

  &:before {
    content: '';
    position: absolute;
    border-right: ${props => props.theme.border} dotted ${props => props.theme.borderColor};
    top: 28px;
    left: calc(${props => getAvatarHorzOffset(props.index, props.distance)}px + ${MAX_VOTE_SLOTS + 1} * ${VOTE_SLOT_WIDTH}PX + ${AVATAR_TILE_OFFSET}px + 1em + ${props => props.theme.border} * 0.5);
    height: calc(100% - 17px);
    z-index: -1;
  }

  &:after {
    content: '';
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: calc(${RULER_ENDMARK_WIDTH}px + 10px);
    opacity: .4;
    transition: opacity ${props => props.theme.animationFast} ease-out;
    border-right: ${props => props.scrollHighlight
      ? `${props.theme.borderThick} solid ${props.theme.foregroundColor}`
      : `${props.theme.borderThick} solid ${props.theme.borderColor}`
    };
  }

  &:hover {
    .comment__vote-button {
      opacity: 1;
    }

    .comment__option-button {
      opacity: 1;
    }

    &:after {
      opacity: 1;
    }
  }

  .comment__option--active {
    opacity: 1;
  }

  &.comment--votable:hover {
    .comment-votes__scale {
      right: calc(${AVATAR_TILE_OFFSET}px + ${VOTE_SLOT_WIDTH}px + 2.5em);
    }
  }

  &:last-of-type::before {
    display: none;
  }

  @media(max-width: ${props => props.theme.mobile}) {
    padding-right: 0;
    margin-right: calc(-${MAX_VOTE_SLOTS + 1} * ${VOTE_SLOT_WIDTH}px + ${props => props.theme.spacingHalf});
    &:after {
      display: none;
    }
  }
`;

export const Me = styled.span`
  position: relative;
  padding: 6px 8px;
  background: ${props => props.theme.primaryColor};
  color: ${props => props.theme.backgroundColor};

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: -8px;
    border-width: 8px;
    border-style: solid;
    border-color: transparent transparent transparent ${props => props.theme.backgroundColor};
  }

  &:after {
    content: '';
    position: absolute;
    right: 0;
    bottom: -8px;
    border-width: 8px;
    border-style: solid;
    border-color: transparent ${props => props.theme.backgroundColor} transparent transparent;
  }
`;

export const CommentAvatar = styled.div`
  position: absolute;
  left: calc(${props => getAvatarHorzOffset(props.index, props.distance)}px + ${MAX_VOTE_SLOTS + 1} * ${VOTE_SLOT_WIDTH}PX + ${AVATAR_TILE_OFFSET}px);
  top: -.5em;
`;

export const CommentVotesScale = styled.div`
  position: absolute;
  top: calc(${props => props.theme.border} * 3);
  right: calc(${AVATAR_TILE_OFFSET}px + 1em + ${VOTE_SLOT_WIDTH}px);
  text-align: right;
  width: calc(${MAX_VOTE_SLOTS} * ${VOTE_SLOT_WIDTH}px);
  user-select: none;

  transition: right .1s ease-out;

  @media(max-width: ${props => props.theme.mobile}) {
    display: none;
  }
`;

const VoteSlot = styled.span`
  display: inline-block;
  width: ${VOTE_SLOT_WIDTH}px;
`;

export const DownVote = styled(VoteSlot)`
  color: ${props => props.theme.focusColor};
`;

export const UpVote = styled(VoteSlot)`
  color: ${props => props.theme.successColor};
`;

const VoteButton = styled.button.attrs(() => ({
  className: 'comment__vote-button'
}))`
  position: absolute;
  right: calc(${props => props.theme.spacingOneAndHalf} - 4px);
  width: 32px;
  height: 16px;
  border: none;
  cursor: pointer;
  padding: 4px;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;
  stroke: ${props => props.theme.foregroundColor};
  opacity: 0;

  transition: opacity ${props => props.theme.animationFast} ease-out;

  svg {
    pointer-events: none;
  }

  &:hover {
    stroke: ${props => props.theme.primaryColor};
  }

  @media(max-width: ${props => props.theme.mobile}) {
    display: none;
  }
`;

export const UpVoteButton = styled(VoteButton)`
  top: 0;
`;

export const DownVoteButton = styled(VoteButton)`
  top: 20px;
`;

export const CommentContent = styled.span`
  margin: 0 0.25em 0 ${props => props.theme.spacingHalf};

  p {
    margin-left: 0;
    margin-right: 0;
  }

  p:first-of-type {
    margin-top: 0;
    display: inline;
  }

  p:last-of-type {
    margin-bottom: 0;
  }

  code {
    position: relative;
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: ${props => props.theme.smallFontSize};
    background: ${props => props.theme.isDark ? props.theme.alwaysDarkColor : props.theme.accentLightColor};
    padding: ${props => props.theme.spacingQuarter};
  }
`;

export const CommentDate = styled.span`
  position: absolute;
  left: calc(80% - ${props => props.theme.spacingHalf} - ${props => props.theme.border});
  width: 8em;

  @media(max-width: ${props => props.theme.mobile}) {
    display: none;
  }
`;

export const CommentMetadata = styled.div`
  display: inline;
`;

export const CommentActions = styled.div`
  display: inline-block;
  margin-top: -1em;
  width: max-content;
`;

export const CommentButton = styled.button.attrs(() => ({
  className: 'comment__option-button'
}))`
  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;

  width: 32px;
  height: 32px;

  position: relative;
  top: 0.5em;

  opacity: 0;
  transition: opacity ${props => props.theme.animationFast} ease-out;

  svg {
    pointer-events: none;
  }

  &:hover {
    .stroke-foreground {
      stroke: ${props => props.theme.isDark
        ? props.theme.primaryColor
        : props.theme.primaryDarkColor
      };
    }

    .fill-foreground {
      fill: ${props => props.theme.isDark
        ? props.theme.primaryColor
        : props.theme.primaryDarkColor
      };
    }
  }
`;

export const CommentReactionGroup = styled.div`
  display: inline-flex;
  margin-top: -1em;
  width: max-content;
`;

export const CommentReaction = styled.div`
  position: relative;
  top: 6px;
  padding-left: 6px;
`;

export const CommentReactionBadge = styled.div`
  position: relative;
  display: inline-block;
  margin-left: 0.33em;
  top: -6px;
  color: ${props => props.theme.secondaryTextColor};
`;