import React, { FC } from 'react';
import styled from 'styled-components';
import Paragraph from './Paragraph/Paragraph';

const List = styled.ul`
  li {
    margin: 0.5em 0;
  }
`;

const UnorderedList: FC = ({ children }) => (
  <Paragraph>
    <List>{children}</List>
  </Paragraph>
);

export default UnorderedList;
