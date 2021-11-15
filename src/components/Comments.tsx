import React, {
  FC,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo
} from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import Avatar from '../components/Avatar';
import MetaLink from '../components/MetaLink';
import Login from './Login';
import Error from './Error';
import dayjs from 'dayjs';
import { RULER_ENDMARK_WIDTH } from './Ruler';
import { AVATAR_SIZE } from './Avatar';
import { useBlogContext } from '../hooks/useBlogContext';
import relativeTime from 'dayjs/plugin/relativeTime';
import CommentMarkerIcon from '../images/comment-marker.svg';
import UpVoteIcon from '../images/upvote.svg';
import DownVoteIcon from '../images/downvote.svg';
import ReactionIcon from '../images/reaction.svg';
import ReactionLolIcon from '../images/reaction-lol.svg';
import ReactionWowIcon from '../images/reaction-wow.svg';
import ReactionConfusedIcon from '../images/reaction-confused.svg';
import ReactionPartyIcon from '../images/reaction-party.svg';
import ReactionSnapIcon from '../images/reaction-snap.svg';
import MenuIcon from '../images/comment-menu.svg';
import SaveIcon from '../images/accept.svg';
import CancelIcon from '../images/cancel.svg';
import { CommentQuery } from '../types/AllCommentsQuery';
import { Vote } from '../types/VoteCommentQuery';
import AddCommentMutation from '../types/AddCommentMutation';
import EditCommentMutation from '../types/EditCommentMutation';
import { useTooltip } from '../hooks/useTooltip';
import { ContextMenu, ContextMenuArrow } from './ContextMenu';
import { Tooltip, Arrow } from './Tooltip';
import ReactCommentMutation from '../types/ReactMutation';

dayjs.extend(relativeTime);

const COMMENT_SCALE_BREAKPOINT = '1160px';
const AVATAR_TILE_MAX_DIST = 0.15;
const AVATAR_TILE_OFFSET = 19;
const MAX_VOTE_SLOTS = 10;
const VOTE_SLOT_WIDTH = 12;

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

const formatCommentDate = (timestamp: string): string => (
  dayjs(timestamp).fromNow()
);

const formatMarkerDate = (timestamp: string): string => (
  dayjs(timestamp).format('MMM YYYY')
);

type CommentsSectionProps = {
  isLoading: boolean;
  isUserLoggedIn: boolean;
  hasComments: boolean;
};

const CommentsSection = styled.footer<CommentsSectionProps>`
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

const CommentsStartDate = styled(CommentsScaleDate)`
  top: calc(-${props => props.theme.spacingHalf} + ${props => props.theme.border} * 2);
`;

const CommentsEndDate = styled(CommentsScaleDate)`
  top: ${props => props.theme.spacing};
  height: 2em;
`;

const CommentMarker = styled(CommentMarkerIcon)`
  position: absolute;
  left: 0;
  top: 0;
`;

const DateMarker = styled.div`
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

const DateMarkerLabel = styled.div`
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

const MarkerCount = styled.div`
  color: ${props => props.theme.foregroundColor};
  font-weight: bold;
`;

const CommentsList = styled.ul`
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

const Comment = styled.li`
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

const Me = styled.span`
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

const CommentAvatar = styled.div`
  position: absolute;
  left: calc(${props => getAvatarHorzOffset(props.index, props.distance)}px + ${MAX_VOTE_SLOTS + 1} * ${VOTE_SLOT_WIDTH}PX + ${AVATAR_TILE_OFFSET}px);
  top: -.5em;
`;

const CommentVotesScale = styled.div`
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

const DownVote = styled(VoteSlot)`
  color: ${props => props.theme.focusColor};
`;

const UpVote = styled(VoteSlot)`
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

const UpVoteButton = styled(VoteButton)`
  top: 0;
`;

const DownVoteButton = styled(VoteButton)`
  top: 20px;
`;

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
  const upVoteCount = maxVotes <= maxSlots
    ? upVotes
    : Math.round((upVotes / maxVotes) * maxSlots);

  const downVoteCount = maxVotes <= maxSlots
    ? downVotes
    : Math.round((downVotes / maxVotes) * maxSlots);

  return (
    <CommentVotesScale className="comment-votes__scale">
      {Array.apply(null, Array(downVoteCount)).map((_, index) =>
        <DownVote key={index}>-</DownVote>)}
      {Array.apply(null, Array(upVoteCount)).map((_, index) =>
        <UpVote key={index}>+</UpVote>)}
    </CommentVotesScale>
  );
};

