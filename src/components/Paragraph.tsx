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

import React, { FC } from 'react';
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

  margin-right: calc(-30% - ${RULER_ENDMARK_WIDTH}px - ${props => props.theme.borderThick} - ${props => props.theme.spacingOneAndHalf});
  padding-right: calc(30% + ${RULER_ENDMARK_WIDTH}px + ${props => props.theme.borderThick} + ${props => props.theme.spacingOneAndHalf});

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: ${props => props.theme.spacingOneAndHalf};
    width: calc(${props => props.theme.border} * 1.5);
    height: 100%;
    background: ${props => props.theme.foregroundColor};
    opacity: .4;
    transition: opacity ${props => props.theme.animationFast} ease-out;
  }

  &:hover:after {
    opacity: 1
  }

  &:hover button {
    opacity: 1;
  }

  &:hover .paragraph__ruler-marker {
    border-color: ${props => props.theme.foregroundColor};
  }
`;

const InlineCommentButton = styled.button`
  position: absolute;
  width: 32px;
  height: 32px;
  top: -${props => props.theme.borderThick};
  right: ${props => props.theme.spacingQuarter};
  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;
  opacity: 0;
  transition: opacity ${props => props.theme.animationFast} ease-out;
`;

const getHash = (children: any): string => (
  typeof children === 'string'
    ? `p${stringHash(children.toString())}`
    : 'p-unknown'
);

const Paragraph: FC = (props) => {
  const { comments: responses } = useCommentsContext();
  const hash = getHash(props.children);
  const relevant = responses?.filter(({ paragraph }) => paragraph === hash);
  const highlights = relevant?.filter(({ rangeLength }) => rangeLength);
  const comments = relevant?.filter(({ markdown }) => markdown);
  const displayHighlight = Boolean(highlights?.length && !comments?.length);
  const displayComment = Boolean(comments?.length);
  const displayMarker = displayComment || displayHighlight;
  const {
    showTip,
    hideTip,
    tipProps,
    tipRef,
    targetRef
  } = useTooltip({
    verticalOffsetDesktop: 10,
    verticalOffsetMobile: 5,
    placement: 'top'
  });

  return (
    <Text id={hash}>
      {props.children}

      <InlineCommentButton
        ref={targetRef}
        onMouseOver={showTip}
        onMouseOut={hideTip}
      >
        <AddCommentIcon />
        <Tooltip ref={tipRef} {...tipProps}>
          comment
          <Arrow />
        </Tooltip>
      </InlineCommentButton>

      {displayMarker &&
        <RulerMarker className="paragraph__ruler-marker">
          {displayHighlight &&
            <>
              <RulerHighlightIcon/>
              {highlights.length > 1 &&
                <RulerMarkerBadge>
                  {highlights.length}
                </RulerMarkerBadge>
              }
            </>
          }
          {displayComment &&
            <>
              <RulerCommentIcon/>
              {comments.length > 1 &&
                <RulerMarkerBadge>
                  {comments.length}
                </RulerMarkerBadge>
              }
            </>
          }
        </RulerMarker>
      }
    </Text>
  );
};

export default Paragraph;
