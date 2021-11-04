import React, { FC, useLayoutEffect, useState, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { ApolloClient } from 'apollo-client';
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
import { CommentQuery } from '../types/AllCommentsQuery';

dayjs.extend(relativeTime);

type CommentsProps = {
  slug: string;
  client: ApolloClient;
  comments: CommentQuery[] | null;
  loading: boolean;
  error: string | null;
  readPosition: number;
  scrollOffset: number;
};

type CommentVotesProps = {
  upVotes: number;
  downVotes: number;
  maxVotes: number;
  maxSlots: number;
};

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

const CommentsSection = styled.footer`
  h2 {
    font-size: ${props => props.theme.headingFontSizeMedium};
    font-weight: ${props => props.theme.headingFontWeight};
  }

  p, li {
    font-family: ${props => props.theme.smallFont};
    font-size: ${props => props.theme.smallFontSize};
    font-weight: ${props => props.theme.smallFontWeight};
    line-height: 1.7em;
  }

  margin-top: ${props => props.isUserLoggedIn ? 4 : -1}em;

  @media(max-width: ${props => props.theme.desktop}) {
    margin-top: 0;
  }

  @media(max-width: ${props => props.theme.mobile}) {
    max-width: initial;
    margin-right: 0.25em;
    margin-top: 0;
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
  margin-bottom: 1em;
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
  margin-bottom: ${props => props.theme.spacingDouble};
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
    .comment-votes__scale {
      right: calc(${AVATAR_TILE_OFFSET}px + ${VOTE_SLOT_WIDTH}px + 2.5em);
    }

    button {
      opacity: 1;
    }

    &:after {
      opacity: 1;
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

const Vote = styled.span`
  display: inline-block;
  width: ${VOTE_SLOT_WIDTH}px;
`;

const DownVote = styled(Vote)`
  color: ${props => props.theme.focusColor};
`;

const UpVote = styled(Vote)`
  color: ${props => props.theme.successColor};
`;

const VoteButton = styled.button`
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
  margin: 0 ${props => props.theme.spacing} 0 ${props => props.theme.spacingHalf};

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
`;

const CommentDate = styled.span`
  position: absolute;
  left: calc(80% - ${props => props.theme.spacingHalf} - ${props => props.theme.border});
  width: 8em;

  @media(max-width: ${props => props.theme.mobile}) {
    display: none;
  }
`;

const Comments: FC<CommentsProps> = ({
  slug,
  client,
  comments,
  loading,
  error,
  readPosition,
  scrollOffset,
}) => {
  const { user } = useBlogContext();
  const commentsMarkerOffsetRef = useRef<number>(0);
  const commentsIndexRef = useRef<number>(0);
  const commentSpansRef = useRef<number[]>([]);
  const commentsRef = useRef<HTMLElement>();
  const markerRef = useRef<HTMLElement>();
  const listedComments = comments
    ?.filter(({ markdown }) => markdown && markdown.length)
    ?.sort(({ timestamp: timestamp1 }, { timestamp: timestamp2 }) => (
      timestamp1.localeCompare(timestamp2)
    ));
  const maxVotes = listedComments?.reduce(
    (acc, { upVotes, downVotes }) => Math.max(acc, upVotes && downVotes ? upVotes + downVotes : 0), 0
  ) || 0;

  useLayoutEffect(() => {
    // Calculate % scrolled through comments and comment index in view
    if (commentsRef.current && listedComments && listedComments.length > 0) {
      const commentsRect = commentsRef.current.getBoundingClientRect();
      const { height: markerHeight } = markerRef.current.getBoundingClientRect();
      const bodyRect = document.body.getBoundingClientRect();
      const commentsTop = commentsRect.top - bodyRect.top;
      const spans = [];

      const offsetPercent = Math.max(0, Math.min(commentsRect.height,
        (scrollOffset + window.innerHeight * 0.75 - commentsTop)
      )) / commentsRect.height;

      const { current } = listedComments.reduce(
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
      commentsIndexRef.current = readPosition > .99 ? listedComments.length - 1 : current;
      commentSpansRef.current = spans;
    }
  }, [scrollOffset, listedComments]);

  return (
    <CommentsSection isUserLoggedIn={Boolean(user)}>
      {listedComments && (
        <h2>
          Comments
          {listedComments.length &&
            <span>&nbsp;[&nbsp;{listedComments.length}&nbsp;]</span>
          }
        </h2>
      )}
      {loading && <p>Loading comments...</p>}
      {error && <Error>{error}</Error>}

      <Login />

      {listedComments && listedComments.length > 0 && (
        <>
          <CommentsStartDate>
            {formatMarkerDate(listedComments[0].timestamp)}
          </CommentsStartDate>
          <CommentsList ref={commentsRef}>
            {listedComments
              .map(({
                timestamp,
                markdown,
                avatarUrl,
                userId,
                userName,
                upVotes,
                downVotes,
              }, index) => (
                <Comment
                  key={timestamp}
                  id={`comment-${timestamp}`}
                  scrollHighlight={index === commentsIndexRef.current}
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
                    <UpVoteButton title="Up vote">
                      <UpVoteIcon />
                    </UpVoteButton>
                    <DownVoteButton title="Down vote">
                      <DownVoteIcon />
                    </DownVoteButton>
                  </CommentAvatar>
                  <MetaLink to={`/users/${userId}`}>{userName}</MetaLink>
                  <CommentDate>
                    <MetaLink to={`?comment=${encodeURIComponent(timestamp)}`}>
                      {' '}
                      {formatCommentDate(timestamp)}
                    </MetaLink>
                  </CommentDate>
                  <CommentContent>
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                  </CommentContent>
                </Comment>
              ))}
              <DateMarker offset={`${commentsMarkerOffsetRef.current}px`}>
                <CommentMarker />
                <DateMarkerLabel ref={markerRef}>
                  <MarkerCount>
                    {commentsIndexRef.current + 1}
                    {' / '}
                    {listedComments.length}
                  </MarkerCount>
                  {formatMarkerDate(
                    listedComments[commentsIndexRef.current].timestamp
                  )}
                </DateMarkerLabel>
              </DateMarker>
          </CommentsList>
          <CommentsEndDate>
            {formatMarkerDate(listedComments[listedComments.length - 1].timestamp)}
          </CommentsEndDate>
        </>
      )}
    </CommentsSection>
  );
};

export default Comments;
