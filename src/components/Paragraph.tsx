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

const Text = styled.p`
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
