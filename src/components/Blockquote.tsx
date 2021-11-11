import React, { FC } from 'react';
import styled from 'styled-components';

const Quote = styled.blockquote`
  margin-right: -9px;
  padding-right: 0;

  p {
    margin-left: 0;
    padding-left: 0;
  }

  @media (max-width: ${props => props.theme.mobile}) {
    body {
      margin-right: initial;
      padding-right: initial;
    }
  }
`;

const Blockquote: FC = ({ children }) => (
  <Quote>
    {children}
  </Quote>
);

export default Blockquote;
