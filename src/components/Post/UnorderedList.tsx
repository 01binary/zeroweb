import React, { FC } from 'react';
import styled from 'styled-components';
import Paragraph from './Paragraph/Paragraph';
import Bullet from '../../images/url/list-bullet.svg';

export const List = styled.ul`
  list-style-image: url(${Bullet});
  list-style-type: 'circle';

  li {
    margin: 0.5em 0;
    padding-left: ${(props) => props.theme.border};

    code {
      position: relative;
      font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
        'Courier New', monospace;
      font-size: 18px;
      background: ${(props) =>
        props.theme.isDark
          ? props.theme.dropShadowDarkColor
          : props.theme.accentLightColor};
      padding: 6px;
      pointer-events: none;
    }

    mark {
      background-color: ${(props) => props.theme.secondaryColor};
      color: ${(props) => props.theme.backgroundColor};
      padding: 2px;

      code {
        color: ${(props) => props.theme.backgroundColor};
        background: none;
      }

      a {
        color: ${(props) => props.theme.backgroundColor};
      }
    }
  }
`;

const UnorderedList: FC = ({ children }) => (
  <Paragraph>
    <List>{children}</List>
  </Paragraph>
);

export default UnorderedList;
