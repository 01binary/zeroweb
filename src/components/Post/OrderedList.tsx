import React, { FC } from 'react';
import styled from 'styled-components';
import Paragraph from '../Paragraph/Paragraph';
import Number from '../../images/url/list-number.svg';

const List = styled.ol`
  list-style: none;
  counter-reset: listCounter;
  padding-left: calc(${(props) => props.theme.spacingDouble} + ${(props) =>
  props.theme.spacingHalf});

  li {
    position: relative;
    margin: 0 0 ${(props) => props.theme.spacingHalf} 0;
  
    &:before {
      content: counter(listCounter);
      counter-increment: listCounter;
      display: inline-block;
      color: ${(props) => props.theme.foregroundColor};
      line-height: ${(props) => props.theme.normalFontLineHeight};
      background: url(${Number});
      background-position: top 0px right 0px;
      width: 60px;
      height: 28px;
      text-align: center;
      margin-left: calc(0px - 60px - ${(props) => props.theme.spacingHalf});
      margin-right: ${(props) => props.theme.spacingHalf};
    }

    &:after {
      content: '';
      display: block;
      position: absolute;
      bottom: calc(0px - ${(props) => props.theme.spacing});
      width: 55px;
      height: calc(100% + ${(props) => props.theme.spacingHalf});
      left: calc(0px - 60px - ${(props) => props.theme.spacingHalf});
      border-left: ${(props) => props.theme.border} dotted
        ${(props) => props.theme.borderColor};
      border-right: ${(props) => props.theme.border} dotted
        ${(props) => props.theme.borderColor};
    }

    &:last-of-type {
      &:after {
        content: initial;
      }
    }

    p {
      margin-top: -${(props) => props.theme.spacing};
    }

    section+section > p {
      margin-top: 0;
    }

    section {
      &:after {
        display: none;
      }
    }

    .paragraph__comment-button {
      display: none;
    }
`;

const OrderedList: FC = ({ children }) => (
  <Paragraph>
    <List>{children}</List>
  </Paragraph>
);

export default OrderedList;
