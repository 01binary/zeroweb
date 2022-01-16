/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Renders a paragraph of text
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC, useRef } from 'react';
import stringHash from 'string-hash';
import styled from 'styled-components';
import { useCommentsContext } from '../hooks/useComments';
import { useTooltip } from '../hooks/useTooltip';
import { Tooltip, Arrow } from './Tooltip';
import { RulerMarker, RulerMarkerBadge } from './RulerMarker';
import RulerHighlightIcon from '../images/ruler-highlight.svg';
import RulerCommentIcon from '../images/ruler-comment.svg';
import AddCommentIcon from '../images/add-comment.svg';
import { RULER_ENDMARK_WIDTH } from './Ruler';

const Text = styled.p`
  position: relative;

  margin-right: calc(
    -30% - ${RULER_ENDMARK_WIDTH}px - ${(props) => props.theme.borderThick} - ${(props) => props.theme.spacingOneAndHalf}
  );
  padding-right: calc(
    30% + ${RULER_ENDMARK_WIDTH}px + ${(props) => props.theme.borderThick} +
      ${(props) => props.theme.spacingOneAndHalf}
  );

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: ${(props) => props.theme.spacingOneAndHalf};
    width: calc(${(props) => props.theme.border} * 1.5);
    height: 100%;
    background: ${(props) => props.theme.foregroundColor};
    opacity: 0.4;
    transition: opacity ${(props) => props.theme.animationFast} ease-out;
    z-index: -1;
  }

  &:hover:after {
    opacity: 1;
  }

  &:hover button {
    opacity: 1;
  }

  &:hover .paragraph__ruler-marker {
    display: none;
  }

  code {
    position: relative;
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
      'Courier New', monospace;
    font-size: medium;
    background: ${(props) =>
      props.theme.isDark
        ? props.theme.dropShadowDarkColor
        : props.theme.accentLightColor};
    padding: ${(props) => props.theme.spacingQuarter};
  }

  @media (max-width: ${(props) => props.theme.wide}) {
    &:after {
      display: none;
    }
  }

  @media (max-width: ${(props) => props.theme.mobile}) {
    padding-right: 0;
    margin-right: ${(props) => props.theme.spacingHalf};

    .paragraph__ruler-marker {
      display: none;
    }
  }
`;

const InlineCommentButton = styled.button`
  position: absolute;
  width: 32px;
  height: 32px;
  top: calc(0px - ${(props) => props.theme.borderThick});
  right: 0.25em;
  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;
  padding: 0;
  opacity: 0;
  transition: opacity ${(props) => props.theme.animationFast} ease-out;

  // Flickers on Safari due to opacity
  transform-style: preserve-3d;
  backface-visibility: hidden;

  @media (max-width: ${(props) => props.theme.wide}) {
    z-index: 1000;
    right: 4em;
  }

  @media (max-width: ${(props) => props.theme.mobile}) {
    display: none;
  }
`;

const getHash = (children: any): string =>
  typeof children === 'string'
    ? `p${stringHash(children.toString())}`
    : 'p-unknown';

const Paragraph: FC = (props) => {
  const { comments: responses, showTipFor, hideTip } = useCommentsContext();
  const commentButtonRef = useRef<HTMLElement>(null);
  const hash = getHash(props.children);
  const relevant = responses?.filter(({ paragraph }) => paragraph === hash);
  const highlights = relevant?.filter(({ rangeLength }) => rangeLength);
  const comments = relevant?.filter(({ markdown }) => markdown);
  const displayHighlight = Boolean(highlights?.length && !comments?.length);
  const displayComment = Boolean(comments?.length);
  const displayMarker = displayComment || displayHighlight;

  return (
    <Text id={hash}>
      {props.children}

      <InlineCommentButton
        ref={commentButtonRef}
        onMouseOver={() => showTipFor(null, commentButtonRef)}
        onMouseOut={() => hideTip()}
      >
        <AddCommentIcon />
      </InlineCommentButton>

      {displayMarker && (
        <RulerMarker className="paragraph__ruler-marker">
          {displayHighlight && (
            <>
              <RulerHighlightIcon />
              {highlights.length > 1 && (
                <RulerMarkerBadge className="paragraph__ruler-marker__badge">
                  {highlights.length}
                </RulerMarkerBadge>
              )}
            </>
          )}
          {displayComment && (
            <>
              <RulerCommentIcon />
              {comments.length > 1 && (
                <RulerMarkerBadge className="paragraph__ruler-marker__badge">
                  {comments.length}
                </RulerMarkerBadge>
              )}
            </>
          )}
        </RulerMarker>
      )}
    </Text>
  );
};

export default Paragraph;
