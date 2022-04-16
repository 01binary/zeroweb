import React, { FC } from 'react';
import styled from 'styled-components';

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

const Blockquote: FC = ({ children }) => <Quote>{children}</Quote>;

export default Blockquote;
