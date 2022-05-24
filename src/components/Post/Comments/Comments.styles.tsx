import styled from 'styled-components';
import CommentMarkerIcon from '../../../images/comment-marker.svg';
import { RULER_ENDMARK_WIDTH } from '../../../components/Ruler';
import { AVATAR_SIZE } from '../../Avatar';
import Error from '../../../components/Error';
import {
  MOBILE,
  NARROW_FLIP_MARKERS,
  NARROW_NO_MARKER_LABELS,
  NARROW_NO_RULERS,
} from '../../../constants';

const VOTE_SLOT_WIDTH = 12;
const AVATAR_TILE_OFFSET = 19;

export const MAX_VOTE_SLOTS = 10;

const getLineColor = (props) =>
  props.theme.isDark ? props.theme.accentShadowColor : props.theme.shadowColor;

type CommentsSectionProps = {
  isLoading: boolean;
  isUserLoggedIn: boolean;
  hasComments: boolean;
};

export const CommentsSection = styled.footer<CommentsSectionProps>`
  font-family: ${(props) => props.theme.normalFont};
  font-weight: ${(props) => props.theme.normalFontWeight};
  font-size: ${(props) => props.theme.normalFontSize};
  color: ${(props) => props.theme.foregroundColor};

  position: relative;
  max-width: ${(props) => props.theme.column};
  margin-left: auto;
  margin-right: auto;
  margin-top: ${(props) =>
    props.isUserLoggedIn && props.hasComments ? 4 : props.isLoading ? -1 : 0}em;
  margin-bottom: ${(props) => (props.isLoading ? 3 : 0)}em;

  animation: slideIn ${(props) => props.theme.animationSlow} ease-out 1;
  animation-fill-mode: forwards;

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(8px);
    }

    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }

  opacity: ${(props) => (props.isLoading ? 0.5 : 1)};
  transition: opacity ${(props) => props.theme.animationSlow} ease-in-out;

  // Flickers on Safari due to opacity
  transform-style: preserve-3d;
  backface-visibility: hidden;

  h2 {
    font-size: ${(props) => props.theme.headingFontSizeMedium};
    font-weight: ${(props) => props.theme.headingFontWeight};
  }

  p,
  li {
    font-family: ${(props) => props.theme.smallFont};
    font-size: ${(props) => props.theme.smallFontSize};
    font-weight: ${(props) => props.theme.smallFontWeight};
    line-height: ${(props) => props.theme.smallFontLineHeight};
  }

  @media (max-width: ${MOBILE}) {
    max-width: initial;
    margin-right: 0.25em;
    margin-top: 0;
    margin-bottom: 0;

    p,
    li {
      line-height: ${(props) => props.theme.smallFontLineHeightMobile};
    }
  }
`;

const CommentsScaleDate = styled.div`
  position: relative;
  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  font-weight: ${(props) => props.theme.smallFontWeight};
  text-align: right;
  color: ${(props) => props.theme.secondaryTextColor};
  margin-top: -1em;
  padding-left: calc(100% - ${(props) => props.theme.spacingOneAndHalf});
  width: 5em;

  @media (max-width: ${NARROW_NO_RULERS}) {
    display: none;
  }
`;

export const CommentsStartDate = styled(CommentsScaleDate)`
  top: calc(
    -${(props) => props.theme.spacingHalf} + ${(props) => props.theme.border} * 2
  );
`;

export const CommentsEndDate = styled(CommentsScaleDate)`
  top: ${(props) => props.theme.spacing};
  height: 2em;
`;

export const CommentMarker = styled(CommentMarkerIcon)`
  position: absolute;
  left: 0;
  top: 0;
`;

export const DateMarker = styled.div<{ offset: number; show: boolean }>`
  position: absolute;
  transition: top ${(props) => props.theme.animationFast} ease-in-out;
  right: -${(props) => props.theme.spacingDouble};
  top: ${(props) => props.offset};
  color: ${(props) => props.theme.secondaryTextColor};
  height: 1em;
  ${(props) => !props.show && 'display: none'};

  @media (max-width: ${NARROW_FLIP_MARKERS}) {
    right: ${(props) => props.theme.spacingOneAndHalf};

    .comment-marker__arrow {
      display: none;
    }
  }

  @media (max-width: ${NARROW_NO_RULERS}) {
    display: none;
  }
`;

