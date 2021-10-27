import React, { FC, useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ApolloClient } from 'apollo-client';
import ReactMarkdown from 'react-markdown';
import useComments from '../hooks/useComments';
import Avatar from '../components/Avatar';
import MetaLink from '../components/MetaLink';
import Login from './Login';
import Error from './Error';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import CommentMarkerIcon from '../images/comment-marker.svg';
import { RULER_ENDMARK_WIDTH } from './Ruler';

dayjs.extend(relativeTime);

type CommentsProps = {
  slug: string;
  client: ApolloClient;
  readPosition: number;
  scrollOffset: number;
};

const COMMENT_SCALE_BREAKPOINT = '1160px';
const AVATAR_TILE_MAX_DIST = 0.2;
const AVATAR_TILE_OFFSET = 19;

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

  @media(max-width: ${props => props.theme.mobile}) {
    max-width: initial;
    margin-right: 0.25em;
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

const CommentsList = styled.ul`
  position: relative;
  list-style-type: none;
  max-width: calc(80% - 5.5em);
  margin-block-end: 0;
  margin-top: 0;
  margin-bottom: ${props => props.theme.spacingDouble};
  margin-left: ${props => props.theme.spacingTriple};
  margin-right: ${props => props.theme.spacingHalf};
  padding-top: 0.5em;
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 0;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: calc(100% + 9.5em);
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

const CommentMarker = styled(CommentMarkerIcon)`
  position: absolute;
  left: calc(-100% + 0.33em);
  top: 1em;
`;

const DateMarker = styled.div`
  position: absolute;
  transition: top ${props => props.theme.animationFast} ease-in-out;
  left: 133%;
  top: ${props => props.offset};
  color: ${props => props.theme.secondaryTextColor};
  height: 1em;
  font-family: monospace;
  font-size: 28pt;
  transform: scaleX(1);

  @media(max-width: ${COMMENT_SCALE_BREAKPOINT}) {
    left: calc(133% + 1em + ${props => props.theme.border});
    transform: scaleX(-1);

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
  top: 1em;
  left: 0;
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

const Comment = styled.li`
  position: relative;
  margin-bottom: .7em;
  padding-right: 1em;

  &:before {
    content: '';
    position: absolute;
    border-right: ${props => props.theme.border} dotted ${props => props.theme.borderColor};
    top: 28px;
    left: -40px;
    height: calc(100% - 20px);
    z-index: -1;
  }

  &:after {
    content: '';
    z-index: -1;
    position: absolute;
    top: 0;
    bottom: 0;
    right: calc(-30% - ${props => props.theme.border} * 2);
    border-right: ${props => props.scrollHighlight
      ? `${props.theme.borderThick} solid ${props.theme.borderColor}`
      : `${props.theme.borderThick} solid ${props.theme.shadowColor}`
    };
  }

  &:hover:after {
    background: ${props => props.theme.isDark
      ? props.theme.foregroundColor + '20'
      : props.theme.accentLightColor};
  }

  &:last-of-type::before {
    height: 100%;
  }
`;

const CommentAvatar = styled.div`
  position: absolute;
  left: calc(-25px - 2em + ${props => getAvatarHorzOffset(props.index, props.distance)}px);
  top: -.5em;
`;

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
  left: calc(100% + 1.3em);
  width: 8em;

  @media(max-width: ${props => props.theme.mobile}) {
    position: initial;
    left: initial;
    width: initial;
  }
`;

// TODO: simplify articles icon into lines of text!
// TODO: try once again to design a simple about icon!

const Comments: FC<CommentsProps> = ({
  slug,
  client,
  readPosition,
  scrollOffset,
}) => {
  const { comments, loading, error } = useComments(slug, client);
  const commentsMarkerOffsetRef = useRef<number>(0);
  const commentsIndexRef = useRef<number>(0);
  const commentSpansRef = useRef<number[]>([]);
  const commentsRef = useRef<HTMLElement>();
  const markerRef = useRef<HTMLElement>();

  useLayoutEffect(() => {
    // Calculate % scrolled through comments and comment index in view
    if (commentsRef.current && comments && comments.length > 0) {
      const commentsRect = commentsRef.current.getBoundingClientRect();
      const { height: markerHeight } = markerRef.current.getBoundingClientRect();
      const bodyRect = document.body.getBoundingClientRect();
      const commentsTop = commentsRect.top - bodyRect.top;
      const spans = [];

      const offsetPercent = Math.max(0, Math.min(commentsRect.height,
        (scrollOffset + window.innerHeight * 0.75 - commentsTop)
      )) / commentsRect.height;

      const { current } = comments.reduce(
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

      const almostAtEnd = readPosition > .99;
      const offsetPixels = commentsRect.height * offsetPercent;

      commentsMarkerOffsetRef.current = offsetPixels > markerHeight
        ? offsetPixels - markerHeight
        : offsetPixels;
      commentsIndexRef.current = almostAtEnd ? comments.length - 1 : current;
      commentSpansRef.current = spans;
    }
  }, [scrollOffset, comments]);

  return (
    <CommentsSection>
      <Login />

      {comments && (
        <h2>
          Comments
          {comments.length && <span>&nbsp;[&nbsp;{comments.length}&nbsp;]</span>}
        </h2>
      )}
      {loading && <p>Loading comments...</p>}
      {error && <Error>{error}</Error>}

      {comments && comments.length > 0 && (
        <>
          <CommentsStartDate>
            {formatMarkerDate(comments[0].timestamp)}
          </CommentsStartDate>
          <CommentsList ref={commentsRef}>
            {comments
              .filter(({ markdown }) => markdown && markdown.length)
              .sort(({ timestamp: timestamp1 }, { timestamp: timestamp2 }) => (
                timestamp1.localeCompare(timestamp2)
              ))
              .map(({
                timestamp,
                markdown,
                avatarUrl,
                userId,
                userName
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
                    {comments.length}
                  </MarkerCount>
                  {formatMarkerDate(
                    comments[commentsIndexRef.current].timestamp
                  )}
                </DateMarkerLabel>
              </DateMarker>
          </CommentsList>
          <CommentsEndDate>
            {formatMarkerDate(comments[comments.length - 1].timestamp)}
          </CommentsEndDate>
        </>
      )}
    </CommentsSection>
  );
};

export default Comments;
