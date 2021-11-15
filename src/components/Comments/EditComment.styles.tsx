import styled from 'styled-components';

export const EditCommentForm = styled.form`
  position: relative;
  width: calc(100% - 3em);
  margin-top: ${props => props.theme.spacingHalf};
  margin-bottom: -${props => props.theme.spacing};
`;

export const EditCommentInput = styled.textarea`
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

export const EditCommentButtonGroup = styled.div`
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