export const DateMarkerLabel = styled.div`
  position: relative;
  top: 1.5em;
  left: 1em;
  min-width: 4.75em;
  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  font-weight: ${(props) => props.theme.smallFontWeight};

  @media (max-width: ${NARROW_FLIP_MARKERS}) {
    display: none;
  }

  @media (max-width: ${NARROW_NO_RULERS}) {
    display: none;
  }
`;

export const MarkerCount = styled.div`
  color: ${(props) => props.theme.foregroundColor};
  font-weight: bold;
`;

export const CommentsList = styled.ul`
  position: relative;
  list-style-type: none;
  margin-block-end: 0;
  margin-top: 0;
  margin-bottom: ${(props) => props.theme.spacing};
  margin-left: ${(props) => props.theme.spacingHalf};
  margin-right: 0;
  padding-top: 0.5em;
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 0;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: calc(
      -${RULER_ENDMARK_WIDTH}px + ${(props) => props.theme.spacingHalf} + ${(
          props
        ) => props.theme.border} * 2 - 1px
    );
    height: calc(100% + ${(props) => props.theme.spacing});
    width: ${RULER_ENDMARK_WIDTH}px;
    border-top: ${(props) => props.theme.border} solid
      ${(props) => getLineColor(props)};
    border-left: ${(props) => props.theme.border} solid
      ${(props) => getLineColor(props)};
    border-bottom: ${(props) => props.theme.border} solid
      ${(props) => getLineColor(props)};
  }

  @media (max-width: ${NARROW_NO_RULERS}) {
    max-width: 100%;
    margin-left: 0;
    margin-right: 0;

    &:after {
      content: initial;
    }
  }
`;

export const Comment = styled.li`
  position: relative;
  left: calc(-${MAX_VOTE_SLOTS + 1} * ${VOTE_SLOT_WIDTH}px);

  padding-left: ${(props) =>
    props.single
      ? // Only one comment, basic list layout
        `calc(${
          MAX_VOTE_SLOTS + 1
        } * ${VOTE_SLOT_WIDTH}px + ${AVATAR_SIZE}px + 1em)`
      : // More than one comment, honey-comb pattern layout
        `calc(${
          MAX_VOTE_SLOTS + 1
        } * ${VOTE_SLOT_WIDTH}px + ${AVATAR_SIZE}px + ${AVATAR_TILE_OFFSET}px + 1em)`};
  padding-right: calc(20% + ${RULER_ENDMARK_WIDTH}px + 1em);
  margin-right: calc(
    -${MAX_VOTE_SLOTS + 1} * ${VOTE_SLOT_WIDTH}px - ${RULER_ENDMARK_WIDTH}px
  );
  margin-bottom: 0.7em;

  // Flickers on Safari due to opacity
  transform-style: preserve-3d;
  backface-visibility: hidden;

  &:before {
    content: '';
    position: absolute;
    border-right: ${(props) => props.theme.border} dotted
      ${(props) => props.theme.borderColor};
    top: 28px;
    left: calc(
      ${MAX_VOTE_SLOTS + 1} * ${VOTE_SLOT_WIDTH}px + ${AVATAR_TILE_OFFSET}px +
        1em + ${(props) => props.theme.border} * 0.5
    );
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
    opacity: 0.4;
    transition: opacity ${(props) => props.theme.animationFast} ease-out;
    border-right: ${(props) =>
      props.scrollHighlight
        ? `${props.theme.borderThick} solid ${props.theme.foregroundColor}`
        : `${props.theme.borderThick} solid ${props.theme.borderColor}`};
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

  @media (max-width: ${NARROW_NO_RULERS}) {
    margin-right: calc(${(props) => props.theme.spacing} * 3.5);
    margin-left: ${(props) => props.theme.spacingHalf};
    padding-right: 0;

    &:after {
      display: none;
    }
  }

  @media (max-width: ${MOBILE}) {
    padding-left: calc(
      ${MAX_VOTE_SLOTS + 1} * ${VOTE_SLOT_WIDTH}px + ${AVATAR_SIZE}px +
        ${AVATAR_TILE_OFFSET}px + 1em
    );
    padding-right: 0;
    margin-left: 0;
    margin-right: calc(
      -${MAX_VOTE_SLOTS + 1} * ${VOTE_SLOT_WIDTH}px + ${(props) => props.theme.spacingHalf}
    );
    margin-bottom: calc(
      ${(props) => props.theme.spacingHalf} +
        ${(props) => props.theme.borderThick} * 3
    );

    &:after {
      display: none;
    }
  }
`;

