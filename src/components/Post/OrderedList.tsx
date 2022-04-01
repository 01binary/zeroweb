import React, { FC } from 'react';
import styled from 'styled-components';
import Paragraph from './Paragraph/Paragraph';

const List = styled.ol`
  position: relative;
  list-style: none;
  counter-reset: listCounter;
  padding-left: ${(props) => props.theme.spacingHalf};

  li {
    margin: 0 0 ${(props) => props.theme.spacingHalf} 0;
    &:before {
      display: inline-block;
      content: counter(listCounter);
      color: ${(props) => props.theme.foregroundColor};
      counter-increment: listCounter;
      line-height: ${(props) => props.theme.spacingOneAndThird};
      background: ${(props) =>
        props.theme.isDark
          ? props.theme.alwaysDarkColor
          : props.theme.accentLightShadowColor};
      width: ${(props) => props.theme.spacingOneAndThird};
      height: ${(props) => props.theme.spacingOneAndThird};
      border-radius: ${(props) => props.theme.spacingOneAndThird};
      margin: 0 ${(props) => props.theme.spacingHalf} 0 0;
      text-align: center;
      transition: color ${(props) => props.theme.animationFast} ease-in-out,
        background-color ${(props) => props.theme.animationFast} ease-in-out;
    }

    &:hover:before,
    &:focus:before {
      color: ${(props) => props.theme.backgroundColor};
      background: ${(props) =>
        props.theme.isDark
          ? props.theme.accentColor
          : props.theme.accentShadowColor};
    }
`;

const OrderedList: FC = ({ children }) => (
  <Paragraph>
    <List>{children}</List>
  </Paragraph>
);

export default OrderedList;