const CommentContent = styled.span`
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

const EditCommentForm = styled.form`
  position: relative;
  width: calc(100% - 3em);
  margin-top: ${props => props.theme.spacingHalf};
  margin-bottom: -${props => props.theme.spacing};
`;

const EditCommentInput = styled.textarea`
  font-family: ${props => props.theme.smallFont};
  font-size: ${props => props.theme.smallFontSize};
  font-weight: ${props => props.theme.smallFontWeight};

  width: 100%;
  max-height: 10em;
  padding: ${props => props.theme.spacingHalf};
  resize: vertical;

  background: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.foregroundColor};
`;

const EditCommentButtonGroup = styled.div`
  display: flex;
  position: absolute;
  left: calc(100% + ${props => props.theme.spacingDouble});
  top: 0;

  @media(max-width: ${props => props.theme.mobile}) {
    position: initial;
    left: initial;
    top: initial;
  }
`;

const EditCommentButton = styled.button`
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

const CommentDate = styled.span`
  position: absolute;
  left: calc(80% - ${props => props.theme.spacingHalf} - ${props => props.theme.border});
  width: 8em;

  @media(max-width: ${props => props.theme.mobile}) {
    display: none;
  }
`;

const CommentMetadata = styled.div`
  display: inline;
`;

const CommentReactionGroup = styled.div`
  display: inline-flex;
  margin-top: -1em;
  width: max-content;
`;

const CommentReaction = styled.div`
  position: relative;
  top: 6px;
  padding-left: 1em;
`;

const CommentReactionBadge = styled.div`
`;

const CommentActions = styled.div`
  display: inline-block;
  margin-top: -1em;
  width: max-content;
`;

