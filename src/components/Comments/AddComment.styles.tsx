import styled from 'styled-components';
import { AVATAR_SIZE } from '../Avatar';

export const AddCommentForm = styled.form`
  position: relative;
  font-family: ${props => props.theme.smallFont};
  font-size: ${props => props.theme.smallFontSize};
  font-weight: ${props => props.theme.smallFontWeight};
  margin-top: ${props => props.hasComments ? 0 : -props.theme.spacing};
  margin-bottom: ${props => props.theme.spacing};
`;

export const AddCommentRow = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% - ${props => props.theme.spacing} - ${props => props.theme.borderThick});
  justify-content: ${props => props.align === 'right' ? 'flex-end' : 'flex-start'};

  @media(max-width: ${props => props.theme.mobile}) {
    width: calc(100% - ${props => props.theme.spacingHalf});
    ${props => props.distribute && 'justify-content: space-between'};
  }
`;

export const AddCommentAvatar = styled.div`
  display: inline;
  margin-left: calc(${props => props.theme.spacing} + ${props => props.theme.border} * 2);

  @media(max-width: ${props => props.theme.mobile}) {
    display: none;
  }
`;

export const AddCommentUser = styled.div`
  display: inline;
  margin: 0 ${props => props.theme.spacingHalf};
`;

export const AddCommentInput = styled.textarea`
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

  @media(max-width: ${props => props.theme.mobile}) {
    margin-left: ${props => props.theme.spacingHalf};
  }
`;