export const Me = styled.span`
  color: ${(props) => props.theme.secondaryTextColor};
`;

export const CommentAvatar = styled.div`
  position: absolute;
  left: calc(
    ${({ tile }) =>
        tile
          ? // Tile avatars that are close together in a honeycomb pattern
            -AVATAR_TILE_OFFSET
          : // Center avatars that are too far apart
            0}px + ${MAX_VOTE_SLOTS + 1} * ${VOTE_SLOT_WIDTH}PX +
      ${AVATAR_TILE_OFFSET}px
  );
  top: -0.5em;

  // Flickers on Safari due to opacity
  transform-style: preserve-3d;
  backface-visibility: hidden;

  @media (max-width: ${MOBILE}) {
    left: calc(
      ${MAX_VOTE_SLOTS + 1} * ${VOTE_SLOT_WIDTH}PX + ${AVATAR_TILE_OFFSET}px
    );
  }
`;

export const CommentVotesScale = styled.div`
  position: absolute;
  top: calc(${(props) => props.theme.border} * 3);
  right: calc(${AVATAR_TILE_OFFSET}px + 1em + ${VOTE_SLOT_WIDTH}px);
  text-align: right;
  width: calc(${MAX_VOTE_SLOTS} * ${VOTE_SLOT_WIDTH}px);
  user-select: none;

  transition: right 0.1s ease-out;

  @media (max-width: ${NARROW_NO_MARKER_LABELS}) {
    display: none;
  }
`;

const VoteSlot = styled.span`
  display: inline-block;
  width: ${VOTE_SLOT_WIDTH}px;
`;

export const DownVote = styled(VoteSlot)`
  color: ${(props) => props.theme.focusColor};
`;

export const UpVote = styled(VoteSlot)`
  color: ${(props) => props.theme.successColor};
`;

const VoteButton = styled.button.attrs(() => ({
  className: 'comment__vote-button',
}))`
  position: absolute;
  right: calc(${(props) => props.theme.spacingOneAndHalf} - 4px);
  width: 32px;
  height: 16px;
  border: none;
  cursor: pointer;
  padding: 4px;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;
  stroke: ${(props) => props.theme.foregroundColor};
  opacity: 0;

  transition: opacity ${(props) => props.theme.animationFast} ease-out;

  svg {
    pointer-events: none;
  }

  &:hover {
    stroke: ${(props) => props.theme.primaryColor};
  }

  @media (max-width: ${MOBILE}) {
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
  margin: 0 0.25em 0 0.5em;

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
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
      'Courier New', monospace;
    font-size: ${(props) => props.theme.smallFontSize};
    background: ${(props) =>
      props.theme.isDark
        ? props.theme.alwaysDarkColor
        : props.theme.accentLightColor};
    padding: ${(props) => props.theme.spacingQuarter};
  }
`;

export const CommentDate = styled.span`
  position: absolute;
  width: 8em;
  left: calc(
    80% - ${(props) => props.theme.spacingHalf} -
      ${(props) => props.theme.border}
  );

  @media (max-width: ${NARROW_NO_RULERS}) {
    left: calc(100% + ${(props) => props.theme.spacingOneAndHalf});
  }

  @media (max-width: ${MOBILE}) {
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
  className: 'comment__option-button',
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
  top: 8px;

  opacity: 0;
  transition: opacity ${(props) => props.theme.animationFast} ease-out;

  // Flickers on Safari due to opacity
  transform-style: preserve-3d;
  backface-visibility: hidden;

  svg {
    pointer-events: none;
  }

  &:hover {
    .stroke-foreground {
      stroke: ${(props) =>
        props.theme.isDark
          ? props.theme.primaryColor
          : props.theme.primaryDarkColor};
    }

    .fill-foreground {
      fill: ${(props) =>
        props.theme.isDark
          ? props.theme.primaryColor
          : props.theme.primaryDarkColor};
    }
  }

  @media (max-width: ${MOBILE}) {
    opacity: 1;
  }
`;

export const CommentReactionGroup = styled.div`
  display: inline-flex;
  margin-top: -1em;
  width: max-content;

  // Flickers on Safari due to opacity
  transform-style: preserve-3d;
  backface-visibility: hidden;
`;

