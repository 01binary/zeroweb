import React, { FC } from 'react';
import styled from 'styled-components';
import Paragraph from './Paragraph/Paragraph';
import Bullet from '../../images/url/list-bullet.svg';

const List = styled.ul`
  list-style-image: url(${Bullet});
  list-style-type: 'circle';

  li {
    margin: 0.5em 0;
    padding-left: ${(props) => props.theme.border};
  }
`;

const UnorderedList: FC = ({ children }) => (
  <Paragraph>
    <List>{children}</List>
  </Paragraph>
);

export default UnorderedList;
