import React, { FC } from 'react';
import styled from 'styled-components';

const Decorator = styled.span`
  color: ${(props) => props.theme.secondaryTextColor};
  margin-left: ${(props) => props.theme.spacingHalf};
  margin-right: ${(props) => props.theme.spacingHalf};
`;

const Quote = styled.blockquote`
  position: relative;
  margin: 0;
  padding: 0;

  & > section > p {
    padding-left: ${(props) => props.theme.spacing};
    font-weight: 300;
    font-style: italic;
  }
`;

const Blockquote: FC = ({ children }) => (
  <Quote>
    <Decorator>/*</Decorator>
    {children}
    <Decorator>*/</Decorator>
  </Quote>
);

export default Blockquote;
