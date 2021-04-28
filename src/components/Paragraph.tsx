/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Renders a paragraph of text
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC } from 'react';
import stringHash from 'string-hash';
import styled from 'styled-components';
import { RULER_OFFSET } from './Ruler';

const Text = styled.p`
  position: relative;

  &:after {
    content: '';
    position: absolute;
    left: calc(100% + ${props => props.theme.spacing} + ${props => props.theme.border} + ${RULER_OFFSET}px);
    top: 0;
    width: calc(${props => props.theme.border} * 1.5);
    height: 100%;
    background: ${props => props.theme.foregroundColor};
    opacity: 0;
    transition: opacity ${props => props.theme.animationFast} ease-out;
  }

  &:hover:after {
    opacity: 1
  }
`;

const getHash = (children: any): string => (
  typeof children === 'string'
    ? `p${stringHash(children.toString())}`
    : 'p-unknown'
);

const Paragraph: FC = ({ children }) => (
  <Text id={getHash(children)}>{children}</Text>
);

export default Paragraph;