const CommentButton = styled.button.attrs(() => ({
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
    (acc, { reaction }) => ({ ...acc, [reaction]: (acc[reaction] || 0) + 1 }),
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

type MenuProps = {
  vertical?: boolean;
};

const Menu = styled.div<MenuProps>`
  display: flex;
  flex-direction: ${props => props.vertical ? 'column' : 'row'};
  min-width: 180px;
  padding-top: 4px;
`;

const MenuItem = styled.button`
  padding: 10px 16px;
  cursor: pointer;

  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;

  font-family: ${props => props.theme.smallFont};
  font-size: ${props => props.theme.smallFontSize};
  font-weight: ${props => props.theme.smallFontWeight};
  text-align: left;

  svg {
    position: relative;
    pointer-events: none;
    top: 2px;
  }

  color: ${props => props.theme.foregroundColor};

  &:hover {
    color: ${props => props.theme.backgroundColor};
    background: ${props => props.theme.isDark
      ? props.theme.primaryColor
      : props.theme.primaryDarkColor
    };

    .stroke-foreground {
      stroke: ${props => props.theme.backgroundColor};
    }

    .fill-foreground {
      fill: ${props => props.theme.backgroundColor};
    }
  }
`;

type CommentMenuProps = {
  onSelect?: (e: React.MouseEvent) => void;
};

const OptionMenu: FC<CommentMenuProps> = ({ onSelect }) => (
  <Menu vertical>
    <MenuItem id="editComment" onClick={onSelect}>
      Edit
    </MenuItem>
    <MenuItem id="deleteComment" onClick={onSelect}>
      Delete
    </MenuItem>
  </Menu>
);

const ReactionDescription = styled.div`
  padding: 10px 16px;
  min-height: 1em;
  max-height: 1em;
`;

const ReactionMenu: FC<CommentMenuProps> = ({ onSelect }) => {
  const [ reaction, setReaction ] = useState<string>(null);
  return (
    <Menu vertical>
      <ReactionDescription>
        {reaction}
        {!reaction && 'choose a reaction'}
      </ReactionDescription>
      <Menu>
        <MenuItem
          id="snap"
          onMouseOver={() => setReaction('snap!')}
          onMouseOut={() => setReaction(null)}
          onClick={onSelect}
        >
          <ReactionSnapIcon />
        </MenuItem>
        <MenuItem
          id="party"
          onMouseOver={() => setReaction('four loko')}
          onMouseOut={() => setReaction(null)}
          onClick={onSelect}
        >
          <ReactionPartyIcon />
        </MenuItem>
        <MenuItem
          id="lol"
          onMouseOver={() => setReaction('lol')}
          onMouseOut={() => setReaction(null)}
          onClick={onSelect}
        >
          <ReactionLolIcon />
        </MenuItem>
        <MenuItem
          id="wow"
          onMouseOver={() => setReaction('surprised')}
          onMouseOut={() => setReaction(null)}
          onClick={onSelect}
        >
          <ReactionWowIcon />
        </MenuItem>
        <MenuItem
          id="confused"
          onMouseOver={() => setReaction('confused')}
          onMouseOut={() => setReaction(null)}
          onClick={onSelect}
        >
          <ReactionConfusedIcon />
        </MenuItem>
      </Menu>
    </Menu>
  );
};

const AddCommentForm = styled.form`
  position: relative;
  font-family: ${props => props.theme.smallFont};
  font-size: ${props => props.theme.smallFontSize};
  font-weight: ${props => props.theme.smallFontWeight};
  margin-top: ${props => props.hasComments ? 0 : -props.theme.spacing};
  margin-bottom: ${props => props.theme.spacing};
`;

const AddCommentRow = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% - ${props => props.theme.spacing} - ${props => props.theme.borderThick});
  justify-content: ${props => props.align === 'right' ? 'flex-end' : 'flex-start'};

  @media(max-width: ${props => props.theme.mobile}) {
    width: calc(100% - ${props => props.theme.spacingHalf});
  }
`;

const AddCommentAvatar = styled.div`
  display: inline;
  margin-left: calc(${props => props.theme.spacing} + ${props => props.theme.border} * 2);
`;

const AddCommentUser = styled.div`
  display: inline;
  margin: 0 ${props => props.theme.spacingHalf};
`;

const AddCommentInput = styled.textarea`
  font-family: ${props => props.theme.smallFont};
  font-size: ${props => props.theme.smallFontSize};
  font-weight: ${props => props.theme.smallFontWeight};

  width: 100%;
  min-height: 1.5em;
  max-height: 500px;
  resize: vertical;

  background: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.foregroundColor};

  padding: ${props => props.theme.spacingHalf};
  margin-top: ${props => props.theme.spacingHalf};
  margin-bottom: ${props => props.theme.spacingHalf};
  margin-left: calc(${props => props.theme.spacingOneAndHalf} + ${props => props.theme.spacingQuarter} + ${AVATAR_SIZE}px);
`;

const PrimaryButton = styled.button`
  border: none;
  cursor: pointer;
  padding: 4px;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  font-family: ${props => props.theme.smallFont};
  font-size: ${props => props.theme.smallFontSize};
  font-weight: ${props => props.theme.smallFontWeight};
`;

type CommentsProps = {
  slug: string;
  comments: CommentQuery[] | null;
  loading: boolean;
  error: string | null;
  loginError: string | null;
  commentError: string | null;
  handleVote: (timestamp: string, vote: Vote) => void;
  handleAdd: (comment: AddCommentMutation) => Promise<void>;
  handleEdit: (comment: EditCommentMutation) => Promise<void>;
  handleDelete: (timestamp: string) => void;
  handleReact: (comment: ReactCommentMutation) => void;
  handleFacebookLogin: () => void;
  handleGoogleLogin: () => void;
  handleTwitterLogin: () => void;
  handleLogout: () => void;
  readPosition: number;
  scrollOffset: number;
};

const Comments: FC<CommentsProps> = ({
  slug,
  comments,
  loading,
  error,
  loginError,
  commentError,
  handleVote,
  handleAdd,
  handleEdit,
  handleDelete,
  handleReact,
  handleFacebookLogin,
  handleGoogleLogin,
  handleTwitterLogin,
  handleLogout,
  readPosition,
  scrollOffset,
}) => {
  const { user } = useBlogContext();
  const [ comment, setComment ] = useState<string>('');
  const commentsMarkerOffsetRef = useRef<number>(0);
  const commentsIndexRef = useRef<number>(0);
  const commentSpansRef = useRef<number[]>([]);
  const commentsRef = useRef<HTMLElement>();
  const markerRef = useRef<HTMLElement>();
  const optionRef = useRef<HTMLElement>();
  const editRef = useRef<HTMLTextAreaElement>();
  const tipTargetRef = useRef<HTMLElement>();
  const [ selectedComment, setSelectedComment ] = useState<string | null>(null);
  const [ editingComment, setEditingComment ] = useState<string | null>(null);
  const [ editMarkdown, setEditMarkdown ] = useState<string>('');
  const {
    hideTip: hideMenu,
    showTipFor: showMenu,
    tipProps: menuProps,
    tipRef: menuRef,
    tooltipText: menuId,
  } = useTooltip({
    placement: 'bottom-start',
    verticalOffsetDesktop: 6,
    verticalOffsetMobile: 6
  });
  const {
    hideTip,
    showTipFor,
    tipProps,
    tipRef,
    tooltipText,
  } = useTooltip({
    verticalOffsetDesktop: 6,
    verticalOffsetMobile: 6
  });

  const postComments = comments
    // Post comments are displayed after the post (excludes highlights and reactions)
    ?.filter(({ markdown }) => markdown && markdown.length)
    // Post comments are displayed on a historical timeline
    ?.sort(({ timestamp: timestamp1 }, { timestamp: timestamp2 }) => (
      timestamp1.localeCompare(timestamp2)
    ));

  const maxVotes = postComments?.reduce(
    // Get maximum votes on any comment so we can calculate proportion on available slots
    (acc, { upVotes, downVotes }) => Math.max(acc, upVotes && downVotes ? upVotes + downVotes : 0), 0
  ) || 0;

  useLayoutEffect(() => {
    // Calculate % scrolled through comments and which comment is in view
    if (commentsRef.current && postComments && postComments.length > 0) {
      const commentsRect = commentsRef.current.getBoundingClientRect();
      const { height: markerHeight } = markerRef.current.getBoundingClientRect();
      const bodyRect = document.body.getBoundingClientRect();
      const commentsTop = commentsRect.top - bodyRect.top;
      const spans = [];

      const offsetPercent = Math.max(0, Math.min(commentsRect.height,
        (scrollOffset + window.innerHeight * 0.75 - commentsTop)
      )) / commentsRect.height;

      const { current } = postComments.reduce(
        ({ sum, current }, { timestamp }, index) => {
          const { height } = document
            .getElementById(`comment-${timestamp}`)
            .getBoundingClientRect();
          const nextSum = sum + height / commentsRect.height;
          spans.push(nextSum);
          return {
            sum: nextSum,
            current: offsetPercent > sum ? index : current,
          }
        },
        { sum: 0, current: 0 });

      const offsetPixels = commentsRect.height * offsetPercent;

      commentsMarkerOffsetRef.current = offsetPixels > markerHeight
        ? offsetPixels - markerHeight
        : offsetPixels;
      commentsIndexRef.current = readPosition > .99 ? postComments.length - 1 : current;
      commentSpansRef.current = spans;
    }
  }, [scrollOffset, postComments]);

  const handleChangeComment = useCallback(({ target: { value }}) => {
    setComment(value);
  }, [setComment]);

  const handlePostComment = useCallback((e) => {
    e.preventDefault();
    if (!comment.length) return;
    handleAdd({
      userName: user.name,
      avatarUrl: user.avatarUrl || '',
      markdown: comment
    }).then(() => setComment(''));
  }, [handleAdd, user, comment]);

  const handleHideCommentMenu = useCallback((e) => {
    const target = e.target;
    setTimeout(() => {
      target.classList.remove('comment__option--active');
      optionRef.current = null;
      setSelectedComment(null);
      hideMenu();
    }, 250);
  }, [hideMenu, setSelectedComment]);

  const handleShowCommentMenu = (id: string, timestamp: string) => (e) => {
    if (e.target.classList.contains('comment__option--active')) {
      handleHideCommentMenu(e);
    } else {
      e.target.classList.add('comment__option--active');
      optionRef.current = e.target;
      setSelectedComment(timestamp);
      showMenu(id, optionRef);
    }
  };

  const handleReactToComment = useCallback((e) => {
    handleReact({
      userName: user.name,
      avatarUrl: user.avatarUrl,
      parentTimestamp: selectedComment,
      reaction: e.target.id
    });
  }, [handleReact]);

  const handleEditComment = useCallback(() => {
    setEditingComment(selectedComment);
    setEditMarkdown(postComments.find(
      ({ timestamp }) => timestamp === selectedComment
    )?.markdown || '');
  }, [selectedComment, postComments, setEditingComment, setEditMarkdown]);

  const handleEditCommentChange = useCallback((e) => {
    setEditMarkdown(e.target.value);
  }, [setEditMarkdown]);

  const handleEditCommentSave = useCallback((e) => {
    e.preventDefault();
    if (!editingComment || !editMarkdown.length) return;
    handleEdit({
      slug,
      timestamp: editingComment,
      markdown: editMarkdown
    }).then(() => {
      setEditingComment(null);
      setEditMarkdown('');
    }).catch((e) => {
      console.error(e);
    });
  }, [editingComment, editMarkdown, handleEdit, setEditingComment, setEditMarkdown]);

  const handleEditCommentCancel = useCallback((e) => {
    e.preventDefault();
    if (!editingComment) return;
    setEditingComment(null);
    setEditMarkdown('');
  }, [editingComment, setEditingComment, setEditMarkdown]);

  const handleCommentOption = useCallback((e) => {
    switch (e.target.id) {
      case 'editComment':
        handleEditComment();
        break;
      case 'deleteComment':
        handleDelete(selectedComment);
        break;
    }
    setSelectedComment(null);
  }, [selectedComment, handleEditComment, handleDelete]);

  const handleShowTip = useCallback((e, text) => {
    tipTargetRef.current = e.target;
    showTipFor(text, tipTargetRef);
  }, [showTipFor]);

  useEffect(() => {
    if (editingComment && editRef.current) {
      editRef.current.focus();
      editRef.current.select();
    }
  }, [editingComment]);

  useEffect(() => {
    document.body.addEventListener('click', hideMenu);
    return () => {
      document.body.removeEventListener('click', hideMenu);
    };
  });

  const showComments = Boolean(postComments && postComments.length);
  const showLoadingComments = Boolean(loading && !comments);
  const showLogin = Boolean(!user && comments);

  return (
    <CommentsSection
      isUserLoggedIn={Boolean(user)}
      isLoading={showLoadingComments}
      hasComments={Boolean(postComments && postComments.length)}
    >
      {postComments && (
        <h2>
          Comments
          {postComments.length
            ? <span>&nbsp;[&nbsp;{postComments.length}&nbsp;]</span>
            : null
          }
        </h2>
      )}

      {showLoadingComments && <p>Loading comments...</p>}
      {error && <Error>{error}</Error>}

      {showLogin &&
        <Login
          handleFacebookLogin={handleFacebookLogin}
          handleGoogleLogin={handleGoogleLogin}
          handleTwitterLogin={handleTwitterLogin}
          loginError={loginError}
        />
      }

      {showComments && (
        <>
          <CommentsStartDate>
            {formatMarkerDate(postComments[0].timestamp)}
          </CommentsStartDate>
          <CommentsList ref={commentsRef} isUserLoggedIn={Boolean(user)}>
            {postComments
              .map(({
                timestamp,
                markdown,
                avatarUrl,
                userId,
                userName,
                upVotes,
                downVotes,
                voted,
                me,
              }, index) => (
                <Comment
                  key={`${timestamp}${voted ? 'v' : ''}`}
                  id={`comment-${timestamp}`}
                  scrollHighlight={index === commentsIndexRef.current}
                  className={(voted || me || !user) ? 'comment-unvotable' : 'comment--votable'}
                >
                  <CommentAvatar
                    index={index}
                    distance={index
                      ? commentSpansRef.current[index] - commentSpansRef.current[index - 1]
                      : 0
                    }
                  >
                    <Avatar avatarUrl={avatarUrl} />
                    <CommentVotes
                      upVotes={upVotes}
                      downVotes={downVotes}
                      maxVotes={maxVotes}
                      maxSlots={MAX_VOTE_SLOTS}
                    />
                    {(user && !me && !voted) &&
                      <>
                        <UpVoteButton
                          onClick={() => handleVote(timestamp, 'upVote')}
                          onMouseOver={(e) => handleShowTip(e, 'up vote')}
                          onMouseOut={hideTip}
                        >
                          <UpVoteIcon />
                        </UpVoteButton>
                        <DownVoteButton
                          onClick={() => handleVote(timestamp, 'downVote')}
                          onMouseOver={(e) => handleShowTip(e, 'down vote')}
                          onMouseOut={hideTip}
                        >
                          <DownVoteIcon />
                        </DownVoteButton>
                      </>
                    }
                  </CommentAvatar>
                  {me
                    ? <Me>{userName}</Me>
                    : <MetaLink to={`/profile/${userId}`}>{userName}</MetaLink>
                  }
                  <CommentDate>
                    <MetaLink
                      to={`?comment=${encodeURIComponent(timestamp)}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigator.clipboard.writeText(
                          `${window.location.href}?comment=${encodeURIComponent(timestamp)}`
                        );
                        handleShowTip(e, 'copied!');
                      }}
                      onMouseOver={(e) => handleShowTip(e, 'copy link')}
                      onMouseOut={hideTip}
                    >
                      {' '}
                      {formatCommentDate(timestamp)}
                    </MetaLink>
                  </CommentDate>
                  <CommentContent>
                    {editingComment === timestamp
                      ? (
                        <EditCommentForm onSubmit={(e) => e.preventDefault()}>
                          <EditCommentInput
                            ref={editRef}
                            value={editMarkdown}
                            placeholder="edit your comment"
                            onChange={handleEditCommentChange}
                          />
                          <Error>
                            {commentError}
                          </Error>
                          <EditCommentButtonGroup>
                            <EditCommentButton
                              onClick={handleEditCommentSave}
                              onMouseOver={(e) => handleShowTip(e, 'save')}
                              onMouseOut={hideTip}
                            >
                              <SaveIcon />
                            </EditCommentButton>
                            <EditCommentButton
                              onClick={handleEditCommentCancel}
                              onMouseOver={(e) => handleShowTip(e, 'cancel')}
                              onMouseOut={hideTip}
                            >
                              <CancelIcon />
                            </EditCommentButton>
                          </EditCommentButtonGroup>
                        </EditCommentForm>
                      )
                      : <ReactMarkdown>{markdown}</ReactMarkdown>
                    }
                  </CommentContent>
                  <CommentMetadata>
                    <CommentReactions timestamp={timestamp} comments={comments} />
                    <CommentActions>
                      {(me && !editingComment) &&
                        <CommentButton
                          onClick={handleShowCommentMenu('options', timestamp)}
                          onBlur={handleHideCommentMenu}
                          onMouseOver={(e) => handleShowTip(e, 'actions')}
                          onMouseOut={hideTip}
                        >
                          <MenuIcon />
                        </CommentButton>
                      }
                      {(user && !me) &&
                        <CommentButton
                          onClick={handleShowCommentMenu('reaction', timestamp)}
                          onBlur={handleHideCommentMenu}
                          onMouseOver={(e) => handleShowTip(e, 'react')}
                          onMouseOut={hideTip}
                        >
                          <ReactionIcon />
                        </CommentButton>
                      }
                    </CommentActions>
                  </CommentMetadata>
                </Comment>
              ))}
              <DateMarker offset={`${commentsMarkerOffsetRef.current}px`}>
                <CommentMarker />
                <DateMarkerLabel ref={markerRef}>
                  <MarkerCount>
                    {commentsIndexRef.current + 1}
                    {' / '}
                    {postComments.length}
                  </MarkerCount>
                  {formatMarkerDate(
                    postComments[commentsIndexRef.current]?.timestamp
                  )}
                </DateMarkerLabel>
              </DateMarker>
          </CommentsList>
          <CommentsEndDate>
            {formatMarkerDate(postComments[postComments.length - 1].timestamp)}
          </CommentsEndDate>
        </>
      )}
      <ContextMenu
        ref={menuRef}
        className={selectedComment ? 'comment-menu--open' : 'comment-menu--closed'}
        {...menuProps}
      >
        {menuId === 'reaction' &&
          <ReactionMenu onSelect={handleReactToComment} />
        }
        {menuId === 'options' &&
          <OptionMenu onSelect={handleCommentOption} />
        }
        <ContextMenuArrow />
      </ContextMenu>
      <Tooltip
        ref={tipRef}
        {...tipProps}
      >
        {tooltipText}
        <Arrow />
      </Tooltip>
      {(user && comments) &&
        <AddCommentForm
          onSubmit={(e) => e.preventDefault()}
          hasComments={Boolean(postComments && postComments.length)}
        >
          {commentError &&
            <AddCommentRow>
              <Error>{commentError}</Error>
            </AddCommentRow>
          }
          <AddCommentRow>
            <AddCommentAvatar>
              <Avatar avatarUrl={user.avatarUrl} />
            </AddCommentAvatar>
            <AddCommentUser>
              commenting as <MetaLink to="/profile">{user.name}</MetaLink>
            </AddCommentUser>
            <button onClick={handleLogout}>logout</button>
          </AddCommentRow>
          <AddCommentRow>
            <AddCommentInput
              value={comment}
              placeholder="leave a comment"
              onChange={handleChangeComment}
            />
          </AddCommentRow>
          <AddCommentRow align="right">
            <PrimaryButton
              type="submit"
              onClick={handlePostComment}
            >
              comment
            </PrimaryButton>
          </AddCommentRow>
        </AddCommentForm>
      }
    </CommentsSection>
  );
};

export default Comments;
