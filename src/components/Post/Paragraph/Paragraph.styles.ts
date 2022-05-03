import styled from 'styled-components';
import { RULER_ENDMARK_WIDTH } from '../../../components/Ruler';
import { ParagraphSelection } from '../../../hooks/useComments';
import {
  MOBILE,
  NARROW_FLIP_MARKERS,
  NARROW_NO_MARKER_LABELS,
  NARROW_NO_RULERS,
} from '../../../constants';

export const ParagraphWrapper = styled.section<{
  showCommentsSidebar: boolean;
  editingComment: boolean;
}>`
  position: relative;

  margin-right: calc(
    0px - 30% - ${RULER_ENDMARK_WIDTH}px - ${(props) => props.theme.borderThick} -
      ${(props) => props.theme.spacingOneAndHalf}
  );

  padding-right: calc(
    30% + ${RULER_ENDMARK_WIDTH}px + ${(props) => props.theme.borderThick} +
      ${(props) => props.theme.spacingOneAndHalf}
  );

  .paragraph__comment-button {
    opacity: ${(props) => (props.editingComment ? 1 : 0)};
  }

  .paragraph__ruler-marker {
    ${(props) => props.editingComment && 'display:none'};
  }

  &:hover .paragraph__comment-button {
    opacity: 1;
  }

  .paragraph__ruler-marker__badge {
    opacity: ${(props) => (props.showCommentsSidebar ? 0 : 1)};
  }

  &:hover .paragraph__ruler-marker {
    display: none;
  }

  iframe {
    border: ${(props) => props.theme.border} solid
      ${(props) => props.theme.borderColor};
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: ${(props) => props.theme.spacingOneAndHalf};
    width: calc(${(props) => props.theme.border} * 1.5);
    height: 100%;
    background: ${(props) =>
      props.editingComment
        ? props.theme.secondaryColor
        : props.theme.foregroundColor};
    opacity: ${(props) => (props.editingComment ? 1 : 0.4)};
    transition: opacity ${(props) => props.theme.animationFast} ease-out;
    z-index: -1;
  }

  &:hover:after {
    opacity: 1;
  }

  @media (max-width: ${NARROW_FLIP_MARKERS}) {
    margin-right: calc(0px - 30% - ${RULER_ENDMARK_WIDTH}px);
    padding-right: calc(30% + ${RULER_ENDMARK_WIDTH}px);

    &:after {
      right: calc(0px - ${(props) => props.theme.borderThick});
    }
  }

  @media (max-width: ${NARROW_NO_RULERS}) {
    margin-right: 0;
    padding-right: 0;

    &:after {
      display: none;
    }
  }

  @media (max-width: ${MOBILE}) {
    padding-right: 0;
    margin-right: 0;

    .paragraph__ruler-marker {
      display: none;
    }
  }
`;

export const ParagraphNonText = styled.div`
  margin: 0 ${(props) => props.theme.spacingHalf};
`;

export const ParagraphText = styled.p`
  code {
    position: relative;
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
      'Courier New', monospace;
    font-size: 18px;
    background: ${(props) =>
      props.theme.isDark
        ? props.theme.dropShadowDarkColor
        : props.theme.accentLightColor};
    padding: 6px;
    pointer-events: none;
  }

  mark {
    background-color: ${(props) => props.theme.secondaryColor};
    color: ${(props) => props.theme.backgroundColor};
    padding: 2px;

    code {
      color: ${(props) => props.theme.backgroundColor};
      background: none;
    }

    a {
      color: ${(props) => props.theme.backgroundColor};
    }
  }
`;

export const ActiveParagraphListHighlight = styled.div.attrs(() => ({
  className: 'paragraph__highlight',
}))`
  position: relative;
  background: ${(props) => props.theme.secondaryColor};

  &:before {
    content: '';
    position: absolute;
    background: ${(props) => props.theme.secondaryColor};
    top: calc(0px - ${(props) => props.theme.spacingQuarter});
    height: ${(props) => props.theme.spacingQuarter};
    left: 0;
    right: 0;
  }

  &:after {
    content: '';
    position: absolute;
    background: ${(props) => props.theme.secondaryColor};
    bottom: calc(0px - ${(props) => props.theme.spacingQuarter});
    height: ${(props) => props.theme.spacingQuarter};
    left: 0;
    right: 0;
  }

  li {
    color: ${(props) => props.theme.backgroundColor};

    &:before {
      background: none !important;
      color: ${(props) => props.theme.backgroundColor} !important;
    }

    &:after {
      content: initial !important;
    }
  }

  a {
    color: ${(props) => props.theme.backgroundColor};
  }
`;

export const ActiveParagraphTextHighlight = styled.span.attrs(() => ({
  className: 'paragraph__highlight',
}))`
  background: ${(props) => props.theme.secondaryColor};
  color: ${(props) => props.theme.backgroundColor};
  ${(props) => !props.noPadding && `padding: 2px`};

  code {
    color: ${(props) => props.theme.backgroundColor};
    background: none;
  }

  a {
    color: ${(props) => props.theme.backgroundColor};
  }
`;

export const SelectionAnchor = styled.span<ParagraphSelection>`
  display: block;
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  background: none;
  pointer-events: none;
`;

export const CommentButton = styled.button`
  position: absolute;
  width: 32px;
  height: 32px;
  top: calc(0px - ${(props) => props.theme.borderThick});
  right: calc(
    ${(props) => props.theme.spacingHalf} -
      ${(props) => props.theme.borderThick} - ${(props) => props.theme.border}
  );
  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;
  padding: 0;
  transition: opacity ${(props) => props.theme.animationFast} ease-out;

  // Flickers on Safari due to opacity
  transform-style: preserve-3d;
  backface-visibility: hidden;

  svg {
    pointer-events: none;
  }

  @media (max-width: ${NARROW_NO_MARKER_LABELS}) {
    right: initial;
    top: calc(0px - ${(props) => props.theme.border} * 2);
    left: calc(
      0px - ${(props) => props.theme.spacing} + ${(props) => props.theme.border}
    );
  }

  @media (max-width: ${MOBILE}) {
    display: none;
  }
`;