export const CommentReaction = styled.div`
  position: relative;
  top: 8px;
  padding-left: 8px;
`;

export const CommentReactionBadge = styled.div`
  position: relative;
  display: inline-block;
  margin-left: 0.33em;
  top: -6px;
  color: ${(props) => props.theme.secondaryTextColor};
`;

export const CommentReactionDescription = styled.div`
  padding: 10px 16px;
  min-height: 1em;
  max-height: 1em;
`;

export const EditCommentForm = styled.form`
  position: relative;
  width: calc(
    100% - ${(props) => props.theme.spacing} -
      ${(props) => props.theme.spacingQuarter}
  );
  margin-top: ${(props) => props.theme.spacingHalf};
  margin-bottom: -${(props) => props.theme.spacing};

  @media (max-width: ${NARROW_NO_RULERS}) {
    width: calc(80% - ${(props) => props.theme.spacingTriple});
  }

  @media (max-width: ${MOBILE}) {
    width: calc(100% - ${(props) => props.theme.spacing});
  }
`;

export const EditCommentInput = styled.textarea`
  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  font-weight: ${(props) => props.theme.smallFontWeight};

  width: 100%;
  max-height: 10em;
  padding: ${(props) => props.theme.spacingHalf};
  resize: vertical;

  background: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.foregroundColor};
  border: ${(props) => props.theme.border} solid
    ${(props) => props.theme.borderColor};

  &:focus {
    outline-color: ${(props) => props.theme.focusColor};
    outline-style: solid;
    outline-width: medium;
    border-radius: 1px;
  }
`;

export const EditCommentButtonGroup = styled.div`
  display: flex;
  position: absolute;
  left: calc(100% + ${(props) => props.theme.spacingOneAndHalf});
  top: 0;

  @media (max-width: ${NARROW_NO_RULERS}) {
    position: initial;
    left: initial;
    top: initial;
  }
`;

export const EditCommentButton = styled.button`
  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;

  width: 32px;
  height: 32px;

  svg {
    pointer-events: none;
  }

  &:hover {
    .stroke-foreground {
      stroke: ${(props) =>
        props.theme.isDark
          ? props.theme.primaryColor
          : props.theme.primaryDarkColor};
    }

    .fill-foreground {
      fill: ${(props) =>
        props.theme.isDark
          ? props.theme.primaryColor
          : props.theme.primaryDarkColor};
    }
  }
`;

export const AddCommentForm = styled.form`
  position: relative;
  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  font-weight: ${(props) => props.theme.smallFontWeight};
  margin-bottom: ${(props) => props.theme.spacing};
`;

export const AddCommentRow = styled.div`
  display: flex;
  align-items: center;
  width: calc(80% - ${(props) => props.theme.spacingOneAndHalf});
  justify-content: ${(props) =>
    props.align === 'right' ? 'flex-end' : 'flex-start'};

  @media (max-width: ${MOBILE}) {
    width: calc(100% - ${(props) => props.theme.spacingHalf});
    ${(props) => props.distribute && 'justify-content: space-between'};
  }
`;

export const AddCommentUser = styled.div`
  display: inline;
  margin: 0 ${(props) => props.theme.spacingHalf};
`;

export const AddCommentInput = styled.textarea`
  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  font-weight: ${(props) => props.theme.smallFontWeight};

  width: 100%;
  min-height: 1.5em;
  max-height: 500px;
  resize: vertical;

  background: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.foregroundColor};
  border: ${(props) => props.theme.border} solid
    ${(props) => props.theme.borderColor};

  &:focus {
    outline-color: ${(props) => props.theme.focusColor};
    outline-style: solid;
    outline-width: medium;
    border-radius: 1px;
  }

  padding: ${(props) => props.theme.spacingHalf};
  margin-top: ${(props) => props.theme.spacingHalf};
  margin-bottom: ${(props) => props.theme.spacingHalf};
  margin-left: ${(props) => props.theme.spacingHalf};
`;

export const LoadCommentsError = styled(Error)`
  margin: ${(props) => props.theme.spacingHalf};
`;

export const EditCommentError = styled(Error)`
  padding: ${(props) => props.theme.spacingQuarter} 0;
`;

export const PostCommentError = styled(Error)`
  margin-top: 0;
  margin-bottom: 0;
`;
