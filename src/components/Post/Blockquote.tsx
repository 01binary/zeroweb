import React, { FC } from 'react';
import styled from 'styled-components';
import QuoteIcon from '../../images/quote.svg';

const StyledQuoteIcon = styled(QuoteIcon)`
  position: absolute;
  top: 0;
  left: ${(props) => props.theme.spacingHalf};
`;

const Quote = styled.blockquote`
  position: relative;
  margin: 0;
  padding: 0;

  & > svg {
    fill: ${(props) =>
      props.theme.isDark
        ? props.theme.borderColor
        : props.theme.accentLightShadowColor};
  }

  & > section > p {
    padding-top: ${(props) => props.theme.spacingHalf};
    padding-left: ${(props) => props.theme.spacingOneAndHalf};
    font-weight: 300;
    font-style: italic;
  }
`;

const Blockquote: FC = ({ children }) => (
  <Quote>
    <StyledQuoteIcon />
    {children}
  </Quote>
);

export default Blockquote;
