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
import { RulerMarker } from './RulerMarker';
import RulerHighlightIcon from '../images/ruler-highlight.svg';
import RulerCommentIcon from '../images/ruler-comment.svg';
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

  &:hover .paragraph__ruler-marker {
    border-color: ${props => props.theme.foregroundColor};
    box-shadow: ${props => props.theme.shadowColor} 0px 0px 6px;
  }
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

  return (
    <Text id={hash}>
      {props.children}
      {displayMarker &&
        <RulerMarker className="paragraph__ruler-marker">
          {displayHighlight && <RulerHighlightIcon/>}
          {displayComment && <RulerCommentIcon/>}
        </RulerMarker>
      }
    </Text>
  );
};

export default Paragraph;
