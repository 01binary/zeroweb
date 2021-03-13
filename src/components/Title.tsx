import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

const buttonWidth = 110;
const buttonHeight = 50;
const bulletWidth = 5;
const bulletHeight = 20;
const collectionOffsets = [ "articles", "projects", "about" ];

const Heading = styled.h1`
    margin-top: 0;

    @media (max-width: ${props => props.theme.mobile}) {
        margin-left: ${props => props.theme.spacingHalf};
    }
`;

const Graphic = styled.svg`
    margin-bottom:-8px;

    .title-bullet {
        fill: ${props => props.theme.primaryColor};
        stroke: none;
    }

    .title-callout {
        fill: none;
        stroke: ${props => props.theme.primaryColor};
    }

    @media (max-width: ${props => props.theme.mobile}) {
        display: none;
    }
`;

const getGeometry = (
    points: Array<Array<number>>
): string => points
    .reduce((acc, cur, index) => 
        acc +
            (index ? ' L ' : '') +
            cur[0] + ' ' + cur[1]
    , 'M ');

interface ITitleProps {
    collection: string
};

const Title: FunctionComponent<ITitleProps> = ({
    collection,
    children
}) => {
    const bulletTop = Math.ceil(buttonHeight / 2 - buttonHeight * 0.1);
    const calloutTop = Math.ceil(bulletTop / 2) + 0.5;
    const left = buttonWidth * (collectionOffsets.indexOf(collection) + 1);

    return (
        <Heading>
            <Graphic
                width={left}
                height={buttonHeight}
            >
                <path d={getGeometry([
                    [ 0, bulletTop ],
                    [ 0, bulletTop + bulletHeight ],
                    [ bulletWidth, bulletTop + bulletHeight ],
                    [ bulletWidth, bulletTop + 3 ]]) + 'z'}
                    className="title-bullet"
                />
                <path d={getGeometry([
                    [ 0.5, bulletTop + 1 ],
                    [ 0.5, calloutTop ],
                    [ left - bulletTop / 2, calloutTop ],
                    [ left - 1, 0 ]])}
                    className="title-callout"
                />
            </Graphic>
            {children}
        </Heading>
    );
};

export default Title;
