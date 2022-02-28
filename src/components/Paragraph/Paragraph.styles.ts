import styled from 'styled-components';
import { RULER_ENDMARK_WIDTH } from '../Ruler';
import { DESKTOP, MOBILE, SLIDE_COMMENTS_SIDEBAR, WIDE } from '../../constants';
import { ParagraphSelection } from '../../hooks/useComments';

type ParagraphSectionProps = {
  showCommentsSidebar: boolean;
  editingComment: boolean;
};

export const ParagraphSection = styled.section<ParagraphSectionProps>`
  position: relative;

  margin-right: calc(
    0px - 30% - ${RULER_ENDMARK_WIDTH}px - ${(props) => props.theme.borderThick} -
      ${(props) => props.theme.spacingOneAndHalf}
  );

  padding-right: calc(
    30% + ${RULER_ENDMARK_WIDTH}px + ${(props) => props.theme.borderThick} +
      ${(props) => props.theme.spacingOneAndHalf}
  );

  .paragraph__comment {
    opacity: 0;
  }

  .paragraph__ruler-marker__badge {
    opacity: ${(props) => (props.showCommentsSidebar ? 0 : 1)};
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

  &:hover button {
    opacity: 1;
  }

  &:hover .paragraph__ruler-marker {
    display: none;
  }

  @media (max-width: 1070px) {
    &:after {
      display: none;
    }
  }

  @media (max-width: 1136px) {
    margin-right: calc(
      0px - 30% - ${RULER_ENDMARK_WIDTH}px -
        ${(props) => props.theme.borderThick}
    );

    padding-right: calc(
      30% + ${RULER_ENDMARK_WIDTH}px + ${(props) => props.theme.borderThick}
    );

    &:after {
      right: 2px;
    }
  }

  @media (max-width: ${MOBILE}) {
    padding-right: 0;
    margin-right: ${(props) => props.theme.spacingHalf};

    .paragraph__ruler-marker {
      display: none;
    }
  }
`;

export const ParagraphText = styled.p<{ editingComment: boolean }>`
  background: ${(props) =>
    props.editingComment ? props.theme.secondaryColor : 'initial'};
  color: ${(props) =>
    props.editingComment ? props.theme.backgroundColor : 'initial'};

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
    pointer-events: none;
  }

  mark {
    background-color: ${(props) => props.theme.secondaryColor};
    color: ${(props) => props.theme.backgroundColor};

    code {
      color: ${(props) => props.theme.backgroundColor};
      background: none;
    }
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

  @media (max-width: 1195px) {
    right: initial;
    top: 0;
    left: calc(
      0px - ${(props) => props.theme.spacing} -
        ${(props) => props.theme.spacingHalf}
    );
  }

  @media (max-width: ${MOBILE}) {
    display: none;
  }
`;

export const InlineCommentsSection = styled.section<{ current: boolean }>`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 100%;
  min-width: 7em;
  max-width: 15em;
  width: calc(25% - 1em);
  background: ${(props) => props.theme.backgroundColor};

  font-family: ${(props) => props.theme.normalFont};
  font-weight: ${(props) => props.theme.normalFontWeight};
  font-size: ${(props) => props.theme.normalFontSize};
  color: ${(props) => props.theme.foregroundColor};

  p {
    margin-left: 0;
    margin-right: 0;
  }

  @media (max-width: ${SLIDE_COMMENTS_SIDEBAR}) {
    ${(props) => props.current === false && 'display: none'};
    border: 1px solid gray;
    left: initial;
    padding: 30px;
    right: 0;
    width: 40%;
    min-width: 7em;
    max-width: 15em;
    z-index: 2;
  }

  @media (max-width: ${MOBILE}) {
    right: 0;
  }
`;

export const InlineComment = styled.div`
  font-family: ${(props) => props.theme.smallFont};
  font-weight: ${(props) => props.theme.smallFontWeight};
  font-size: ${(props) => props.theme.smallFontSize};
  color: ${(props) => props.theme.foregroundColor};

  border: 1px;
`;

export const InlineCommentForm = styled.form`
  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  font-weight: ${(props) => props.theme.smallFontWeight};

  width: 100%;
`;

export const InlineCommentInput = styled.textarea`
  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  font-weight: ${(props) => props.theme.smallFontWeight};

  width: calc(100% - ${(props) => props.theme.spacing});
  min-height: 1.5em;
  max-height: 10em;
  resize: vertical;

  background: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.foregroundColor};
  border: ${(props) => props.theme.border} solid
    ${(props) => props.theme.borderColor};

  padding: ${(props) => props.theme.spacingHalf};
`;

export const InlineCommentFormGroup = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const InlineCommentError = styled(Error)`
  padding: ${(props) => props.theme.spacingQuarter} 0;
`;

export const InlineCommentButton = styled.button`
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

export const Me = styled.span`
  color: ${(props) => props.theme.secondaryTextColor};
`;
