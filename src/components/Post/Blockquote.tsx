import React, { FC } from 'react';
import styled from 'styled-components';

const Quote = styled.blockquote`
  font-weight: 300;
  font-style: italic;

  margin: 0;
  padding: 0;

  p {
    padding-left: 1em;
  }
`;

const Blockquote: FC = ({ children }) => <Quote>{children}</Quote>;

export default Blockquote;
